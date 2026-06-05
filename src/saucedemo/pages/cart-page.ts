import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectItemVisible(name: string) {
    await expect(this.page.getByText(name, { exact: true })).toBeVisible();
  }

  async expectItemHidden(name: string) {
    await expect(this.page.getByText(name, { exact: true })).toBeHidden();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
