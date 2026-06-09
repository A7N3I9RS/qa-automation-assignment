import { expect, type Page } from '@playwright/test';
import { CartPage } from '../pages/cart-page.js';
import { CheckoutPage } from '../pages/checkout-page.js';
import { InventoryPage } from '../pages/inventory-page.js';
import { LoginPage } from '../pages/login-page.js';

type CustomerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const defaultCustomer: CustomerInfo = {
  firstName: 'Alex',
  lastName: 'Tester',
  postalCode: '10001'
};

export async function loginAs(page: Page, username: string) {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(username, 'secret_sauce');
  await inventoryPage.expectLoaded();

  return inventoryPage;
}

export async function expectInventoryLoadsWithin(
  page: Page,
  username: string,
  maxLoginTimeMs: number
) {
  const startedAt = Date.now();
  await loginAs(page, username);
  const loginTimeMs = Date.now() - startedAt;

  expect(loginTimeMs).toBeLessThan(maxLoginTimeMs);
}

export async function expectCheckoutFormPreservesCustomerInfo(page: Page, username: string) {
  const inventoryPage = await loginAs(page, username);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.openCart();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill(defaultCustomer.firstName);
  await page.locator('[data-test="lastName"]').fill(defaultCustomer.lastName);
  await page.locator('[data-test="postalCode"]').fill(defaultCustomer.postalCode);

  await expect(page.locator('[data-test="firstName"]')).toHaveValue(defaultCustomer.firstName);
  await expect(page.locator('[data-test="lastName"]')).toHaveValue(defaultCustomer.lastName);
  await expect(page.locator('[data-test="postalCode"]')).toHaveValue(defaultCustomer.postalCode);
}

export async function expectCheckoutCanBeCompleted(page: Page, username: string) {
  const inventoryPage = await loginAs(page, username);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.openCart();

  await cartPage.expectLoaded();
  await cartPage.expectItemVisible('Sauce Labs Backpack');
  await cartPage.checkout();

  await checkoutPage.fillCustomerInfo(defaultCustomer);
  await checkoutPage.expectOverviewLoaded();
  await checkoutPage.finishOrder();
  await checkoutPage.expectOrderComplete();
}
