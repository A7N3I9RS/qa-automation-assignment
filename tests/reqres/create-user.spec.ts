import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  expectJsonResponse,
  isNonEmptyString,
  isRecord,
  type NonEmptyString
} from './api-test-helpers.js';

type CreateUserPayload = {
  name: string;
  job: string;
};

type CreateUserResponse = {
  name: NonEmptyString;
  job: NonEmptyString;
  id: NonEmptyString;
  createdAt: NonEmptyString;
};

const responseTimeLimitMs = Number(process.env.API_RESPONSE_TIME_LIMIT_MS ?? 1000);
const currentDir = dirname(fileURLToPath(import.meta.url));
const createUsers = JSON.parse(
  readFileSync(join(currentDir, 'data/create-users.json'), 'utf-8')
) as CreateUserPayload[];

function expectCreateUserResponse(
  value: unknown,
  expectedUser: CreateUserPayload
): asserts value is CreateUserResponse {
  expect(isRecord(value)).toBe(true);
  if (!isRecord(value)) {
    throw new Error('Expected response body to be an object.');
  }

  expect(value).toMatchObject({
    name: expectedUser.name,
    job: expectedUser.job
  });
  expect(isNonEmptyString(value.name)).toBe(true);
  expect(isNonEmptyString(value.job)).toBe(true);
  expect(isNonEmptyString(value.id)).toBe(true);
  expect(isNonEmptyString(value.createdAt)).toBe(true);
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

      const body: unknown = await response.json();
      expectCreateUserResponse(body, user);

      expect(Date.parse(body.createdAt)).not.toBeNaN();
    });
  }
});
