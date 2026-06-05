# Test Scenarios and Test Cases

This document separates high-level test scenarios from concrete test cases.

- Test scenario: what area or behavior should be tested.
- Test case: how exactly the behavior is checked, including steps and expected result.
- Automated test: Playwright implementation of the test case.

## SauceDemo UI

The main business scenario for SauceDemo is a successful product purchase flow:

```text
Login -> Products -> Add to cart -> Cart -> Checkout information -> Overview -> Complete order
```

### Test Scenario: Authentication

#### Test Case: User can log in with valid credentials

Automated in [tests/ui/authentication.spec.ts](../tests/ui/authentication.spec.ts).

Preconditions:

- User has valid credentials.

Steps:

1. Open the SauceDemo login page.
2. Enter a valid username.
3. Enter a valid password.
4. Click the login button.
5. Verify that the Products page is displayed.

Expected result:

- User is logged in successfully.
- Products page is displayed.

Why essential:

- Login is essential because every shopping flow starts behind the authentication gate.

#### Test Case: Locked-out user cannot log in

Automated in [tests/ui/authentication.spec.ts](../tests/ui/authentication.spec.ts).

Preconditions:

- User account is locked out.

Steps:

1. Open the SauceDemo login page.
2. Enter `locked_out_user`.
3. Enter the valid shared password.
4. Click the login button.
5. Verify that an error message is displayed.

Expected result:

- User stays on the login page.
- Error message explains that the user is locked out.

Why essential:

- Negative authentication coverage is essential because blocked users must not access the application.

### Test Scenario: Product Sorting

#### Test Case: User can sort products by price from low to high

Automated in [tests/ui/cart.spec.ts](../tests/ui/cart.spec.ts).

Preconditions:

- User is logged in.
- User is on the Products page.
- Products are visible.

Steps:

1. Select `Price (low to high)` from the sorting dropdown.
2. Get all displayed product prices.
3. Verify that prices are sorted in ascending order.

Expected result:

- Products are displayed from the cheapest to the most expensive.

Why essential:

- Sorting helps users find relevant products faster and improves product discovery.

### Test Scenario: Cart Management

#### Test Case: User can add and remove products from the cart

Automated in [tests/ui/cart.spec.ts](../tests/ui/cart.spec.ts).

Preconditions:

- User is logged in.
- User is on the Products page.
- Products are visible.

Steps:

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

- Cart management is essential because selected products represent the user's purchase intent.

### Test Scenario: Successful Product Purchase

#### Test Case: User can complete a purchase successfully

Automated in [tests/ui/checkout.spec.ts](../tests/ui/checkout.spec.ts).

Preconditions:

- User has valid credentials.
- Products are available.

Steps:

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

- Checkout is the main business flow because it validates the path from product selection to completed order.

### Test Scenario: Common Shopper Behavior Matrix

#### Test Case: Users with the same shopper role should receive the same core behavior

Automated in [tests/ui/special-users.spec.ts](../tests/ui/special-users.spec.ts).
Reusable flow helpers are implemented in [src/scenarios/saucedemo-user-scenarios.ts](../src/scenarios/saucedemo-user-scenarios.ts).

Preconditions:

- SauceDemo special users are available.
- Shared shopper users use the same password.

Steps:

1. Run the same core shopper checks for `standard_user`, `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user`.
2. Verify that each shopper can open the product catalog within the accepted time.
3. Verify that each shopper sees baseline product prices and images.
4. Verify that checkout form data is preserved.
5. Verify that checkout can be completed.

Expected result:

- `standard_user` demonstrates the expected baseline behavior.
- Any user-specific defects are visible as failed tests.

Why essential:

- SauceDemo intentionally exposes defects through special users, so this matrix makes regressions and known defects visible in the report.

## ReqRes API

### Test Scenario: List Users API

#### Test Case: API returns expected users, counts and data types

Automated in [tests/api/reqres.spec.ts](../tests/api/reqres.spec.ts).

Preconditions:

- `REQRES_API_KEY` is configured.

Steps:

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

### Test Scenario: Create User API

#### Test Case: API creates users from external test data

Automated in [tests/api/reqres.spec.ts](../tests/api/reqres.spec.ts) with external data from [tests/api/data/create-users.json](../tests/api/data/create-users.json).

Preconditions:

- `REQRES_API_KEY` is configured.
- Create-user test data is available.

Steps:

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
