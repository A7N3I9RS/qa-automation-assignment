import { test } from '@playwright/test';
import { CartPage } from '../../src/pages/cart-page';
import { CheckoutPage } from '../../src/pages/checkout-page';
import { InventoryPage } from '../../src/pages/inventory-page';
import { LoginPage } from '../../src/pages/login-page';

test.describe('SauceDemo checkout', () => {
  test('complete checkout flow ends with an order confirmation', async ({ page }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Checkout is essential because it validates the main business path from selected item to completed order.'
    });

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectLoaded();

    await inventoryPage.addBackpackToCart();
    await inventoryPage.openCart();

    await cartPage.expectLoaded();
    await cartPage.expectItemVisible('Sauce Labs Backpack');
    await cartPage.checkout();

    await checkoutPage.fillCustomerInfo({
      firstName: 'Alex',
      lastName: 'Tester',
      postalCode: '10001'
    });
    await checkoutPage.expectOverviewLoaded();

    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });
});
