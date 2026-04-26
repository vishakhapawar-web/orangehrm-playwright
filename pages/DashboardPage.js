export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('h6:has-text("Dashboard")');
  }

  async verifyDashboard() {
    await this.dashboardHeader.waitFor({ state: 'visible' });
  }
}
