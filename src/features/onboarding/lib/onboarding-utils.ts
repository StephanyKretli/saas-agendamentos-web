// Helpers do fluxo guiado. Mantidos pequenos e sem dependência de React para
// poderem ser testados/reaproveitados à vontade.

/**
 * Mesma regra do backend (common/username.ts) e do cadastro (register/page.tsx):
 * minúsculas, sem acento, hífen no lugar de espaço/símbolo, sem hífen nas
 * pontas nem repetido, no máx. 30 chars.
 */
export function slugifyUsername(raw: string): string {
  return (raw || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove marcas de acento decompostas
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

/** Link público canônico (mesma forma usada em settings/page.tsx). */
export function bookingUrl(username: string): string {
  return `https://meusyncro.com.br/book/${username}`;
}

/** Rótulo curto e legível do link, sem o protocolo. */
export function bookingUrlLabel(username: string): string {
  return `meusyncro.com.br/book/${username}`;
}

// --- Máscara BRL -----------------------------------------------------------

/** Centavos -> "R$ 1.234,56". */
export function centsToBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format((cents || 0) / 100);
}

/**
 * Interpreta o que a pessoa digitou como centavos (só os dígitos contam),
 * do jeito de terminal de cartão: "8000" -> 8000 centavos = R$ 80,00.
 */
export function parseBRLInputToCents(input: string): number {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return 0;
  return Math.min(Number(digits), 99_999_999); // teto de R$ 999.999,99
}

// --- Grade de horários padrão -------------------------------------------------

export interface DayRow {
  weekday: number; // 0=Dom ... 6=Sáb
  label: string;
  enabled: boolean;
  start: string;
  end: string;
}

/** Seg–Sex 09:00–18:00, Sáb 09:00–13:00, Dom fechado. */
export function defaultBusinessHours(): DayRow[] {
  const labels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return labels.map((label, weekday) => {
    if (weekday === 0) return { weekday, label, enabled: false, start: "09:00", end: "13:00" };
    if (weekday === 6) return { weekday, label, enabled: true, start: "09:00", end: "13:00" };
    return { weekday, label, enabled: true, start: "09:00", end: "18:00" };
  });
}

export const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export const SERVICE_NAME_SUGGESTIONS = [
  "Corte",
  "Escova",
  "Manicure",
  "Pedicure",
  "Barba",
  "Coloração",
  "Design de sobrancelha",
  "Maquiagem",
];

export const DURATION_OPTIONS = [30, 45, 60, 90];
