import { expect, test } from '../../src/saucedemo/fixtures/pages.js';
import { usersPassword, usersWithAccess } from '../../src/saucedemo/data/users.js';

test.describe('SauceDemo product sorting', () => {
  test.describe('User can sort products by price from low to high', () => {
    for (const username of usersWithAccess) {
      const accountName = username.toUpperCase();

      test(accountName, async ({ inventoryPage, loginPage }) => {
        test.info().annotations.push({
          type: 'rationale',
          description:
            'Product sorting is essential because it helps users find relevant products faster.'
        });

        await loginPage.goto();
        await loginPage.login(username, usersPassword);
        await inventoryPage.expectLoaded();

        await inventoryPage.sortBy('lohi');
        const pricesAscending = await inventoryPage.getProductPrices();

        expect(pricesAscending).toEqual([...pricesAscending].sort((left, right) => left - right));
      });
    }
  });
});

test.describe('SauceDemo cart management', () => {
  test.describe('User can add and remove products from the cart', () => {
    for (const username of usersWithAccess) {
      const accountName = username.toUpperCase();

      test(accountName, async ({ inventoryPage, loginPage }) => {
        test.info().annotations.push({
          type: 'rationale',
          description:
            'Cart management is essential because selected products represent the user purchase intent.'
        });

        await loginPage.goto();
        await loginPage.login(username, usersPassword);
        await inventoryPage.expectLoaded();

        await inventoryPage.addBackpackToCart();
        await inventoryPage.addBikeLightToCart();
        await inventoryPage.expectCartCount(2);

        await inventoryPage.removeBackpackFromCart();
        await inventoryPage.expectCartCount(1);
      });
    }
  });
});

test.describe('SauceDemo cart review', () => {
  test.describe('Cart shows the correct remaining product after product removal', () => {
    for (const username of usersWithAccess) {
      const accountName = username.toUpperCase();

      test(accountName, async ({
        cartPage,
        inventoryPage,
        loginPage
      }) => {
        test.info().annotations.push({
          type: 'rationale',
          description:
            'Cart review is essential because users need to confirm what they are going to buy before checkout.'
        });

        await loginPage.goto();
        await loginPage.login(username, usersPassword);
        await inventoryPage.expectLoaded();

        await inventoryPage.addBackpackToCart();
        await inventoryPage.addBikeLightToCart();
        await inventoryPage.removeBackpackFromCart();

        await inventoryPage.openCart();
        await cartPage.expectLoaded();
        await cartPage.expectItemVisible('Sauce Labs Bike Light');
        await cartPage.expectItemHidden('Sauce Labs Backpack');
      });
    }
  });
});
