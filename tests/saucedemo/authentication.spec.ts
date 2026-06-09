import { expect, test } from '../../src/saucedemo/fixtures/pages.js';
import { lockedOutUser, usersPassword, usersWithAccess } from '../../src/saucedemo/data/users.js';

const catalogLoadTimeLimitMs = Number(process.env.CATALOG_LOAD_TIME_LIMIT_MS ?? 3000);
const slowMoEnabled = ['1', 'true', 'yes', 'on'].includes(
  process.env.PLAYWRIGHT_SLOW_MO_FLAG?.toLowerCase() ?? ''
);

test.describe('SauceDemo authentication', () => {
  test.describe('User can log in to the application', () => {
    for (const username of usersWithAccess) {
      const accountName = username.toUpperCase();

      test(accountName, async ({ loginPage, inventoryPage }) => {
        test.info().annotations.push({
          type: 'rationale',
          description:
            'Login is essential because every shopping flow starts behind the authentication gate.'
        });

        await loginPage.goto();
        await loginPage.login(username, usersPassword);

        await inventoryPage.expectLoaded();
      });
    }
  });

  test.describe('Catalog opens within accepted time after login', () => {
    for (const username of usersWithAccess) {
      const accountName = username.toUpperCase();

      test(accountName, async ({ loginPage, inventoryPage }) => {
        test.skip(slowMoEnabled, 'Performance smoke checks are not reliable with slow motion.');

        test.info().annotations.push({
          type: 'rationale',
          description:
            'Catalog load timing is a lightweight performance smoke check for accounts with access.'
        });

        await loginPage.goto();
        await loginPage.usernameInput.fill(username);
        await loginPage.passwordInput.fill(usersPassword);

        const startedAt = Date.now();
        await loginPage.loginButton.click();
        await inventoryPage.expectLoaded();
        const catalogLoadTimeMs = Date.now() - startedAt;

        expect(catalogLoadTimeMs).toBeLessThan(catalogLoadTimeLimitMs);
      });
    }
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
