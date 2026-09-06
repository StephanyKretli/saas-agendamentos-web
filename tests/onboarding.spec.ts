import { test, expect } from "@playwright/test";

/**
 * Um caso só (pedido na task): abandono no passo 2 e retomada preservando o passo 1.
 *
 * Precisa de dev server + banco de verdade (mesma premissa de tests/agenda.spec.ts):
 *   1. suba a API (saas-agendamentos-api) e o front (`npm run dev`)
 *   2. PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test onboarding
 *
 * Cria uma conta nova pela tela de cadastro — conta recém-criada não tem
 * serviço nem horário, então o gate do painel joga direto pra /onboarding.
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test("retomada do onboarding preserva o passo 1 (link) após abandono no passo 2", async ({
  page,
}) => {
  const stamp = Date.now();
  const username = `e2e-onb-${stamp}`;
  const email = `e2e-onb-${stamp}@example.com`;
  const senha = "Teste12345!";

  // --- Cadastro -------------------------------------------------------------
  await page.goto(`${BASE_URL}/register`);
  await page.getByPlaceholder("Nome da Empresa (ex: Studio Beauty)").fill(`E2E Onb ${stamp}`);
  await page.getByPlaceholder("E-mail de acesso").fill(email);
  await page.getByPlaceholder("WhatsApp (ex: 11 99999-9999)").fill("11999999999");
  await page.getByPlaceholder("Seu link (ex: studio-beauty)").fill(username);
  await page.getByPlaceholder("Crie uma senha forte").fill(senha);
  await page.getByPlaceholder("Confirme a sua senha").fill(senha);
  await page.getByRole("button", { name: /começar 14 dias grátis/i }).click();

  // --- Gate manda pra /onboarding, passo 1 -------------------------------------
  await expect(page).toHaveURL(new RegExp(`${BASE_URL}/onboarding`), { timeout: 20000 });
  await expect(page.getByRole("heading", { name: "Seu link de agendamento" })).toBeVisible();
  await expect(page.getByText("Passo 1 de 4")).toBeVisible();

  // O link vem pré-preenchido com o username do cadastro.
  const linkInput = page.locator('input[placeholder="studio-beauty"]');
  await expect(linkInput).toHaveValue(username);

  // --- Conclui o passo 1 e para no passo 2 (abandono) ------------------------
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByRole("heading", { name: "Seu principal serviço" })).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByText("Passo 2 de 4")).toBeVisible();

  // --- Abandona (reload) e retoma -----------------------------------------------
  await page.reload();

  // Retoma no passo 2: o passo 1 já foi salvo e não é pedido de novo.
  await expect(page.getByRole("heading", { name: "Seu principal serviço" })).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByText("Passo 2 de 4")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Seu link de agendamento" })).toHaveCount(0);
});
