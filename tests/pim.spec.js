import { test, expect } from '@playwright/test';
import { LoginPage, DEFAULT_USER, DEFAULT_PASS } from '../pages/LoginPage.js';
import { PIMPage } from '../pages/PIMPage.js';

test.describe('PIM', () => {
  test('add employee then employee appears in Employee List', async ({ page }) => {
    const login = new LoginPage(page);
    const pim = new PIMPage(page);

    const fname = 'John';
    const lname = `Doe${Date.now()}`;

    await login.goto();
    await login.login(DEFAULT_USER, DEFAULT_PASS);

    const fullName = await pim.addEmployee(fname, lname);
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

    await pim.goToEmployeeList();
    await pim.findEmployeeInList(fullName, lname);
  });
});
