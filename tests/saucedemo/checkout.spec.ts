import { expect, test } from '../../src/saucedemo/fixtures/pages.js';
import {
  defaultCustomer,
  usersWithAccess,
  usersPassword
} from '../../src/saucedemo/data/users.js';

test.describe('SauceDemo checkout information', () => {
  for (const username of usersWithAccess) {
    test.describe(`Account: ${username}`, () => {
      test('user can continue with valid checkout information', async ({
        cartPage,
        checkoutPage,
        inventoryPage,
        loginPage
      }) => {
        test.info().annotations.push({
          type: 'rationale',
          description:
            'Checkout information is essential because orders require customer data before confirmation.'
        });

        await loginPage.goto();
        await loginPage.login(username, usersPassword);
        await inventoryPage.expectLoaded();

        await inventoryPage.addBackpackToCart();
        await inventoryPage.openCart();

        await cartPage.expectLoaded();
        await cartPage.checkout();

        await checkoutPage.fillCustomerInfo(defaultCustomer);
        await checkoutPage.expectOverviewLoaded();
      });
    });
  }
});

test.describe('SauceDemo successful product purchase', () => {
  for (const username of usersWithAccess) {
    test.describe(`Account: ${username}`, () => {
      test('user can complete a purchase successfully', async ({
        cartPage,
        checkoutPage,
        inventoryPage,
        loginPage
      }) => {
        test.info().annotations.push({
          type: 'rationale',
          description:
            'Checkout is essential because it validates the main business path from selected item to completed order.'
        });

        await loginPage.goto();
        await loginPage.login(username, usersPassword);
        await inventoryPage.expectLoaded();

        await inventoryPage.addBackpackToCart();
        await inventoryPage.openCart();

        await cartPage.expectLoaded();
        await cartPage.expectItemVisible('Sauce Labs Backpack');
        await cartPage.checkout();

        await checkoutPage.fillCustomerInfo(defaultCustomer);
        await checkoutPage.expectOverviewLoaded();

        await checkoutPage.finishOrder();
        await checkoutPage.expectOrderComplete();
      });
    });
  }
});

test.describe('SauceDemo checkout visual regression', () => {
  for (const username of usersWithAccess) {
    test.describe(`Account: ${username}`, () => {
      test(`${username} checkout overview matches the standard_user baseline screenshot`, async ({
        cartPage,
        checkoutPage,
        inventoryPage,
        loginPage,
        page
      }) => {
        test.info().annotations.push({
          type: 'rationale',
          description:
            'The checkout overview is a stable summary page and a useful target for visual comparison across user accounts.'
        });

        await loginPage.goto();
        await loginPage.login(username, usersPassword);
        await inventoryPage.expectLoaded();

        await inventoryPage.addBackpackToCart();
        await inventoryPage.openCart();

        await cartPage.expectLoaded();
        await cartPage.checkout();

        await checkoutPage.fillCustomerInfo(defaultCustomer);
        await checkoutPage.expectOverviewLoaded();

        await expect(page).toHaveScreenshot('checkout-overview.png', {
          animations: 'disabled',
          fullPage: true,
          maxDiffPixelRatio: 0.02
        });
      });
    });
  }
});
