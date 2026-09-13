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

// --- Passo 5 (cobrança) — máscaras de digitação ----------------------------

/** Mesma máscara do campo CPF/CNPJ em Configurações (settings/page.tsx). */
export function maskCpfCnpj(raw: string): string {
  let value = (raw || "").replace(/\D/g, "");
  if (value.length <= 11) {
    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    value = value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return value.substring(0, 18);
}

/** "5555 5555 5555 4444" — só pra leitura, o backend recebe só dígitos. */
export function maskCardNumber(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** "01310-100". */
export function maskPostalCode(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * "dd/MM" no fuso America/Sao_Paulo — mesma formatação que o backend usa pro
 * aviso de trial vencendo (whatsapp.service.ts: sendVenceAmanha). Usada pra
 * mostrar a data real da 1ª cobrança no passo 5; nunca calcular hoje+14 aqui,
 * isso é o `trialEndsAt` que o próprio backend manda pro Asaas.
 */
export function formatTrialEndDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
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
