/**
 * Logged-in user area (OrangeHRM top bar).
 */
export class TopBarPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /** Full name as shown in the header (e.g. for leave entitlement / employee search). */
  async getLoggedInUserDisplayName() {
    const nameLocator = this.page
      .locator('p.oxd-userdropdown-name, .oxd-topbar-header-breadcrumb-area + * p, .oxd-userdropdown p')
      .first();
    await nameLocator.waitFor({ state: 'visible' });
    const t = (await nameLocator.textContent()) ?? '';
    return t.trim();
  }
}
