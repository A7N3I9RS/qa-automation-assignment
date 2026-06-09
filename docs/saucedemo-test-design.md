# SauceDemo Test Design

SauceDemo coverage is centered on the product purchase flow:

```text
Login -> Products -> Add to cart -> Cart -> Checkout information -> Checkout overview -> Complete order
```

## User Accounts

UI tests use shared account data from [src/saucedemo/data/users.ts](../src/saucedemo/data/users.ts).

| Account set       | Users                                                                                   | Purpose                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Users with access | `standard_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user` | Validate login, cart, checkout and visual behavior across accounts that should enter the app |
| Blocked user      | `locked_out_user`                                                                       | Validate negative authentication behavior                                                    |

`standard_user` is the functional and visual baseline. Other users with access are intentionally included so SauceDemo user-specific defects appear in the report.

## Automated Coverage

| Spec                                                                | Test case group                                                | Accounts          | Main assertions                                                                                  |
| ------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| [authentication.spec.ts](../tests/saucedemo/authentication.spec.ts) | User can log in to the application                             | Users with access | Login succeeds and Products page is displayed                                                    |
| [authentication.spec.ts](../tests/saucedemo/authentication.spec.ts) | Locked-out user cannot log in                                  | `locked_out_user` | Login is blocked with the expected error message                                                 |
| [cart.spec.ts](../tests/saucedemo/cart.spec.ts)                     | User can sort products by price from low to high               | Users with access | Product prices are sorted ascending after selecting `Price (low to high)`                        |
| [cart.spec.ts](../tests/saucedemo/cart.spec.ts)                     | User can add and remove products from the cart                 | Users with access | Cart badge updates from `2` to `1` after removing one product                                    |
| [cart.spec.ts](../tests/saucedemo/cart.spec.ts)                     | Cart shows the correct remaining product after product removal | Users with access | Remaining product is visible and removed product is absent                                       |
| [checkout.spec.ts](../tests/saucedemo/checkout.spec.ts)             | User can continue with valid checkout information              | Users with access | Valid customer data opens the checkout overview page                                             |
| [checkout.spec.ts](../tests/saucedemo/checkout.spec.ts)             | User can complete a purchase successfully                      | Users with access | Order reaches the completion page                                                                |
| [checkout.spec.ts](../tests/saucedemo/checkout.spec.ts)             | Checkout overview matches the baseline screenshot              | Users with access | Each account is compared against the browser-specific `standard_user` checkout overview baseline |

## Visual Baselines

Visual snapshots are browser-specific because the Playwright project name is part of the snapshot path. The update command refreshes only the `STANDARD_USER` baseline:

```bash
npm run test:saucedemo:update-snapshots
```
