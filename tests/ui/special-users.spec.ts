import { expect, test, type Page } from '@playwright/test';
import { InventoryPage } from '../../src/pages/inventory-page';
import { LoginPage } from '../../src/pages/login-page';

const expectedProductPrices = [
  '$29.99',
  '$9.99',
  '$15.99',
  '$49.99',
  '$7.99',
  '$15.99'
];

async function loginAs(page: Page, username: string) {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(username, 'secret_sauce');
  await inventoryPage.expectLoaded();

  return inventoryPage;
}

test.describe('SauceDemo special user behavior', () => {
  test('performance_glitch_user should load inventory within an acceptable login time', async ({ page }) => {
    test.fail(true, 'Known defect: performance_glitch_user intentionally delays the inventory page.');
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Login performance is essential because slow authentication blocks every downstream shopping workflow.'
    });

    const startedAt = Date.now();
    await loginAs(page, 'performance_glitch_user');
    const loginTimeMs = Date.now() - startedAt;

    expect(loginTimeMs).toBeLessThan(3000);
  });

  test('problem_user should display valid unique product images', async ({ page }) => {
    test.fail(true, 'Known defect: problem_user displays the same broken product image for all items.');
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Product images are essential because users rely on them to identify items before adding them to the cart.'
    });

    await loginAs(page, 'problem_user');

    const imageSources = await page.locator('.inventory_item_img img').evaluateAll((images) =>
      images.map((image) => image.getAttribute('src') ?? '')
    );

    expect(new Set(imageSources).size).toBe(imageSources.length);
    expect(imageSources.every((src) => !src.includes('sl-404'))).toBe(true);
  });

  test('problem_user should preserve checkout form fields and continue to overview', async ({ page }) => {
    test.fail(true, 'Known defect: problem_user writes the last name into first name and leaves last name empty.');
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Checkout form reliability is essential because corrupted customer data can block or invalidate an order.'
    });

    const inventoryPage = await loginAs(page, 'problem_user');

    await inventoryPage.addBackpackToCart();
    await inventoryPage.openCart();
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('10001');

    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Alex');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Tester');

    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  });

  test('error_user should preserve checkout form fields before continuing', async ({ page }) => {
    test.fail(true, 'Known defect: error_user does not retain the last name value in checkout.');
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Checkout form validation is essential because silently dropped values create unreliable customer data.'
    });

    const inventoryPage = await loginAs(page, 'error_user');

    await inventoryPage.addBackpackToCart();
    await inventoryPage.openCart();
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('10001');

    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Alex');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Tester');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('10001');
  });

  test('visual_user should display baseline product prices and product images', async ({ page }) => {
    test.fail(true, 'Known defect: visual_user shows incorrect prices and a broken backpack image.');
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Visual correctness is essential because wrong prices or broken images directly mislead shoppers.'
    });

    const inventoryPage = await loginAs(page, 'visual_user');

    await expect(inventoryPage.productPrices).toHaveText(expectedProductPrices);

    const backpackImageSource = await page
      .locator('.inventory_item')
      .filter({ hasText: 'Sauce Labs Backpack' })
      .locator('img')
      .getAttribute('src');

    expect(backpackImageSource).not.toContain('sl-404');
  });
});
