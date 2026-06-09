import { test } from '../../src/saucedemo/fixtures/pages.js';
import { lockedOutUser, standardUser, usersPassword } from '../../src/saucedemo/data/users.js';

test.describe('SauceDemo authentication', () => {
  test('STANDARD_USER can log in to the application', async ({ loginPage, inventoryPage }) => {
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Login is essential because every shopping flow starts behind the authentication gate.'
    });

    await loginPage.goto();
    await loginPage.login(standardUser, usersPassword);

    await inventoryPage.expectLoaded();
  });

  test('LOCKED_OUT_USER cannot log in to the application', async ({ loginPage }) => {
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Negative authentication coverage is essential because blocked users must not enter the application.'
    });

    await loginPage.goto();
    await loginPage.login(lockedOutUser, usersPassword);

    await loginPage.expectErrorContains('Sorry, this user has been locked out.');
  });
});
