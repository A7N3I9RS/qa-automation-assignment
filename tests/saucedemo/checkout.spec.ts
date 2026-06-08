import { expect, test } from '../../src/saucedemo/fixtures/pages.js';

test.describe('SauceDemo checkout information', () => {
  test('user can continue with valid checkout information', async ({
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage
  }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Checkout information is essential because orders require customer data before confirmation.'
    });

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectLoaded();

    await inventoryPage.addBackpackToCart();
    await inventoryPage.openCart();

    await cartPage.expectLoaded();
    await cartPage.checkout();

    await checkoutPage.fillCustomerInfo({
      firstName: 'Alex',
      lastName: 'Tester',
      postalCode: '10001'
    });
    await checkoutPage.expectOverviewLoaded();
  });
});

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

test.describe('SauceDemo checkout visual regression', () => {
  test('checkout overview matches the baseline screenshot', async ({
    browserName,
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage,
    page
  }) => {
    test.skip(browserName !== 'chromium', 'Visual baseline is captured only for Chromium.');

    test.info().annotations.push({
      type: 'rationale',
      description: 'The checkout overview is a stable summary page and a useful target for a visual smoke check.'
    });

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectLoaded();

    await inventoryPage.addBackpackToCart();
    await inventoryPage.openCart();

    await cartPage.expectLoaded();
    await cartPage.checkout();

    await checkoutPage.fillCustomerInfo({
      firstName: 'Alex',
      lastName: 'Tester',
      postalCode: '10001'
    });
    await checkoutPage.expectOverviewLoaded();

    await expect(page).toHaveScreenshot('checkout-overview.png', {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.02
    });
  });
});
