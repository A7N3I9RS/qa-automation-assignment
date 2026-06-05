import { defineConfig, devices } from '@playwright/test';

const apiHeaders = {
  ...(process.env.REQRES_API_KEY ? { 'x-api-key': process.env.REQRES_API_KEY } : {}),
  'Content-Type': 'application/json'
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    launchOptions: {
      slowMo: Number(process.env.PLAYWRIGHT_SLOW_MO_MS ?? 0)
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'saucedemo',
      testDir: './tests/saucedemo',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com'
      }
    },
    {
      name: 'reqres',
      testDir: './tests/reqres',
      use: {
        baseURL: 'https://reqres.in',
        extraHTTPHeaders: apiHeaders
      }
    }
  ]
});
