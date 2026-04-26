import { expect } from '@playwright/test';

export class PIMPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.pimMenu = page.getByRole('link', { name: 'PIM' });
    this.topbar = page.getByRole('navigation', { name: 'Topbar Menu' });
    this.employeeListLink = this.topbar.getByRole('link', { name: 'Employee List' });
    this.addBtn = page.getByRole('button', { name: 'Add' });

    this.firstName = page.locator('input[name="firstName"]');
    this.lastName = page.locator('input[name="lastName"]');

    this.saveBtn = page.getByRole('button', { name: 'Save' });
  }

  /**
   * PIM module → top bar Employee List. Page title area shows "Employee Information", not a heading "Employee List".
   */
  async goToEmployeeList() {
    await this.pimMenu.click();
    await this.employeeListLink.click();
    await this.page.waitForURL(/pim.*viewEmployeeList|viewEmployeeList/i, { timeout: 20000 });
    await this.page.getByRole('heading', { name: 'Employee Information' }).waitFor({ state: 'visible' });
  }

  /**
   * Add an employee; lands on Personal Details. Returns "FirstName LastName".
   */
  async addEmployee(fname, lname) {
    await this.pimMenu.click();
    await this.addBtn.click();

    await this.firstName.fill(fname);
    await this.lastName.fill(lname);

    await this.saveBtn.click();

    await this.page.getByRole('heading', { name: 'Personal Details' }).waitFor({ state: 'visible' });

    return `${fname} ${lname}`;
  }

  /**
   * Employee List: type a unique `searchHint` (e.g. last name), select autocomplete, Search, assert row.
   */
  async findEmployeeInList(employeeName, searchHint) {
    const hint = this.page.getByRole('textbox', { name: 'Type for hints...' }).first();
    await hint.clear();
    await hint.fill(searchHint);

    const escaped = searchHint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.page
      .locator('.oxd-autocomplete-option')
      .filter({ hasText: new RegExp(escaped, 'i') });
    await expect(option.first()).toBeVisible({ timeout: 20000 });
    await option.first().click();
    await this.page.getByRole('button', { name: 'Search' }).click();

    // Grid is not always `.oxd-table-body tr`; name is split across First / Last cells — use unique last name
    const row = this.page.getByRole('row').filter({ hasText: searchHint });
    await expect(row.first()).toBeVisible({ timeout: 20000 });
  }
}
