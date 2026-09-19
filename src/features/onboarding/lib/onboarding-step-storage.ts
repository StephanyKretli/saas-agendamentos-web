// Breadcrumb local de "em que passo do onboarding a pessoa estava" — só serve
// pra sobreviver a fechar a aba/recarregar. Nunca é fonte de verdade (isso é
// o `resumeStep` do backend, calculado a partir de serviço/horário salvos).
//
// Correção de 19/09/2026: a chave era global do navegador ("syncro:onboarding:
// step", sem id de usuário). Quem abandonava no passo 5 (cartão) deixava "5"
// gravado, e a PRÓXIMA conta criada no mesmo aparelho/navegador abria direto
// no passo 5 — sem serviço, sem horário, sem link, direto num formulário de
// cartão. Com campanha no ar isso custava cadastro real. Daqui pra frente:
// 1) a chave é por usuário (claim `sub` do JWT), então duas contas no mesmo
//    navegador nunca compartilham ponteiro;
// 2) mesmo assim, o valor lido do localStorage nunca pode levar a pessoa mais
//    de um passo além do que o servidor sustenta — ver readOnboardingStep.
import { getAccessToken } from "@/lib/auth-storage";

const STEP_STORAGE_PREFIX = "syncro:onboarding:step";

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
}

/**
 * Id do usuário logado, tirado do claim `sub` do JWT — só pra namespacear o
 * breadcrumb no localStorage, não é validação de sessão (isso é o backend em
 * cada request). Decodificação sem lib porque é só ler o payload, não precisa
 * verificar assinatura pra isso. Retorna null se não tiver token ou o token
 * não decodificar (nesse caso o breadcrumb simplesmente não é usado).
 */
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const parsed = JSON.parse(base64UrlDecode(payload));
    return typeof parsed?.sub === "string" ? parsed.sub : null;
  } catch {
    return null;
  }
}

function storageKey(userId: string): string {
  return `${STEP_STORAGE_PREFIX}:${userId}`;
}

/**
 * Lê o passo salvo, já limitado a no máximo `serverFloor + 1` — ou seja, o
 * localStorage só consegue adiantar UM passo além do que o servidor confirma
 * (o passo 4→5 é o único avanço que não bate no backend, ver step-ready.tsx).
 * Sem userId, ou sem valor salvo, ou storage bloqueado (modo privado):
 * retorna null, e quem chamou cai de volta no `serverFloor` puro.
 */
export function readOnboardingStep(
  userId: string | null,
  serverFloor: number,
  totalSteps: number,
): number | null {
  if (typeof window === "undefined" || !userId) return null;
  let raw: number;
  try {
    raw = Number(window.localStorage.getItem(storageKey(userId)));
  } catch {
    return null;
  }
  if (!Number.isFinite(raw) || raw < 1 || raw > totalSteps) return null;
  return Math.min(raw, serverFloor + 1);
}

/** Grava o passo atual. No-op sem userId (não dá pra namespacear com segurança). */
export function storeOnboardingStep(userId: string | null, step: number): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    window.localStorage.setItem(storageKey(userId), String(step));
  } catch {
    /* modo privado / storage bloqueado — sem breadcrumb, o servidor ainda retoma */
  }
}

/**
 * Limpa o breadcrumb do usuário atual (dashboard alcançado, logout, cadastro
 * novo) e, de brinde, a chave antiga sem id — pra ninguém mais herdar lixo
 * dela depois deste deploy.
 */
export function clearOnboardingStep(userId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (userId) window.localStorage.removeItem(storageKey(userId));
    window.localStorage.removeItem(STEP_STORAGE_PREFIX);
  } catch {
    /* noop */
  }
}
