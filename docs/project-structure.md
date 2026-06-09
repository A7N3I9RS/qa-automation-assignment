# Project Structure

```text
.github/workflows/          GitHub Actions workflow
docs/                       Test plan and supporting documentation
src/saucedemo/fixtures/     SauceDemo typed Playwright fixtures
src/saucedemo/pages/        SauceDemo page objects
src/saucedemo/scenarios/    SauceDemo reusable scenario helpers
tests/saucedemo/            SauceDemo frontend e2e tests
tests/reqres/               ReqRes API tests
tests/reqres/data/          ReqRes external data for data-driven tests
playwright.config.ts        Playwright project definitions for SauceDemo and ReqRes
package.json                readable npm scripts and project metadata
```

## Key Files

- [README.md](../README.md): project entry point
- [docs/test-plan.md](test-plan.md): scope, assumptions, risks and approach
- [docs/test-design.md](test-design.md): test design overview
- [docs/saucedemo-test-design.md](saucedemo-test-design.md): SauceDemo test design from business flow to automated test steps
- [docs/reqres-test-design.md](reqres-test-design.md): ReqRes test design from API capability to automated test steps
- [docs/automation-approach.md](automation-approach.md): test architecture and execution strategy
- [src/saucedemo/fixtures/pages.ts](../src/saucedemo/fixtures/pages.ts): SauceDemo page-object fixtures
- [playwright.config.ts](../playwright.config.ts): Playwright configuration
- [tests/saucedemo](../tests/saucedemo): SauceDemo tests
- [tests/reqres](../tests/reqres): ReqRes tests
