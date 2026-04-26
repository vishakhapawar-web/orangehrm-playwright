const DEFAULT_USER = process.env.ORANGEHRM_USER ?? 'Admin';
const DEFAULT_PASS = process.env.ORANGEHRM_PASSWORD ?? 'admin123';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.loginBtn = page.getByRole('button', { name: 'Login' });

    this.errorMsg = page.locator('.oxd-alert .oxd-alert-content-text, .oxd-alert-content-text');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'load' });
  }

  /**
   * @param {string} [username=DEFAULT_USER]
   * @param {string} [password=DEFAULT_PASS]
   */
  async login(username = DEFAULT_USER, password = DEFAULT_PASS) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
  }
}

export { DEFAULT_USER, DEFAULT_PASS };
