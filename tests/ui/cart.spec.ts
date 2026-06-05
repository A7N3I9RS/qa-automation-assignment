import { expect, test } from '@playwright/test';
import { CartPage } from '../../src/pages/cart-page.js';
import { InventoryPage } from '../../src/pages/inventory-page.js';
import { LoginPage } from '../../src/pages/login-page.js';

test.describe('SauceDemo catalog and cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('sorting products and changing cart contents updates the shopping state', async ({ page }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Catalog sorting and cart updates are essential because they drive product discovery and purchase intent.'
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.expectLoaded();

    await inventoryPage.sortBy('za');
    const namesDescending = await inventoryPage.getProductNames();
    expect(namesDescending).toEqual([...namesDescending].sort().reverse());

    await inventoryPage.sortBy('lohi');
    const pricesAscending = await inventoryPage.getProductPrices();
    expect(pricesAscending).toEqual([...pricesAscending].sort((left, right) => left - right));

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
