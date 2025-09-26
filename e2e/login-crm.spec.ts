import { test, expect } from '@playwright/test';

test.describe('Login → CRM Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Limpar localStorage antes de cada teste
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test('login válido redireciona para /crm', async ({ page }) => {
    console.log('[LOGIN→CRM] Iniciando teste: login válido → /crm');
    
    await page.goto('/login');
    
    // Preencher formulário de login
    await page.fill('input[name="email"]', 'admin@arena.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // Clicar no botão de login
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para /crm
    await page.waitForURL('**/crm', { timeout: 10000 });
    
    // Verificar se está na página CRM
    await expect(page).toHaveURL(/\/crm$/);
    
    // Verificar elementos da página CRM
    await expect(page.locator('h1')).toContainText('CRM Arena Coligados');
    await expect(page.locator('[data-testid="crm-page"]')).toBeVisible();
    
    // Verificar se o usuário está logado
    const userData = await page.evaluate(() => localStorage.getItem('arena_user'));
    expect(userData).toBeTruthy();
    
    console.log('[LOGIN→CRM] ✅ Teste passou: login válido redirecionou para /crm');
  });

  test('login inválido fica em /login', async ({ page }) => {
    console.log('[LOGIN→CRM] Iniciando teste: login inválido → permanece em /login');
    
    await page.goto('/login');
    
    // Preencher com credenciais inválidas
    await page.fill('input[name="email"]', 'invalid@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Clicar no botão de login
    await page.click('button[type="submit"]');
    
    // Aguardar um pouco para o processamento
    await page.waitForTimeout(2000);
    
    // Verificar se permanece na página de login
    await expect(page).toHaveURL(/\/login$/);
    
    // Verificar se há mensagem de erro
    await expect(page.locator('[data-testid="error-message"], .text-red-600, .alert-error')).toBeVisible();
    
    // Verificar se não há usuário no localStorage
    const userData = await page.evaluate(() => localStorage.getItem('arena_user'));
    expect(userData).toBeNull();
    
    console.log('[LOGIN→CRM] ✅ Teste passou: login inválido permaneceu em /login');
  });

  test('acesso direto a /crm sem sessão redireciona para /login', async ({ page }) => {
    console.log('[LOGIN→CRM] Iniciando teste: acesso direto a /crm sem sessão → /login');
    
    // Tentar acessar /crm diretamente
    await page.goto('/crm');
    
    // Aguardar redirecionamento para /login
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Verificar se foi redirecionado para login
    await expect(page).toHaveURL(/\/login$/);
    
    console.log('[LOGIN→CRM] ✅ Teste passou: acesso direto a /crm redirecionou para /login');
  });

  test('acesso /login com sessão redireciona para /crm', async ({ page }) => {
    console.log('[LOGIN→CRM] Iniciando teste: acesso /login com sessão → /crm');
    
    // Simular usuário logado no localStorage
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('arena_user', JSON.stringify({
        id: 'admin-001',
        email: 'admin@arena.com',
        profile: {
          role: 'admin',
          nome: 'Admin Test'
        }
      }));
    });
    
    // Navegar para /login
    await page.goto('/login');
    
    // Aguardar redirecionamento para /crm
    await page.waitForURL('**/crm', { timeout: 10000 });
    
    // Verificar se foi redirecionado para CRM
    await expect(page).toHaveURL(/\/crm$/);
    
    console.log('[LOGIN→CRM] ✅ Teste passou: acesso /login com sessão redirecionou para /crm');
  });

  test('botão entrar funciona corretamente', async ({ page }) => {
    console.log('[LOGIN→CRM] Iniciando teste: botão entrar funciona');
    
    await page.goto('/login');
    
    // Verificar se o botão existe e está habilitado
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    
    // Preencher formulário
    await page.fill('input[name="email"]', 'admin@arena.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // Clicar no botão
    await submitButton.click();
    
    // Verificar redirecionamento
    await page.waitForURL('**/crm', { timeout: 10000 });
    await expect(page).toHaveURL(/\/crm$/);
    
    console.log('[LOGIN→CRM] ✅ Teste passou: botão entrar funcionou corretamente');
  });

  test('formulário valida campos obrigatórios', async ({ page }) => {
    console.log('[LOGIN→CRM] Iniciando teste: validação de campos obrigatórios');
    
    await page.goto('/login');
    
    // Tentar submeter sem preencher campos
    await page.click('button[type="submit"]');
    
    // Verificar se há mensagem de erro
    await expect(page.locator('[data-testid="error-message"], .text-red-600')).toBeVisible();
    
    // Verificar se permanece na página de login
    await expect(page).toHaveURL(/\/login$/);
    
    console.log('[LOGIN→CRM] ✅ Teste passou: validação de campos obrigatórios funcionou');
  });

  test('página CRM carrega corretamente', async ({ page }) => {
    console.log('[LOGIN→CRM] Iniciando teste: página CRM carrega corretamente');
    
    // Fazer login primeiro
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@arena.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/crm');
    
    // Verificar elementos da página CRM
    await expect(page.locator('h1')).toContainText('CRM Arena Coligados');
    await expect(page.locator('text=Total de Clientes')).toBeVisible();
    await expect(page.locator('text=Reservas Hoje')).toBeVisible();
    await expect(page.locator('text=Receita Mensal')).toBeVisible();
    await expect(page.locator('text=Taxa de Conversão')).toBeVisible();
    
    // Verificar ações rápidas
    await expect(page.locator('text=Clientes')).toBeVisible();
    await expect(page.locator('text=Reservas')).toBeVisible();
    await expect(page.locator('text=Quadras')).toBeVisible();
    
    console.log('[LOGIN→CRM] ✅ Teste passou: página CRM carregou corretamente');
  });
});
