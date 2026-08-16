"use client";

/**
 * Disparo de eventos da Meta em duas pernas: navegador (fbq) + servidor (CAPI).
 *
 * As duas pernas mandam o MESMO event_id, e é isso que faz a Meta contar o evento
 * uma vez só. Nunca dispare `fbq('track', ...)` de um evento de conversão sem passar
 * o eventID — sem ele a deduplicação não acontece.
 */

type MetaEventName = "CompleteRegistration" | "Lead" | "Purchase" | "Subscribe";

type TrackOptions = {
  /** Dados do usuário, usados só para melhorar a correspondência. Vão com hash no servidor. */
  email?: string;
  phone?: string;
  /** Parâmetros extras do evento, visíveis no Gerenciador de Eventos. */
  customData?: Record<string, unknown>;
};

/** Lê um cookie do navegador. Retorna undefined se não existir. */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

/**
 * Dispara o evento nas duas pernas.
 *
 * A perna do servidor é best-effort: se falhar, o cadastro do usuário não pode quebrar
 * por causa de rastreamento. O erro vai para o console e a vida segue.
 */
export async function trackMetaEvent(
  eventName: MetaEventName,
  { email, phone, customData }: TrackOptions = {}
): Promise<void> {
  const eventId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Perna 1: navegador
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("track", eventName, customData ?? {}, { eventID: eventId });
  }

  // Perna 2: servidor
  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        email,
        phone,
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
      }),
    });
  } catch (error) {
    console.error("[Meta CAPI] Evento server-side não enviado:", error);
  }
}
