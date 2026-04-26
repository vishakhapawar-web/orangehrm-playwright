export class EntitlementPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.leaveMenu = page.locator('.oxd-main-menu-item:has-text("Leave")').first();
    this.addEntitlementsItem = page.getByRole('menuitem', { name: 'Add Entitlements' });
  }

  /**
   * The add form (not the list filter): title is <p> "Add Leave Entitlement" inside the main card.
   * There is a second form below in oxd-table-filter-area with more "Type for hints" fields.
   */
  get addForm() {
    return this.page
      .locator('.orangehrm-card-container')
      .first()
      .locator('form.oxd-form')
      .first();
  }

  async addEntitlement(employeeName) {
    await this.leaveMenu.click();
    await this.page.getByText('Entitlements', { exact: true }).first().click();
    await this.addEntitlementsItem.click();

    await this.page.waitForURL(/addLeaveEntitlement/);
    await this.page
      .getByText('Add Leave Entitlement', { exact: true })
      .waitFor({ state: 'visible' });

    const addForm = this.addForm;
    const employeeInput = addForm.locator('input[placeholder="Type for hints..."]').first();
    const parts = employeeName.trim().split(/\s+/);
    const firstToken = parts[0] ?? employeeName;
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await employeeInput.fill(firstToken);
    // Dropdown can include employee id: "muser 4957589 56788" while header is "muser 56788"
    const namePattern =
      parts.length >= 2
        ? new RegExp(`${esc(parts[0])}.*${esc(parts[parts.length - 1])}`, 'i')
        : new RegExp(`^\\s*${esc(employeeName)}\\s*$`, 'i');
    const employeeOption = this.page.locator('.oxd-autocomplete-option, [role=option]').filter({ hasText: namePattern });
    await employeeOption.first().waitFor({ state: 'visible' });
    await employeeOption.first().click();

    const leaveTypeDropdown = addForm.locator('.oxd-select-text').first();
    const leaveOptions = this.page.locator(
      '.oxd-select-dropdown .oxd-select-option, .oxd-select-dropdown [role=option]',
    );
    await leaveTypeDropdown.click();
    await leaveOptions.first().click();

    const entitlementInput = addForm
      .locator('label:has-text("Entitlement")')
      .locator('xpath=../../..//input')
      .first();
    await entitlementInput.fill('10');

    await addForm.getByRole('button', { name: 'Save' }).click();
  }
}
