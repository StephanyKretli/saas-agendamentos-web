import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

// Desempacota o .data do Axios E o .data do backend — mesmo contorno usado nas
// outras features (settings.api, services.api).
function unwrap<T>(response: any): T {
  return response?.data?.data ?? response?.data ?? response;
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface OnboardingState {
  /** false para membro de equipe (ownerId setado) — o gate não o intercepta. */
  applies: boolean;
  username: string | null;
  /** slug derivado do nome do salão — fallback pré-preenchido do passo 1. */
  nameSlug: string;
  hasService: boolean;
  hasBusinessHours: boolean;
  onboardingCompletedAt: string | null;
  /** 1 | 3 | 4 — piso de retomada calculado pelo backend. */
  resumeStep: number;
}

export interface UsernameAvailability {
  slug: string;
  available: boolean;
  suggestion?: string;
  reason?: "muito-curto";
}

export interface OnboardingServicePayload {
  name: string;
  priceCents: number;
  durationMinutes: number;
}

export interface OnboardingBusinessHour {
  weekday: number; // 0=Dom ... 6=Sáb
  enabled: boolean;
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export type OnboardingEventAction = "entrou" | "concluiu" | "pulou";

// ---------------------------------------------------------------------------
// Chamadas
// ---------------------------------------------------------------------------

export async function getOnboardingState(): Promise<OnboardingState> {
  const response: any = await api.get("/onboarding/state", { headers: getAuthHeaders() });
  return unwrap<OnboardingState>(response);
}

/** Público — sem auth. Usado no debounce do passo 1. */
export async function checkUsernameAvailable(u: string): Promise<UsernameAvailability> {
  const response: any = await api.get("/auth/username-available", { params: { u } });
  return unwrap<UsernameAvailability>(response);
}

/**
 * Passo 1. Em conflito o backend devolve 409 com `{ message, suggestion }`.
 * O interceptor global transforma isso num `Error` com só a `message`, então
 * aqui chamamos direto e deixamos a sugestão vir do endpoint de disponibilidade.
 */
export async function setOnboardingUsername(username: string): Promise<{ username: string }> {
  const response: any = await api.post(
    "/onboarding/username",
    { username },
    { headers: getAuthHeaders() },
  );
  return unwrap<{ username: string }>(response);
}

export async function createOnboardingService(
  payload: OnboardingServicePayload,
): Promise<{ serviceId: string }> {
  const response: any = await api.post("/onboarding/service", payload, {
    headers: getAuthHeaders(),
  });
  return unwrap<{ serviceId: string }>(response);
}

export async function setOnboardingBusinessHours(
  days: OnboardingBusinessHour[],
): Promise<{ created: number; allDaysOff: boolean }> {
  const response: any = await api.post(
    "/onboarding/business-hours",
    { days },
    { headers: getAuthHeaders() },
  );
  return unwrap<{ created: number; allDaysOff: boolean }>(response);
}

export async function completeOnboarding(): Promise<{
  onboardingCompletedAt: string | null;
  username: string | null;
  justCompleted: boolean;
}> {
  const response: any = await api.post("/onboarding/complete", {}, { headers: getAuthHeaders() });
  return unwrap(response);
}

/** Telemetria — best-effort. Nunca deixa o erro derrubar o fluxo. */
export async function logOnboardingEvent(
  step: number,
  action: OnboardingEventAction,
): Promise<void> {
  try {
    await api.post("/onboarding/events", { step, action }, { headers: getAuthHeaders() });
  } catch {
    /* engolido de propósito — telemetria não bloqueia onboarding */
  }
}
