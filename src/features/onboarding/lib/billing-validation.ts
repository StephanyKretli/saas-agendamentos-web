// Validação do passo 5 (cobrança) — pura, sem dependência de React, testável
// isoladamente. CPF/CNPJ replica o mesmo algoritmo de dígito verificador do
// backend (saas-agendamentos-api/src/common/document/document.ts) — repos
// separados, sem pacote compartilhado, mesma regra por duplicação deliberada
// (já é o padrão deste arquivo com slugifyUsername).

export function onlyDigits(raw: string): string {
  return (raw || "").replace(/\D/g, "");
}

function calcCpfCheckDigit(base: string, factorStart: number): number {
  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    sum += Number(base[i]) * (factorStart - i);
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCpf(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const d1 = calcCpfCheckDigit(cpf.slice(0, 9), 10);
  const d2 = calcCpfCheckDigit(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

function calcCnpjCheckDigit(base: string): number {
  const weights =
    base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    sum += Number(base[i]) * weights[i];
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCnpj(raw: string): boolean {
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const d1 = calcCnpjCheckDigit(cnpj.slice(0, 12));
  const d2 = calcCnpjCheckDigit(cnpj.slice(0, 12) + d1);
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]);
}

/** CPF (11 dígitos) ou CNPJ (14 dígitos) válidos — qualquer outro tamanho é rejeitado. */
export function isValidCpfCnpj(raw: string): boolean {
  const digits = onlyDigits(raw);
  if (digits.length === 11) return isValidCpf(digits);
  if (digits.length === 14) return isValidCnpj(digits);
  return false;
}

/** Algoritmo de Luhn — mesmo cálculo que qualquer bandeira usa pro dígito verificador. */
export function isValidCardNumberLuhn(raw: string): boolean {
  const digits = onlyDigits(raw);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export interface BillingFormValues {
  document: string;
  cardHolderName: string;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCcv: string;
  postalCode: string;
  addressNumber: string;
  phone: string;
}

export type BillingFormErrors = Partial<Record<keyof BillingFormValues, string>>;

/**
 * Ordem visual dos campos na tela — usada pra decidir qual campo recebe foco
 * quando o clique em "Confirmar" encontra mais de um erro.
 */
export const BILLING_FIELD_ORDER: (keyof BillingFormValues)[] = [
  "document",
  "cardHolderName",
  "cardNumber",
  "cardExpiryMonth",
  "cardExpiryYear",
  "cardCcv",
  "postalCode",
  "addressNumber",
  "phone",
];

/**
 * Valida todos os campos do passo 5 e devolve um mapa campo -> mensagem.
 * Nunca lança — o chamador decide o que fazer com o resultado (mostrar erro,
 * focar o primeiro campo problemático). Mensagens dizem o que corrigir, não
 * só "campo inválido": é a causa raiz do botão que nunca habilitava — regra
 * escrita mas não visível (ex.: ano de validade precisa de 4 dígitos e o
 * campo não dizia isso em lugar nenhum).
 */
export function validateBillingForm(values: BillingFormValues): BillingFormErrors {
  const errors: BillingFormErrors = {};

  if (!isValidCpfCnpj(values.document)) {
    errors.document = "CPF ou CNPJ inválido. Confira os números.";
  }
  if (!values.cardHolderName.trim()) {
    errors.cardHolderName = "Digite o nome impresso no cartão.";
  }
  if (!isValidCardNumberLuhn(values.cardNumber)) {
    errors.cardNumber = "Número do cartão inválido.";
  }
  if (!/^(0[1-9]|1[0-2])$/.test(values.cardExpiryMonth)) {
    errors.cardExpiryMonth = "Selecione o mês de validade.";
  }
  // Aceita como o cartão físico mostra (2 dígitos, ex.: "30") ou por extenso
  // (4 dígitos, ex.: "2030") — normalização pra 4 dígitos acontece só na
  // hora de montar o payload (normalizeExpiryYear), nunca aqui. 1 ou 3
  // dígitos não é nem um formato nem o outro.
  const yearDigitCount = onlyDigits(values.cardExpiryYear).length;
  if (yearDigitCount !== 2 && yearDigitCount !== 4) {
    errors.cardExpiryYear = "Ano de validade inválido. Digite como está no cartão (ex: 30 ou 2030).";
  }
  if (!/^\d{3,4}$/.test(onlyDigits(values.cardCcv))) {
    errors.cardCcv = "CVV inválido.";
  }
  if (onlyDigits(values.postalCode).length !== 8) {
    errors.postalCode = "CEP inválido.";
  }
  if (!values.addressNumber.trim()) {
    errors.addressNumber = "Informe o número do endereço.";
  }
  if (onlyDigits(values.phone).length < 10) {
    errors.phone = "WhatsApp inválido.";
  }

  return errors;
}

/**
 * Normaliza o ano de validade pro formato de 4 dígitos que o Asaas exige.
 * Roda só na hora de montar o payload (dentro do handleSubmit), nunca no
 * onChange — reescrever o que a pessoa digitou enquanto ela ainda está
 * digitando é o tipo de campo que briga com quem está preenchendo.
 *
 * 2 dígitos → prefixo "20" (30 → 2030; não existe cartão com validade em
 * 2100, então o prefixo nunca é ambíguo). 4 dígitos → mantém como está.
 * Assume que o valor já passou por validateBillingForm (2 ou 4 dígitos) —
 * chamar com 1 ou 3 dígitos devolve o valor sem normalizar.
 */
export function normalizeExpiryYear(raw: string): string {
  const digits = onlyDigits(raw);
  return digits.length === 2 ? `20${digits}` : digits;
}

/** Primeiro campo com erro, na ordem em que aparece na tela — ou null se não há erro. */
export function firstInvalidField(errors: BillingFormErrors): keyof BillingFormValues | null {
  return BILLING_FIELD_ORDER.find((field) => errors[field] !== undefined) ?? null;
}
