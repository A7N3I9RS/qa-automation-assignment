# Project Structure

```text
.github/workflows/          GitHub Actions workflow
docs/                       Test plan and supporting documentation
src/pages/                  SauceDemo page objects
src/scenarios/              Reusable SauceDemo scenario helpers
tests/ui/                   Frontend e2e tests
tests/api/                  ReqRes API tests
tests/api/data/             External data for data-driven API tests
playwright.config.ts        Playwright projects for UI and API
package.json                npm scripts and project metadata
```

## Key Files

- [README.md](../README.md): project entry point
- [docs/test-plan.md](test-plan.md): scope, assumptions, risks and approach
- [docs/test-scenarios.md](test-scenarios.md): automated scenarios and coverage
- [docs/automation-approach.md](automation-approach.md): test architecture and execution strategy
- [playwright.config.ts](../playwright.config.ts): Playwright configuration
- [tests/ui](../tests/ui): SauceDemo UI tests
- [tests/api](../tests/api): ReqRes API tests
