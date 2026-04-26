import { test, expect } from '@playwright/test';
import { LoginPage, DEFAULT_USER, DEFAULT_PASS } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

test.describe('Login', () => {
  test('valid credentials load Dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.goto();
    await login.login(DEFAULT_USER, DEFAULT_PASS);

    await dashboard.verifyDashboard();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('invalid credentials show an error', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('notARealUser', 'invalidPassword');

    await expect(login.errorMsg).toBeVisible();
    await expect(login.errorMsg).toContainText(/[Ii]nvalid|credentials/);
  });
});
