import { test } from '../../src/fixtures/pages.js';

test.describe('SauceDemo authentication', () => {
  test('successful login opens the inventory page', async ({ loginPage, inventoryPage }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Login is essential because every shopping flow starts behind the authentication gate.'
    });

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.expectLoaded();
  });

  test('locked-out user receives a clear login error', async ({ loginPage }) => {
    test.info().annotations.push({
      type: 'rationale',
      description: 'Negative authentication coverage is essential because blocked users must not enter the application.'
    });

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expectErrorContains('Sorry, this user has been locked out.');
  });
});
