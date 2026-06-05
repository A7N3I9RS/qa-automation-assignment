import { expect, test } from '../../src/fixtures/pages.js';

test.describe('SauceDemo catalog and cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('user can sort products by price from low to high', async ({ inventoryPage }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Product sorting is essential because it helps users find relevant products faster.'
    });

    await inventoryPage.expectLoaded();

    await inventoryPage.sortBy('lohi');
    const pricesAscending = await inventoryPage.getProductPrices();

    expect(pricesAscending).toEqual([...pricesAscending].sort((left, right) => left - right));
  });

  test('user can add and remove products from the cart', async ({ inventoryPage, cartPage }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Cart management is essential because selected products represent the user purchase intent.'
    });

    await inventoryPage.expectLoaded();

    await inventoryPage.addBackpackToCart();
    await inventoryPage.addBikeLightToCart();
    await inventoryPage.expectCartCount(2);

    await inventoryPage.removeBackpackFromCart();
    await inventoryPage.expectCartCount(1);

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItemVisible('Sauce Labs Bike Light');
    await cartPage.expectItemHidden('Sauce Labs Backpack');
  });
});
