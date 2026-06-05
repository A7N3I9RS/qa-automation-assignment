import { expect, test } from '../../src/fixtures/pages.js';

test.describe('SauceDemo product sorting', () => {
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
});

test.describe('SauceDemo cart management', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('user can add and remove products from the cart', async ({ inventoryPage }) => {
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
  });
});

test.describe('SauceDemo cart review', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('cart shows the correct remaining product after product removal', async ({ inventoryPage, cartPage }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Cart review is essential because users need to confirm what they are going to buy before checkout.'
    });

    await inventoryPage.expectLoaded();

    await inventoryPage.addBackpackToCart();
    await inventoryPage.addBikeLightToCart();
    await inventoryPage.removeBackpackFromCart();

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItemVisible('Sauce Labs Bike Light');
    await cartPage.expectItemHidden('Sauce Labs Backpack');
  });
});
