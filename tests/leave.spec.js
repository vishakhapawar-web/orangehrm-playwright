import { test } from '@playwright/test';
import { LoginPage, DEFAULT_USER, DEFAULT_PASS } from '../pages/LoginPage.js';
import { TopBarPage } from '../pages/TopBarPage.js';
import { EntitlementPage } from '../pages/EntitlementPage.js';
import { LeavePage } from '../pages/LeavePage.js';

test.describe('Leave', () => {
  test('apply leave and verify request is submitted (toast + My Leave list)', async ({ page }) => {
    const login = new LoginPage(page);
    const topBar = new TopBarPage(page);
    const entitlement = new EntitlementPage(page);
    const leave = new LeavePage(page);

    await login.goto();
    await login.login(DEFAULT_USER, DEFAULT_PASS);

    // Apply Leave uses the **logged-in** user; add balance for that employee.
    const displayName = await topBar.getLoggedInUserDisplayName();
    await entitlement.addEntitlement(displayName);

    // Future dates in the app time zone
    const from = '2026-06-10';
    const to = '2026-06-12';

    await leave.applyLeave(from, to);
    await leave.expectLeaveRequestSubmitted();
  });
});
