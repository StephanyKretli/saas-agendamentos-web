import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * API de Conversões da Meta (server-side).
 *
 * Existe porque o evento disparado só pelo navegador é perdido por bloqueadores de
 * anúncio e por restrições do iOS — tipicamente 15 a 30% dos cadastros. O evento
 * server-side não passa pelo navegador do usuário, então chega.
 *
 * DEDUPLICAÇÃO: este evento e o `fbq('track', ...)` do navegador enviam o MESMO
 * `event_id` e o MESMO `event_name`. A Meta usa esse par para entender que são o mesmo
 * cadastro e contar uma vez só. Se o event_id divergir, os cadastros contam em dobro e
 * o CPA aparece pela metade do real.
 */

const GRAPH_VERSION = "v21.0";

/** SHA-256 em hexadecimal — formato exigido pela Meta para dados pessoais. */
function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Email normalizado: minúsculo, sem espaços nas pontas. */
function normalizeEmail(email: string): string | null {
  const clean = email.trim().toLowerCase();
  return clean.includes("@") ? clean : null;
}

/**
 * Telefone normalizado para E.164 sem o "+": só dígitos, com código do país.
 * Números brasileiros chegam aqui com 10 ou 11 dígitos (DDD + número) e recebem o 55.
 */
function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.length <= 11) return `55${digits}`;
  return digits;
}

/** IP real do cliente, respeitando proxy reverso. */
function getClientIp(req: NextRequest): string | undefined {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? undefined;
}

type CapiPayload = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  email?: string;
  phone?: string;
  fbp?: string;
  fbc?: string;
};

export async function POST(req: NextRequest) {
  // Sem fallback silencioso: se faltar configuração, isso precisa aparecer no log,
  // não virar um no-op que ninguém percebe por dois meses.
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error(
      "[Meta CAPI] NEXT_PUBLIC_META_PIXEL_ID ou META_CAPI_ACCESS_TOKEN ausente. " +
        "Evento NÃO enviado. Configure as variáveis de ambiente."
    );
    return NextResponse.json(
      { error: "meta_capi_nao_configurada" },
      { status: 500 }
    );
  }

  let body: CapiPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "json_invalido" }, { status: 400 });
  }

  const { eventName, eventId, eventSourceUrl, email, phone, fbp, fbc } = body;

  if (!eventName || !eventId) {
    return NextResponse.json(
      { error: "eventName_e_eventId_sao_obrigatorios" },
      { status: 400 }
    );
  }

  const userData: Record<string, unknown> = {};

  const normalizedEmail = email ? normalizeEmail(email) : null;
  if (normalizedEmail) userData.em = [hash(normalizedEmail)];

  const normalizedPhone = phone ? normalizePhone(phone) : null;
  if (normalizedPhone) userData.ph = [hash(normalizedPhone)];

  // fbp e fbc melhoram muito a taxa de correspondência. Não são dados pessoais
  // e vão sem hash, conforme a documentação da Meta.
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const clientIp = getClientIp(req);
  if (clientIp) userData.client_ip_address = clientIp;

  const userAgent = req.headers.get("user-agent");
  if (userAgent) userData.client_user_agent = userAgent;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: userData,
      },
    ],
    // Preencha META_CAPI_TEST_EVENT_CODE só enquanto estiver validando no
    // Gerenciador de Eventos, em "Testar eventos". Em produção, deixe vazio.
    ...(process.env.META_CAPI_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE }
      : {}),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          access_token: accessToken,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      // Nunca logar o token. O corpo de erro da Meta não o contém.
      console.error("[Meta CAPI] Meta recusou o evento:", result);
      return NextResponse.json(
        { error: "meta_recusou_evento", detalhe: result },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[Meta CAPI] Falha de rede ao enviar evento:", error);
    return NextResponse.json({ error: "falha_de_rede" }, { status: 502 });
  }
}
