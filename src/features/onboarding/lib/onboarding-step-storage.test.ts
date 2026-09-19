import { describe, it, expect, beforeEach } from "vitest";
import { saveAccessToken, removeAccessToken } from "@/lib/auth-storage";
import {
  getCurrentUserId,
  readOnboardingStep,
  storeOnboardingStep,
  clearOnboardingStep,
} from "./onboarding-step-storage";

const TOTAL_STEPS = 5;

// JWT de mentira, só pra decodificar o `sub` — a assinatura não importa aqui,
// isso não é validação de sessão (o backend faz isso a cada request).
function fakeToken(sub: string): string {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const payload = btoa(JSON.stringify({ sub, email: "x@x.com" }));
  return `${header}.${payload}.assinatura-fake`;
}

const LEGACY_KEY = "syncro:onboarding:step";

beforeEach(() => {
  localStorage.clear();
  removeAccessToken();
});

describe("getCurrentUserId", () => {
  it("retorna o sub do token salvo", () => {
    saveAccessToken(fakeToken("user-1"));
    expect(getCurrentUserId()).toBe("user-1");
  });

  it("retorna null sem token", () => {
    expect(getCurrentUserId()).toBeNull();
  });

  it("retorna null com token ilegível", () => {
    saveAccessToken("token-quebrado-sem-pontos");
    expect(getCurrentUserId()).toBeNull();
  });
});

describe("readOnboardingStep — o bug original: conta nova herdando passo 5", () => {
  it("chave global antiga (sem id) não influencia nenhuma conta", () => {
    localStorage.setItem(LEGACY_KEY, "5");
    // conta nova, serverFloor = 1 — a leitura é só pela chave por usuário,
    // então o valor da chave antiga nunca é considerado.
    expect(readOnboardingStep("user-2", 1, TOTAL_STEPS)).toBeNull();
  });

  it("conta nova (serverFloor=1) sem nada salvo → null (cai no floor)", () => {
    expect(readOnboardingStep("user-2", 1, TOTAL_STEPS)).toBeNull();
  });

  it("duas contas no mesmo navegador não compartilham ponteiro", () => {
    storeOnboardingStep("user-1", 5);
    expect(readOnboardingStep("user-1", 4, TOTAL_STEPS)).toBe(5);
    expect(readOnboardingStep("user-2", 1, TOTAL_STEPS)).toBeNull();
  });

  it("passo salvo nunca passa de serverFloor + 1, mesmo por engano", () => {
    storeOnboardingStep("user-1", 5);
    // Mesmo que por algum bug essa conta tenha step=5 salvo, se o servidor
    // só sustenta floor=1 (conta nova/sem serviço), o teto é 2.
    expect(readOnboardingStep("user-1", 1, TOTAL_STEPS)).toBe(2);
  });

  it("conta que legitimamente chegou ao passo 5 (serverFloor=4) mantém o passo 5", () => {
    storeOnboardingStep("user-1", 5);
    expect(readOnboardingStep("user-1", 4, TOTAL_STEPS)).toBe(5);
  });

  it("sem nada salvo, serverFloor=4 → null (cai no floor, abre no passo 4)", () => {
    expect(readOnboardingStep("user-1", 4, TOTAL_STEPS)).toBeNull();
  });
});

describe("clearOnboardingStep", () => {
  it("limpa o passo do usuário e a chave legada, sem afetar outras contas", () => {
    storeOnboardingStep("user-1", 5);
    storeOnboardingStep("user-2", 3);
    localStorage.setItem(LEGACY_KEY, "5");

    clearOnboardingStep("user-1");

    expect(readOnboardingStep("user-1", 4, TOTAL_STEPS)).toBeNull();
    expect(readOnboardingStep("user-2", 4, TOTAL_STEPS)).toBe(3);
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });
});
