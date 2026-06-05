import { test } from '../../src/fixtures/pages.js';

test.describe('SauceDemo successful product purchase', () => {
  test('user can complete a purchase successfully', async ({
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage
  }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Checkout is essential because it validates the main business path from selected item to completed order.'
    });

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
