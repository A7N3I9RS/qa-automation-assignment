import { test } from '@playwright/test';
import { InventoryPage } from '../../src/pages/inventory-page.js';
import { LoginPage } from '../../src/pages/login-page.js';

test.describe('SauceDemo authentication', () => {
  test('successful login opens the inventory page', async ({ page }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Login is essential because every shopping flow starts behind the authentication gate.'
    });

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.expectLoaded();
  });

  test('locked-out user receives a clear login error', async ({ page }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Negative authentication coverage is essential because blocked users must not enter the application.'
    });

    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expectErrorContains('Sorry, this user has been locked out.');
  });
});
