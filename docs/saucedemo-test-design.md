# SauceDemo Test Design

## Application: SauceDemo

SauceDemo is a demo e-commerce application. The main business flow is:

```text
User buys products
```

End-to-end flow:

```text
Login -> Products -> Add to cart -> Cart -> Checkout information -> Checkout overview -> Complete order
```

## Functional Area: Authentication

Authentication controls access to the product purchase flow.

### Test Suite: Login

#### Test Scenario: User logs in to the application

##### Test Case: Valid user can log in to the application

Automated in [tests/saucedemo/authentication.spec.ts](../tests/saucedemo/authentication.spec.ts).

Preconditions:

- User has valid credentials.

Test steps:

1. Open the SauceDemo login page.
2. Enter `standard_user`.
3. Enter the valid shared password.
4. Click the login button.
5. Verify that the Products page is displayed.

Expected result:

- User is logged in successfully.
- Products page is displayed.

Why essential:

- Login is essential because every product purchase flow starts behind the authentication gate.

##### Test Case: Locked-out user cannot log in to the application

Automated in [tests/saucedemo/authentication.spec.ts](../tests/saucedemo/authentication.spec.ts).

Preconditions:

- User account is locked out.

Test steps:

1. Open the SauceDemo login page.
2. Enter `locked_out_user`.
3. Enter the valid shared password.
4. Click the login button.
5. Verify that a login error message is displayed.

Expected result:

- User stays on the login page.
- Error message explains that the user is locked out.

Why essential:

- Negative authentication coverage is essential because blocked users must not access the application.

## Functional Area: Product Catalog

The product catalog lets users discover products and select items for purchase.

### Test Suite: Product Sorting

#### Test Scenario: User sorts products in the catalog

##### Test Case: User can sort products by price from low to high

Automated in [tests/saucedemo/cart.spec.ts](../tests/saucedemo/cart.spec.ts).

Preconditions:

- User is logged in as one of the users with access.
- User is on the Products page.
- Products are visible.

Test steps:

1. Select `Price (low to high)` from the sorting dropdown.
2. Get all displayed product prices.
3. Verify that prices are sorted in ascending order.

Expected result:

- Products are displayed from the cheapest to the most expensive.

Why essential:

- Sorting helps users find relevant products faster and improves product discovery.

### Test Suite: Product Selection

#### Test Scenario: User manages selected products from the catalog

##### Test Case: User can add and remove products from the cart

Automated in [tests/saucedemo/cart.spec.ts](../tests/saucedemo/cart.spec.ts).

Preconditions:

- User is logged in as one of the users with access.
- User is on the Products page.
- Products are visible.
- Cart is empty.

Test steps:

1. Add `Sauce Labs Backpack` to the cart.
2. Add `Sauce Labs Bike Light` to the cart.
3. Verify that the cart badge shows `2`.
4. Remove `Sauce Labs Backpack` from the cart.
5. Verify that the cart badge shows `1`.

Expected result:

- Cart badge shows the correct number of selected products.
- Removed product is no longer counted as selected.

Why essential:

- Product selection is essential because selected products represent the user's purchase intent.

## Functional Area: Cart

The cart lets users review selected products before checkout.

### Test Suite: Cart Review

#### Test Scenario: User reviews cart contents

##### Test Case: Cart shows the correct remaining product after product removal

Automated in [tests/saucedemo/cart.spec.ts](../tests/saucedemo/cart.spec.ts).

Preconditions:

- User is logged in as one of the users with access.
- User added two products to the cart.
- User removed one product before opening the cart.

Test steps:

1. Open the cart.
2. Verify that the remaining product is visible.
3. Verify that the removed product is not visible.

Expected result:

- Cart displays only the product that remains selected.

Why essential:

- Cart review is essential because users need to confirm what they are going to buy before checkout.

## Functional Area: Checkout

Checkout converts selected products into a completed order.

### Test Suite: Checkout Information

#### Test Scenario: User provides checkout information

##### Test Case: User can continue with valid checkout information

Automated in [tests/saucedemo/checkout.spec.ts](../tests/saucedemo/checkout.spec.ts).

Preconditions:

- User is logged in as one of the users with access.
- User has at least one product in the cart.
- User started checkout.

Test steps:

1. Fill in first name.
2. Fill in last name.
3. Fill in postal code.
4. Click the continue button.
5. Verify that the checkout overview page is displayed.

Expected result:

- Checkout information is accepted.
- User is moved to the checkout overview page.

Why essential:

- Checkout information is essential because the order cannot be completed without required customer data.

### Test Suite: Checkout Overview

#### Test Scenario: User confirms the order

##### Test Case: User can complete a purchase successfully

Automated in [tests/saucedemo/checkout.spec.ts](../tests/saucedemo/checkout.spec.ts).

Preconditions:

- User has valid shopping credentials.
- Products are available.
- User has selected a product.
- User has entered valid checkout information.

Test steps:

1. Log in.
2. Verify that the Products page is displayed.
3. Add a product to the cart.
4. Open the cart.
5. Proceed to checkout.
6. Fill in checkout information.
7. Continue to the checkout overview page.
8. Complete the order.

Expected result:

- Order is completed successfully.
- Confirmation message is displayed.

Why essential:

- Checkout completion is the main business result because it validates the full path from product selection to completed order.

## Shopper Coverage

Cart and checkout tests are data-driven across users with access: `standard_user`, `problem_user`, `performance_glitch_user`, `error_user` and `visual_user`. This keeps user-specific defects visible in the functional area where they occur instead of isolating them in a separate special-user suite.
