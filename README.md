# QA Automation Assignment

Playwright Test + TypeScript solution for two Moxymind technical tasks.

- Task 1: frontend e2e automation for [SauceDemo](https://www.saucedemo.com/)
- Task 2: REST API automation for [ReqRes](https://reqres.in/)

The tested applications are external systems, so this repository is a black-box automation project. The application code is not expected to live next to these tests.

## Prerequisites

- Node.js 20 or newer
- npm
- Internet access to `saucedemo.com` and `reqres.in`

## Setup

```bash
npm install
npm run install:browsers
```

ReqRes currently rejects unauthenticated legacy API requests. Create a free API key at the ReqRes dashboard and provide it as `REQRES_API_KEY` before running API tests.
If `REQRES_API_KEY` is not set, the API tests are skipped with an explicit reason so the UI assignment remains runnable from a clean machine.

Optional environment variables:

```bash
REQRES_API_KEY=replace-with-your-reqres-api-key
API_RESPONSE_TIME_LIMIT_MS=1000
```

On Windows PowerShell:

```powershell
$env:REQRES_API_KEY="replace-with-your-reqres-api-key"
$env:API_RESPONSE_TIME_LIMIT_MS="1000"
```

## Run Tests

```bash
npm test
npm run test:ui
npm run test:ui:headed
npm run test:defects
npm run test:defects:headed
npm run test:api
npm run report
```

For an easier visual demo, run headed tests with slow motion:

```powershell
$env:PLAYWRIGHT_SLOW_MO_MS="300"
npm run test:defects:headed
```

## Test Cases

### Frontend UI: SauceDemo

1. Successful login opens the inventory page
   - Essential because every shopping flow starts behind the authentication gate.

2. Locked-out user receives a clear login error
   - Essential because blocked users must not enter the application.

3. Sorting products and changing cart contents updates the shopping state
   - Essential because sorting drives product discovery and cart updates represent purchase intent.

4. Complete checkout flow ends with an order confirmation
   - Essential because checkout is the main business path from selected item to completed order.

5. Special user behavior
   - SauceDemo intentionally exposes different defects through dedicated users.
   - `performance_glitch_user` is covered with a login performance expectation.
   - `problem_user` is covered for broken product images and corrupted checkout form input.
   - `error_user` is covered for checkout form data loss.
   - `visual_user` is covered for incorrect product prices and a broken product image.
   - These tests use Playwright `test.fail(...)` to document known defects as expected failures while keeping the automated report explicit.

### API: ReqRes

1. `GET /api/users?per_page=12`
   - Validates status code, `total`, first and second `last_name`, `data` count, pagination metadata and user field types.
   - `per_page=12` is used because the assignment asks to compare the number of users in `data` to `total`; the default paginated response returns only one page while `total` represents the whole collection.

2. `POST /api/users`
   - Uses external data from `tests/api/data/create-users.json`.
   - Validates HTTP status, generated `id`, `createdAt`, request echo, timestamp format, response time and response shape.

## Project Structure

```text
src/pages/                  SauceDemo page objects
tests/ui/                   Frontend e2e tests
tests/api/                  ReqRes API tests
tests/api/data/             External data for data-driven tests
playwright.config.ts        Playwright projects for UI and API
```

## GitHub Publishing

Create an empty public repository named `qa-automation-assignment` on GitHub, then connect this local repository:

```bash
git remote add origin https://github.com/<your-user>/qa-automation-assignment.git
git branch -M main
git push -u origin main
```

The repository includes a GitHub Actions workflow at `.github/workflows/playwright.yml`. To run the ReqRes API tests in CI, add a repository secret named `REQRES_API_KEY`.
