import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  expectJsonResponse,
  expectPlainObject,
  isNonEmptyString,
  requireReqResApiKey,
  type NonEmptyString
} from '../support/api-test-helpers.js';

type CreateUserPayload = {
  name: string;
  job: string;
};

type CreateUserResponse = {
  name: string;
  job: string;
  id: NonEmptyString;
  createdAt: NonEmptyString;
};

const responseTimeLimitMs = Number(process.env.API_RESPONSE_TIME_LIMIT_MS ?? 1000);
const currentDir = dirname(fileURLToPath(import.meta.url));
const createUsers = JSON.parse(
  readFileSync(join(currentDir, '../data/create-users.json'), 'utf-8')
) as CreateUserPayload[];

function expectCreateUserResponse(
  value: unknown,
  expectedUser: CreateUserPayload
): asserts value is CreateUserResponse {
  expectPlainObject(value, 'Expected response body to be an object.');

  expect(value).toMatchObject({
    name: expectedUser.name,
    job: expectedUser.job
  });
  expect(value.name).toBe(expectedUser.name);
  expect(value.job).toBe(expectedUser.job);
  expect(isNonEmptyString(value.id)).toBe(true);
  expect(isNonEmptyString(value.createdAt)).toBe(true);
}

test.describe('ReqRes API - POST Create User', () => {
  test.beforeAll(() => {
    requireReqResApiKey();
  });

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
