import { expect, test } from '@playwright/test';
import {
  expectCheckoutCanBeCompleted,
  expectCheckoutFormPreservesCustomerInfo,
  expectInventoryLoadsWithin
} from '../../src/saucedemo/scenarios/saucedemo-user-scenarios.js';

const shoppingUsers = [
  'standard_user',
  'problem_user',
  'performance_glitch_user',
  'error_user',
  'visual_user'
];

const slowMoEnabled = ['1', 'true', 'yes', 'on'].includes(
  process.env.PLAYWRIGHT_SLOW_MO_FLAG?.toLowerCase() ?? ''
);

test.describe('SauceDemo common user behavior matrix', () => {
  for (const username of shoppingUsers) {
    test(`${username} should load inventory within the accepted login time`, async ({ page }) => {
      test.skip(slowMoEnabled, 'Login timing checks are not reliable with Playwright slow motion.');

      test.info().annotations.push({
        type: 'rationale',
        description:
          'Users with the same shopper role should be able to reach the catalog without user-specific delays.'
      });

      await expectInventoryLoadsWithin(page, username, 3000);
    });
  }

  for (const username of shoppingUsers) {
    test(`${username} should preserve checkout form data`, async ({ page }) => {
      test.info().annotations.push({
        type: 'rationale',
        description:
          'Users with the same shopper role should be able to enter customer data without fields being corrupted or dropped.'
      });

      await expectCheckoutFormPreservesCustomerInfo(page, username);
    });
  }

  for (const username of shoppingUsers) {
    test(`${username} should complete checkout with the same shopper role behavior`, async ({
      page
    }) => {
      test.info().annotations.push({
        type: 'rationale',
        description:
          'Users with the same shopper role should be able to complete the main purchase flow consistently.'
      });

      await expectCheckoutCanBeCompleted(page, username);
    });
  }

  test('locked_out_user should remain blocked at login', async ({ page }) => {
    test.info().annotations.push({
      type: 'rationale',
      description:
        'A locked user is the only accepted user in this dataset that should not share normal shopper access.'
    });

    await page.goto('/');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Sorry, this user has been locked out.'
    );
  });
});
