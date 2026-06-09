# Test Plan

## Objective

Validate the main user-facing behavior for:

- SauceDemo frontend shopping flow
- ReqRes Users API list and create-user behavior

The suite is black-box automation: it tests public UI/API behavior, not application internals.

## Scope

In scope:

- SauceDemo login, locked-out login and catalog load performance smoke behavior
- SauceDemo catalog sorting, cart updates and cart review
- SauceDemo checkout information, purchase completion and checkout visual comparison
- SauceDemo user-specific behavior across users with access
- ReqRes `GET /api/users` and `POST /api/users`
- API response status, JSON content type, Zod schema validation, selected data assertions and create-user response-time check

Out of scope:

- SauceDemo or ReqRes source-code testing
- Payment processing, load testing, accessibility audit and mobile-specific coverage
- Broad visual regression beyond the checkout overview target
- Formal OpenAPI contract testing

## Approach

- Use `standard_user` as the functional and visual baseline.
- Run login, cart, checkout and checkout visual checks across users with access: `standard_user`, `problem_user`, `performance_glitch_user`, `error_user` and `visual_user`.
- Keep SauceDemo user-specific defects visible as test failures instead of masking them as expected failures.
- Keep `locked_out_user` as a separate negative authentication check.
- Use Playwright API testing for ReqRes with Zod schemas and external create-user data.

## Environment and Data

- Test runner: Playwright Test with TypeScript
- UI browsers: Desktop Chrome, Firefox and WebKit projects
- UI base URL: `https://www.saucedemo.com`
- API base URL: `https://reqres.in`
- Required local/CI env vars: `USERS_PASSWORD`, `REQRES_API_KEY`
- Optional env vars: `API_RESPONSE_TIME_LIMIT_MS`, `CATALOG_LOAD_TIME_LIMIT_MS`, `PLAYWRIGHT_SLOW_MO_FLAG`, `PLAYWRIGHT_SLOW_MO_MS_TIME`
- ReqRes create-user data: [tests/reqres/data/create-users.json](../tests/reqres/data/create-users.json)

## Risks

- SauceDemo and ReqRes are external systems and can change without notice.
- SauceDemo intentionally contains user-specific defects, so the full suite may fail by design.
- Missing credentials block UI or API execution.
- Network instability can affect UI and API timings.
