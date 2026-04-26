import { expect } from '@playwright/test';

/**
 * ISO calendar YYYY-MM-DD → Apply Leave string (field placeholder yyyy-dd-mm = year–day–month)
 */
function isoToApplyLeaveDate(ymd) {
  const [y, m, d] = ymd.split('-');
  return `${y}-${d}-${m}`;
}

export class LeavePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.leaveMenu = page.locator('.oxd-main-menu-item:has-text("Leave")').first();

    this.applyTab = page.getByRole('link', { name: 'Apply' });
    this.myLeaveTab = page.getByRole('link', { name: 'My Leave' });

    this.leaveOptions = page.locator(
      '.oxd-select-dropdown .oxd-select-option, .oxd-select-dropdown [role=option]',
    );
  }

  /** The Apply Leave <form> (avoids other pages’ selects / fields). */
  applyLeaveForm() {
    return this.page
      .locator('form.oxd-form')
      .filter({ has: this.page.getByText('From Date', { exact: true }) });
  }

  async openApply() {
    await this.leaveMenu.click();
    await this.applyTab.click();
    await this.page.getByRole('heading', { name: 'Apply Leave' }).waitFor({ state: 'visible' });
  }

  /**
   * Leave Type: only one oxd select on this form; options render in a portal.
   * Do not scope by :has(label…) — that wrapper can be absent/empty in the live DOM.
   */
  async _selectApplyLeaveType(form) {
    const selectBox = form.locator('.oxd-select-text').first();
    const display = form.locator('.oxd-select-text-input').first();
    await selectBox.click();

    const panel = this.page
      .locator('.oxd-select-dropdown')
      .filter({ has: this.page.locator('.oxd-select-option, [role=option]') })
      .last();
    await expect(panel).toBeVisible({ timeout: 10_000 });

    const firstReal = panel
      .locator('.oxd-select-option, [role=option]')
      .filter({ hasNotText: /^(\s*--\s*Select\s*--\s*)$/i })
      .first();
    await firstReal.scrollIntoViewIfNeeded();
    await firstReal.click({ force: true });

    if (/\b--\s*Select\s*--/i.test((await display.textContent()) || '')) {
      await selectBox.click();
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
    }

    await expect(display).not.toHaveText(/--\s*Select\s*--/i, { timeout: 10_000 });
    await expect(form.locator('.oxd-input-field-error-message:has-text("Required")')).toHaveCount(0, {
      timeout: 5_000,
    });
  }

  /**
   * @param {string} fromYmd - ISO YYYY-MM-DD
   * @param {string} toYmd
   */
  async applyLeave(fromYmd, toYmd) {
    await this.openApply();

    const form = this.applyLeaveForm();
    const from = isoToApplyLeaveDate(fromYmd);
    const to = isoToApplyLeaveDate(toYmd);

    // Mandatory: Leave Type (shows "Required" + oxd-select-text--error if still "-- Select --")
    await this._selectApplyLeaveType(form);

    // From/To each live in their own .oxd-date-input (fill on raw input merges into one field)
    const dateRow = form
      .locator('.oxd-form-row')
      .filter({ has: this.page.getByText('From Date', { exact: true }) });
    const fromIn = dateRow.locator('.oxd-date-input').nth(0).locator('input.oxd-input');
    const toIn = dateRow.locator('.oxd-date-input').nth(1).locator('input.oxd-input');
    await fromIn.clear();
    await fromIn.fill(from);
    await toIn.clear();
    await toIn.fill(to);

    // Entitlement can lag; a positive balance is required to submit
    const balance = form.locator('.orangehrm-leave-balance-text, .oxd-text.orangehrm-leave-balance-text');
    await expect(balance).not.toHaveText(/^\s*0\.00\s*Day/iu, { timeout: 30_000 });

    await form.getByRole('button', { name: 'Apply' }).click();
  }

  /**
   * Success toast, then a submitted row is visible on My Leave.
   */
  async expectLeaveRequestSubmitted() {
    // Message body (not .oxd-toast-container, which stays in DOM and can be aria-hidden)
    const toastContent = this.page.locator('.oxd-toast-content').first();
    await expect(toastContent).toBeVisible({ timeout: 20_000 });
    await expect(toastContent).toContainText(/[Ss]uccess|Saved|submit|[Aa]ssigned/i, { timeout: 10_000 });

    await this.myLeaveTab.click();
    await this.page.getByRole('heading', { name: 'My Leave' }).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'Search' }).click();
    const rows = this.page.locator(
      'table[role=table] [role=row], .oxd-table-body tr, .oxd-table-body [role=row]',
    );
    await expect(rows.first()).toBeVisible({ timeout: 20_000 });
  }
}
