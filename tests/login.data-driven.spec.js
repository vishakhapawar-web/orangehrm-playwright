import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const loginCases = JSON.parse(readFileSync(join(__dirname, '../test-data/loginData.json'), 'utf-8'));

for (const row of loginCases) {
  test(`data-driven login: ${row.user} / expect ${row.expect}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(row.user, row.pass);

    if (row.expect === 'ok') {
      const dashboard = new DashboardPage(page);
      await dashboard.verifyDashboard();
    } else {
      await expect(login.errorMsg).toBeVisible({ timeout: 15_000 });
    }
  });
}
