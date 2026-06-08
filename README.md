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
PLAYWRIGHT_SLOW_MO_MS=300
```

On Windows PowerShell:

```powershell
$env:REQRES_API_KEY="replace-with-your-reqres-api-key"
$env:API_RESPONSE_TIME_LIMIT_MS="1000"
$env:PLAYWRIGHT_SLOW_MO_MS="300"
```

## Run Tests

```bash
npm test
npm run test:saucedemo
npm run test:reqres
npm run test:baseline
npm run test:ui
npm run test:ui-mode
npm run test:ui:headed
npm run test:matrix
npm run test:matrix:headed
npm run test:defects
npm run test:defects:headed
npm run test:api
npm run report
```

`npm test` runs the full regression suite. It is expected to fail while SauceDemo still contains user-specific defects. Use `npm run test:baseline` to demonstrate the stable SauceDemo happy-path coverage for `standard_user` and the locked-out login check.

Use `npm run test:ui-mode` during local development to open Playwright UI mode for interactive running, debugging and rerunning tests.

For an easier visual demo, run headed tests with slow motion:

```powershell
$env:PLAYWRIGHT_SLOW_MO_MS="300"
npm run test:matrix:headed
```

The repository includes a GitHub Actions workflow at [.github/workflows/playwright.yml](.github/workflows/playwright.yml). To run the ReqRes API tests in CI, add a repository secret named `REQRES_API_KEY`.
