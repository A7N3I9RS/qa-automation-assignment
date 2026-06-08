import { expect, test, type APIResponse } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type CreateUserPayload = {
  name: string;
  job: string;
};

type CreateUserResponse = {
  name: string;
  job: string;
  id: string;
  createdAt: string;
};

const responseTimeLimitMs = Number(process.env.API_RESPONSE_TIME_LIMIT_MS ?? 1000);
const currentDir = dirname(fileURLToPath(import.meta.url));
const createUsers = JSON.parse(
  readFileSync(join(currentDir, 'data/create-users.json'), 'utf-8')
) as CreateUserPayload[];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function expectJsonResponse(response: APIResponse, expectedStatus: number) {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toContain('application/json');
}

test.describe('ReqRes API - POST Create User', () => {
  test.skip(
    !process.env.REQRES_API_KEY,
    'REQRES_API_KEY is required because ReqRes now rejects unauthenticated legacy API requests.'
  );

  for (const user of createUsers) {
    test(`returns id and timestamp for ${user.name}`, async ({ request }) => {
      test.info().annotations.push({
        type: 'rationale',
        description:
          'Creating users is essential because POST flows must validate request construction, response metadata and performance.'
      });

      const startedAt = Date.now();
      const response = await request.post('/api/users', { data: user });
      const responseTimeMs = Date.now() - startedAt;

      expectJsonResponse(response, 201);
      expect(responseTimeMs).toBeLessThan(responseTimeLimitMs);

      const body = (await response.json()) as CreateUserResponse;

      expect(body).toMatchObject({
        name: user.name,
        job: user.job
      });
      expect(isNonEmptyString(body.id)).toBe(true);
      expect(isNonEmptyString(body.createdAt)).toBe(true);
      expect(Date.parse(body.createdAt)).not.toBeNaN();
    });
  }
});
