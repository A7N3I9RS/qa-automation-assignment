# Test Scenarios and Coverage

## SauceDemo UI

### Authentication

1. Successful login opens the inventory page
   - Automated in [tests/ui/authentication.spec.ts](../tests/ui/authentication.spec.ts)
   - Rationale: every shopping flow starts behind the authentication gate.

2. Locked-out user receives a clear login error
   - Automated in [tests/ui/authentication.spec.ts](../tests/ui/authentication.spec.ts)
   - Rationale: blocked users must not enter the application.

### Catalog and Cart

1. Sorting products and changing cart contents updates the shopping state
   - Automated in [tests/ui/cart.spec.ts](../tests/ui/cart.spec.ts)
   - Rationale: sorting supports product discovery, and cart updates represent purchase intent.

Covered checks:

- Sort products by name descending
- Sort products by price ascending
- Add multiple products to the cart
- Remove one product from the cart
- Validate cart badge count
- Validate expected item remains in cart
- Validate removed item is not displayed in cart

### Checkout

1. Complete checkout flow ends with an order confirmation
   - Automated in [tests/ui/checkout.spec.ts](../tests/ui/checkout.spec.ts)
   - Rationale: checkout validates the main business path from selected product to completed order.

Covered flow:

```text
Login -> Add product -> Open cart -> Checkout -> Fill customer info -> Finish order -> Confirm success
```

### Common Shopper Behavior Matrix

The same role-level scenarios are executed for:

- `standard_user`
- `problem_user`
- `performance_glitch_user`
- `error_user`
- `visual_user`

Automated in [tests/ui/special-users.spec.ts](../tests/ui/special-users.spec.ts).
Reusable flow helpers are implemented in [src/scenarios/saucedemo-user-scenarios.ts](../src/scenarios/saucedemo-user-scenarios.ts).

Covered matrix checks:

- Shopper can open the product catalog within the accepted time
- Shopper sees baseline product prices and images
- Shopper checkout form preserves entered customer data
- Shopper can complete checkout
- Locked-out user remains blocked at login

Failures in this matrix are not hidden as expected failures. They should stay red until the application defects are fixed.

## ReqRes API

### `GET /api/users?per_page=12`

Automated in [tests/api/reqres.spec.ts](../tests/api/reqres.spec.ts).

Covered checks:

- Status code is `200`
- Response content type is JSON
- `total` equals `12`
- `data.length` equals `total`
- First user's `last_name` is `Bluth`
- Second user's `last_name` is `Weaver`
- Pagination metadata uses numeric fields
- User records contain expected field types
- `support.url` and `support.text` are non-empty strings

`per_page=12` is used because the assignment asks to compare the number of users in `data` to `total`; the default paginated response returns only one page while `total` represents the whole collection.

### `POST /api/users`

Automated in [tests/api/reqres.spec.ts](../tests/api/reqres.spec.ts) with external data from [tests/api/data/create-users.json](../tests/api/data/create-users.json).

Covered checks:

- Status code is `201`
- Response content type is JSON
- Request `name` and `job` are echoed in the response
- Generated `id` is present
- `createdAt` is present and parseable as a date
- Response time is below `API_RESPONSE_TIME_LIMIT_MS`

## Current Coverage Summary

| Area | Coverage |
| --- | --- |
| Authentication | Positive login and locked-out user |
| Product catalog | Sorting and baseline product data |
| Cart | Add, remove, count and cart item validation |
| Checkout | Successful order completion and form data preservation |
| Special users | Shared shopper behavior matrix |
| API list users | Status, count, data, schema and metadata |
| API create user | Status, response echo, metadata and response time |
