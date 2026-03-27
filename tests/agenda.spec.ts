import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Fluxo da Agenda', () => {
  
  // Roda automaticamente antes de CADA teste abaixo
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('voce@email.com').fill('admin@saas.com');
    await page.getByPlaceholder('********').fill('123456');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page).toHaveURL(`${BASE_URL}/dashboard`, { timeout: 10000 });
    await page.getByRole('link', { name: 'Agenda', exact: true }).click();
    await expect(page).toHaveURL(`${BASE_URL}/agenda`);
  });

  test('deve carregar a agenda do Admin por padrão e mostrar clientes', async ({ page }) => {
    // 1. O título da página deve estar visível
    await expect(page.locator('h1')).toContainText('A sua Agenda');

    // 2. Como a Stephany já é a profissional padrão agora, 
    // o João Silva DEVE estar logo ali na tela!
    await expect(page.getByText('João Silva').first()).toBeVisible();
    
    // (Opcional) Testar se o Carlos Barbeiro está na equipe
    await page.getByRole('button', { name: 'Stephany (Admin)' }).click();
    await expect(page.getByRole('menuitem', { name: 'Carlos Barbeiro' })).toBeVisible();
  });

  test('deve abrir o modal de novo agendamento', async ({ page }) => {
    // O beforeEach já nos deixou logados e na página /agenda!
    
    // 1. Clica no botão (O Playwright é inteligente, ele vai achar o botão pelo texto)
    await page.click('text=Novo Agendamento');

    // 2. Verifica se o modal apareceu na tela
    const modalTitle = page.locator('h2:has-text("Novo Agendamento")');
    await expect(modalTitle).toBeVisible();
  });
});