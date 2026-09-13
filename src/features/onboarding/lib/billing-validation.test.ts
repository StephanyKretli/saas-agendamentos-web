import { describe, it, expect } from "vitest";
import {
  isValidCpf,
  isValidCnpj,
  isValidCpfCnpj,
  isValidCardNumberLuhn,
  validateBillingForm,
  firstInvalidField,
  normalizeExpiryYear,
  type BillingFormValues,
} from "./billing-validation";

const validValues: BillingFormValues = {
  document: "529.982.247-25",
  cardHolderName: "MARIA DA SILVA",
  cardNumber: "5555 5555 5555 4444",
  cardExpiryMonth: "12",
  cardExpiryYear: "2030",
  cardCcv: "123",
  postalCode: "01310-100",
  addressNumber: "1000",
  phone: "(11) 99999-9999",
};

describe("isValidCpf", () => {
  it("aceita CPF válido, com ou sem máscara", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    expect(isValidCpf("529.982.247-26")).toBe(false);
  });

  it("rejeita sequência repetida", () => {
    expect(isValidCpf("11111111111")).toBe(false);
  });
});

describe("isValidCnpj", () => {
  it("aceita CNPJ válido, com ou sem máscara", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    expect(isValidCnpj("11222333000181")).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    expect(isValidCnpj("11.222.333/0001-82")).toBe(false);
  });
});

describe("isValidCpfCnpj", () => {
  it("roteia por tamanho", () => {
    expect(isValidCpfCnpj("52998224725")).toBe(true);
    expect(isValidCpfCnpj("11222333000181")).toBe(true);
  });

  it("rejeita tamanho que não é nem CPF nem CNPJ", () => {
    expect(isValidCpfCnpj("123")).toBe(false);
  });
});

describe("isValidCardNumberLuhn", () => {
  it("aceita número de cartão que passa no Luhn, com ou sem espaço", () => {
    expect(isValidCardNumberLuhn("5555555555554444")).toBe(true);
    expect(isValidCardNumberLuhn("5555 5555 5555 4444")).toBe(true);
    expect(isValidCardNumberLuhn("4111111111111111")).toBe(true);
  });

  it("rejeita número que falha no dígito verificador", () => {
    expect(isValidCardNumberLuhn("4111111111111112")).toBe(false);
  });

  it("rejeita tamanho fora do intervalo de bandeira nenhuma", () => {
    expect(isValidCardNumberLuhn("123")).toBe(false);
    expect(isValidCardNumberLuhn("")).toBe(false);
  });
});

