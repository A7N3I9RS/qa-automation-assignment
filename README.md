# QA Automation Assignment

Playwright Test + TypeScript solution for two Moxymind technical tasks.

- Task 1: frontend e2e automation for [SauceDemo](https://www.saucedemo.com/)
- Task 2: REST API automation for [ReqRes](https://reqres.in/)

The tested applications are external systems, so this repository is a black-box automation project. The application code is not expected to live next to these tests.

## Documentation

- [Test plan](docs/test-plan.md)
- [Test design](docs/test-design.md)
  - [SauceDemo test design](docs/saucedemo-test-design.md)
  - [ReqRes test design](docs/reqres-test-design.md)
- [Automation approach](docs/automation-approach.md)
- [Project structure](docs/project-structure.md)

## Prerequisites

- Node.js 24 LTS recommended
- npm
- Internet access to `saucedemo.com` and `reqres.in`

## Setup

```bash
npm install
npm run install:browsers
```

Provide the shared SauceDemo users password as `USERS_PASSWORD` before running UI tests.

ReqRes currently rejects unauthenticated legacy API requests. Create a free API key at the ReqRes dashboard and provide it as `REQRES_API_KEY` before running API tests.
If `REQRES_API_KEY` is not set, the API tests fail with an explicit setup error.

Optional environment variables:

```bash
USERS_PASSWORD=replace-with-your-users-password
REQRES_API_KEY=replace-with-your-reqres-api-key
API_RESPONSE_TIME_LIMIT_MS=2000
PLAYWRIGHT_SLOW_MO_FLAG=0
PLAYWRIGHT_SLOW_MO_MS_TIME=1000
```

For local runs, these values can be stored in a `.env` file copied from `.env.example`.

On Windows PowerShell:

```powershell
$env:USERS_PASSWORD="replace-with-your-users-password"
$env:REQRES_API_KEY="replace-with-your-reqres-api-key"
$env:API_RESPONSE_TIME_LIMIT_MS="2000"
$env:PLAYWRIGHT_SLOW_MO_FLAG="0"
$env:PLAYWRIGHT_SLOW_MO_MS_TIME="1000"
```

## Run Tests

```bash
npm test
npm run test:saucedemo:all-browsers
npm run test:saucedemo:chromium
npm run test:saucedemo:chromium:headed
npm run test:saucedemo:firefox
npm run test:saucedemo:webkit
npm run test:saucedemo:update-snapshots
npm run test:reqres
npm run test:saucedemo:baseline
npm run test:ui-mode
npm run show-report
```

`npm test` runs every Playwright project. GitHub Actions uses the same command so CI reports the real product state, including SauceDemo user-specific defects.

Use `npm run test:saucedemo:baseline` when you need a focused baseline check for the `standard_user` happy path and locked-out login behavior.

Use `npm run test:saucedemo:update-snapshots` to refresh SauceDemo visual snapshots for Chromium, Firefox and WebKit. Snapshot files include the Playwright project name, so each browser compares only against its own baseline.

Use `npm run test:ui-mode` during local development to open Playwright UI mode for interactive running, debugging and rerunning tests.

Use `npm run show-report` to open the latest Playwright HTML report. Keep `http://localhost:9323/` open and refresh it after test reruns.

In GitHub Actions, the Playwright HTML report is uploaded as a workflow artifact. On `main`, the same report is also deployed to GitHub Pages for easier review.

For an easier visual demo, run headed tests with slow motion:

```powershell
$env:PLAYWRIGHT_SLOW_MO_FLAG="1"
$env:PLAYWRIGHT_SLOW_MO_MS_TIME="1000"
npm run test:saucedemo:chromium:headed
```

`PLAYWRIGHT_SLOW_MO_MS_TIME` defaults to `1000` milliseconds, but it only takes effect when `PLAYWRIGHT_SLOW_MO_FLAG` is enabled.

The repository includes a GitHub Actions workflow at [.github/workflows/playwright.yml](.github/workflows/playwright.yml). It intentionally runs the full test suite so failures can be used for defect triage. To publish the HTML report to GitHub Pages, configure Pages to use GitHub Actions as the source. To run the suite in CI, add repository secrets named `USERS_PASSWORD` and `REQRES_API_KEY`.
