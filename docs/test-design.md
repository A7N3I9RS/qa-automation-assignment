# Test Design

This document describes the test design from business flow down to concrete automated test steps.

The project uses a black-box testing approach: tests validate application behavior through the public UI and API without relying on internal implementation details or source code access. The focus is on functionality from the end-user and API consumer perspective.

```text
Application
  -> Business Flow
    -> Functional Area
      -> Test Suite
        -> Test Scenario
          -> Test Case
            -> Test Steps
```

Only implemented automated test cases are listed here. Additional negative cases can be added later as the suite grows.

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

Automated in [tests/ui/authentication.spec.ts](../tests/ui/authentication.spec.ts).

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

Automated in [tests/ui/authentication.spec.ts](../tests/ui/authentication.spec.ts).

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

Automated in [tests/ui/cart.spec.ts](../tests/ui/cart.spec.ts).

Preconditions:

- User is logged in.
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

Automated in [tests/ui/cart.spec.ts](../tests/ui/cart.spec.ts).

Preconditions:

- User is logged in.
- User is on the Products page.
- Products are visible.
- Cart is empty.

Test steps:

1. Add `Sauce Labs Backpack` to the cart.
2. Add `Sauce Labs Bike Light` to the cart.
3. Verify that the cart badge shows `2`.
4. Remove `Sauce Labs Backpack` from the cart.
5. Verify that the cart badge shows `1`.
6. Open the cart.
7. Verify that `Sauce Labs Bike Light` is visible.
8. Verify that `Sauce Labs Backpack` is not visible.

Expected result:

- Cart badge shows the correct number of selected products.
- Cart contains only the product that was not removed.

Why essential:

- Product selection is essential because selected products represent the user's purchase intent.

## Functional Area: Cart

The cart lets users review selected products before checkout.

### Test Suite: Cart Review

#### Test Scenario: User reviews cart contents

##### Test Case: Cart shows the correct remaining product after product removal

Automated as part of [tests/ui/cart.spec.ts](../tests/ui/cart.spec.ts).

Preconditions:

- User is logged in.
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

Automated as part of [tests/ui/checkout.spec.ts](../tests/ui/checkout.spec.ts).

Preconditions:

- User is logged in.
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

Automated in [tests/ui/checkout.spec.ts](../tests/ui/checkout.spec.ts).

Preconditions:

- User has valid credentials.
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

## Functional Area: Shared Shopper Behavior

SauceDemo includes special users that expose different application defects.

### Test Suite: Shopper Behavior Matrix

#### Test Scenario: Users with the same shopper role receive the same core behavior

##### Test Case: Common shopper behavior is consistent across special users

Automated in [tests/ui/special-users.spec.ts](../tests/ui/special-users.spec.ts).
Reusable flow helpers are implemented in [src/scenarios/saucedemo-user-scenarios.ts](../src/scenarios/saucedemo-user-scenarios.ts).

Preconditions:

- SauceDemo special users are available.
- Shared shopper users use the same password.

Test steps:

1. Run the same core shopper checks for `standard_user`, `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user`.
2. Verify that each shopper can open the product catalog within the accepted time.
3. Verify that each shopper sees baseline product prices and images.
4. Verify that checkout form data is preserved.
5. Verify that checkout can be completed.

Expected result:

- `standard_user` demonstrates the expected baseline behavior.
- User-specific defects are visible as failed tests.

Why essential:

- The matrix is essential because it makes known defects and behavioral differences visible in the report.

## Application: ReqRes

ReqRes is a public REST API used for the API automation part of the assignment.

## Functional Area: Users API

### Test Suite: List Users

#### Test Scenario: Client retrieves users

##### Test Case: API returns expected users, counts and data types

Automated in [tests/api/reqres.spec.ts](../tests/api/reqres.spec.ts).

Preconditions:

- `REQRES_API_KEY` is configured.

Test steps:

1. Send `GET /api/users?per_page=12`.
2. Verify status code.
3. Verify response content type.
4. Verify total user count and returned data count.
5. Verify known user last names.
6. Verify pagination metadata and user field types.

Expected result:

- API returns `200`.
- Response contains expected users, counts and data structure.

Why essential:

- Listing users is essential because consumers need stable pagination metadata and predictable user records.

### Test Suite: Create User

#### Test Scenario: Client creates users

##### Test Case: API creates users from external test data

Automated in [tests/api/reqres.spec.ts](../tests/api/reqres.spec.ts) with external data from [tests/api/data/create-users.json](../tests/api/data/create-users.json).

Preconditions:

- `REQRES_API_KEY` is configured.
- Create-user test data is available.

Test steps:

1. Read user payload from external test data.
2. Send `POST /api/users`.
3. Verify status code.
4. Verify response content type.
5. Verify that request fields are echoed in the response.
6. Verify that generated `id` and `createdAt` are present.
7. Verify that `createdAt` is parseable as a date.
8. Verify response time.

Expected result:

- API returns `201`.
- Response contains created-user metadata and echoes the submitted data.

Why essential:

- Create-user coverage is essential because POST flows must validate request construction, response metadata and response performance.