describe("validateBillingForm", () => {
  it("dados completos e válidos → nenhum erro", () => {
    const errors = validateBillingForm(validValues);
    expect(errors).toEqual({});
  });

  it("CPF com dígito verificador errado → erro só no campo document", () => {
    const errors = validateBillingForm({ ...validValues, document: "529.982.247-26" });
    expect(errors.document).toBeDefined();
    expect(errors.cardNumber).toBeUndefined();
  });

  it("número de cartão inválido → erro no campo cardNumber", () => {
    const errors = validateBillingForm({ ...validValues, cardNumber: "4111111111111112" });
    expect(errors.cardNumber).toBeDefined();
  });

  it("ano de validade com 2 dígitos (jeito que o cartão físico mostra) → ACEITO, sem erro", () => {
    // Inverte o teste anterior: exigir 4 dígitos e só EXPLICAR a exigência
    // era ainda pedir que a pessoa traduza "30" pra "2030" de cabeça. A
    // normalização agora é responsabilidade do software (normalizeExpiryYear),
    // não da validação — aqui só aceita os dois formatos que existem.
    const errors = validateBillingForm({ ...validValues, cardExpiryYear: "30" });
    expect(errors.cardExpiryYear).toBeUndefined();
  });

  it("ano de validade com 4 dígitos continua aceito", () => {
    const errors = validateBillingForm({ ...validValues, cardExpiryYear: "2030" });
    expect(errors.cardExpiryYear).toBeUndefined();
  });

  it("ano de validade com 1 dígito → erro (não é nem formato de cartão nem por extenso)", () => {
    const errors = validateBillingForm({ ...validValues, cardExpiryYear: "3" });
    expect(errors.cardExpiryYear).toBeDefined();
  });

  it("ano de validade com 3 dígitos → erro", () => {
    const errors = validateBillingForm({ ...validValues, cardExpiryYear: "203" });
    expect(errors.cardExpiryYear).toBeDefined();
  });

  it("mês de validade vazio → erro no campo cardExpiryMonth", () => {
    const errors = validateBillingForm({ ...validValues, cardExpiryMonth: "" });
    expect(errors.cardExpiryMonth).toBeDefined();
  });

  it("CVV com 2 dígitos → erro", () => {
    const errors = validateBillingForm({ ...validValues, cardCcv: "12" });
    expect(errors.cardCcv).toBeDefined();
  });

  it("CEP incompleto → erro", () => {
    const errors = validateBillingForm({ ...validValues, postalCode: "01310" });
    expect(errors.postalCode).toBeDefined();
  });

  it("nome do titular vazio (só espaços) → erro", () => {
    const errors = validateBillingForm({ ...validValues, cardHolderName: "   " });
    expect(errors.cardHolderName).toBeDefined();
  });

  it("número do endereço vazio → erro", () => {
    const errors = validateBillingForm({ ...validValues, addressNumber: "" });
    expect(errors.addressNumber).toBeDefined();
  });

  it("telefone com menos de 10 dígitos → erro", () => {
    const errors = validateBillingForm({ ...validValues, phone: "119999" });
    expect(errors.phone).toBeDefined();
  });

  it("todos os campos vazios → erro em todos, nenhum objeto vazio disfarçado de válido", () => {
    const empty: BillingFormValues = {
      document: "",
      cardHolderName: "",
      cardNumber: "",
      cardExpiryMonth: "",
      cardExpiryYear: "",
      cardCcv: "",
      postalCode: "",
      addressNumber: "",
      phone: "",
    };
    const errors = validateBillingForm(empty);
    expect(Object.keys(errors)).toHaveLength(9);
  });
});

describe("normalizeExpiryYear", () => {
  it("2 dígitos → prefixo 20", () => {
    expect(normalizeExpiryYear("30")).toBe("2030");
    expect(normalizeExpiryYear("05")).toBe("2005");
  });

  it("4 dígitos → mantém como está", () => {
    expect(normalizeExpiryYear("2030")).toBe("2030");
  });

  it("aceita valor com máscara/espaço, normaliza pelos dígitos", () => {
    expect(normalizeExpiryYear(" 30 ")).toBe("2030");
  });
});

// Não existe checagem de "cartão vencido" (comparar mês/ano contra a data
// atual) em lugar nenhum do código — nem antes nem depois desta task. Fora
// de escopo criar aqui (ver relatório); por isso não há describe/teste pra
// isso. Se um dia existir, os dois formatos de ano (2 e 4 dígitos) precisam
// ser normalizados ANTES da comparação de data.

describe("firstInvalidField", () => {
  it("nenhum erro → null", () => {
    expect(firstInvalidField({})).toBeNull();
  });

  it("erro em campo do meio da tela → devolve esse campo", () => {
    expect(firstInvalidField({ cardCcv: "CVV inválido." })).toBe("cardCcv");
  });

  it("erro em vários campos → devolve o primeiro na ORDEM VISUAL da tela, não a ordem de inserção do objeto", () => {
    // cardCcv aparece DEPOIS de document na tela — mesmo inserido primeiro
    // no objeto de erros, quem deve ganhar o foco é document.
    const errors = { cardCcv: "CVV inválido.", document: "CPF ou CNPJ inválido." };
    expect(firstInvalidField(errors)).toBe("document");
  });
});
