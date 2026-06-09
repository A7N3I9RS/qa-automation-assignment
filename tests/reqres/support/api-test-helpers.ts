import { expect, type APIResponse } from '@playwright/test';

export function expectJsonResponse(response: APIResponse, expectedStatus: number) {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toContain('application/json');
}

export function requireReqResApiKey() {
  if (!process.env.REQRES_API_KEY) {
    throw new Error(
      'REQRES_API_KEY is required to run ReqRes API tests. Create a free key at https://app.reqres.in/api-keys and set it in .env or GitHub Actions Secrets.'
    );
  }
}
