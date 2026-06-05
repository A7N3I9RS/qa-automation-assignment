# Test Plan

## Objective

Validate the most important user-facing behavior for the assigned applications:

- SauceDemo frontend shopping flow
- ReqRes REST API list and create-user behavior

The goal is to provide high-value regression coverage with Playwright while keeping the suite understandable, maintainable and runnable from a clean machine.

## Context

No explicit business requirements were provided with the assignment. Before starting automation, the applications were explored as black-box systems to understand their purpose, main user flows and visible risks.

The key assumptions and scenarios were identified from the visible application behavior and documented here as the basis for automation coverage.

## Scope

### In Scope

- SauceDemo authentication
- SauceDemo product catalog and sorting
- SauceDemo cart updates
- SauceDemo checkout happy path
- SauceDemo user-specific behavior differences
- ReqRes `GET /api/users`
- ReqRes `POST /api/users`
- Basic API response status, schema, data and performance checks

### Out of Scope

- Source-code level testing of SauceDemo or ReqRes
- Payment processing, because SauceDemo uses a demo checkout flow
- Cross-browser matrix beyond Desktop Chrome
- Mobile-specific UI coverage
- Accessibility audit
- Visual regression snapshots
- Load and stress testing
- Contract testing against a formal OpenAPI schema

## Business Scenarios

The main business scenario for SauceDemo is a successful product purchase flow:

```text
Login -> Products -> Add to cart -> Cart -> Checkout information -> Overview -> Complete order
```

This flow was automated first because it validates the main user journey and gives the highest regression value.

Supporting business scenarios:

- User can log in with valid credentials
- Locked-out user cannot access the application
- User can sort products and manage cart contents
- Users with the same shopper role should receive the same core behavior

Functional areas used for test design:

- Authentication
- Product Catalog
- Cart
- Checkout
- Shared Shopper Behavior
- Users API

For detailed scenarios and concrete test cases, see [Test design](test-design.md), [SauceDemo test design](saucedemo-test-design.md), and [ReqRes test design](reqres-test-design.md).

## Test Approach

The project uses a risk-based automation approach:

- Start with the critical happy path for `standard_user`
- Add negative authentication coverage for `locked_out_user`
- Cover catalog and cart behavior because they affect purchase intent
- Run shared shopper behavior against SauceDemo special users to expose known user-specific defects
- Keep known defects visible as failing tests instead of hiding them as expected failures
- Use Playwright API testing for ReqRes endpoint validation

## Test Types

- End-to-end UI tests
- Negative UI tests
- User-behavior matrix tests
- REST API functional tests
- Basic API schema and data validation
- Basic API response-time validation for create-user requests

## Test Environment

- Test runner: Playwright Test
- Language: TypeScript
- UI browser project: Desktop Chrome
- UI base URL: `https://www.saucedemo.com`
- API base URL: `https://reqres.in`
- Report: Playwright HTML report
- CI: GitHub Actions

## Test Data

SauceDemo users:

- `standard_user`
- `locked_out_user`
- `problem_user`
- `performance_glitch_user`
- `error_user`
- `visual_user`

Shared SauceDemo password:

```text
secret_sauce
```

ReqRes create-user data is stored in [tests/reqres/data/create-users.json](../tests/reqres/data/create-users.json).

## Assumptions

- SauceDemo is a demo e-commerce application where the main business value is completing a product purchase flow.
- `standard_user` represents the expected baseline shopper behavior.
- SauceDemo special users intentionally expose defects and should be tested as a behavior matrix.
- ReqRes requires `REQRES_API_KEY` for API tests, so API tests are skipped when the key is not provided.
- Desktop Chrome is sufficient for the assignment unless a wider browser matrix is requested.

## Risks

- External test environments can change without notice.
- SauceDemo intentionally contains user-specific defects, so the full suite may fail by design.
- ReqRes API authentication requirements can block API execution if `REQRES_API_KEY` is not configured.
- Network instability can affect both UI and API tests.
- Demo data may change because both systems are externally hosted.

## Entry Criteria

- Dependencies are installed with `npm install`
- Chromium is installed with `npm run install:browsers`
- Internet access is available
- `REQRES_API_KEY` is configured when API tests are required

## Exit Criteria

- Stable baseline UI tests pass for `standard_user`
- Locked-out login behavior is validated
- API tests pass when `REQRES_API_KEY` is configured
- Known SauceDemo defects are visible in the report
- Test results can be reviewed through the Playwright HTML report

## Deliverables

- SauceDemo Playwright tests in [tests/saucedemo](../tests/saucedemo)
- ReqRes Playwright tests in [tests/reqres](../tests/reqres)
- SauceDemo typed Playwright fixtures in [src/saucedemo/fixtures](../src/saucedemo/fixtures)
- SauceDemo page objects in [src/saucedemo/pages](../src/saucedemo/pages)
- SauceDemo reusable scenario helpers in [src/saucedemo/scenarios](../src/saucedemo/scenarios)
- Test documentation in [docs](.)
- GitHub Actions workflow in [.github/workflows/playwright.yml](../.github/workflows/playwright.yml)
