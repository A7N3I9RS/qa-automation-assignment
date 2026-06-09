# Automation Approach

## Architecture

The project uses Playwright Test with TypeScript.

- SauceDemo UI tests use page-object fixtures from [src/saucedemo/fixtures](../src/saucedemo/fixtures) and page objects from [src/saucedemo/pages](../src/saucedemo/pages).
- SauceDemo shared account and customer data lives in [src/saucedemo/data](../src/saucedemo/data).
- ReqRes API tests use Playwright's `request` fixture, Zod schemas and external data from [tests/reqres/data](../tests/reqres/data).

## Coverage Strategy

The highest-value SauceDemo flow is:

```text
Login -> Products -> Add to cart -> Cart -> Checkout information -> Overview -> Complete order
```

The suite starts from that flow, then adds authentication, catalog/cart behavior, user-account variation, visual comparison and ReqRes API checks.

SauceDemo intentionally exposes defects through `problem_user`, `performance_glitch_user`, `error_user` and `visual_user`. The tests keep these differences visible in the functional area where they occur.

## Visual Testing

Checkout overview is the only visual regression target. The baseline is captured with `STANDARD_USER`; all other users with access compare against that browser/OS-specific baseline.

Snapshots include the Playwright project name and OS platform in the path, so Chromium, Firefox, WebKit, Windows and Linux never compare screenshots against each other.

Refresh baselines with:

```bash
npm run test:saucedemo:update-snapshots
```

GitHub Actions runs on Ubuntu, so CI baselines should be generated as `*-linux.png` files in an Ubuntu-compatible environment.

## Reporting and CI

Playwright retains trace, screenshot and video artifacts on failure and generates an HTML report.

GitHub Actions runs `npm test`, uploads the HTML report as an artifact and deploys it to GitHub Pages on `main`. CI requires repository secrets named `USERS_PASSWORD` and `REQRES_API_KEY`.

For the full command list, see [README.md](../README.md) or [package.json](../package.json).
