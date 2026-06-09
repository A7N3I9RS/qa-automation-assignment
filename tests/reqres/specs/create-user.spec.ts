import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CreateUserPayloadSchema,
  CreateUserResponseSchema,
  type CreateUserPayload,
  type CreateUserResponse
} from '../schemas/create-user.js';
import { expectJsonResponse, requireReqResApiKey } from '../support/api-test-helpers.js';

const responseTimeLimitMs = Number(process.env.API_RESPONSE_TIME_LIMIT_MS ?? 1000);
const currentDir = dirname(fileURLToPath(import.meta.url));
const createUsers: CreateUserPayload[] = CreateUserPayloadSchema.array().parse(
  JSON.parse(readFileSync(join(currentDir, '../data/create-users.json'), 'utf-8'))
);

test.describe('ReqRes API - POST Create User', () => {
  test.beforeAll(() => {
    requireReqResApiKey();
  });

  for (const user of createUsers) {
    test(`validates response schema and created user data for ${user.name}`, async ({
      request
    }) => {
      test.info().annotations.push({
        type: 'rationale',
        description:
          'Creating users is essential because POST flows must validate request construction, response metadata, schema and performance.'
      });

      const startedAt = Date.now();
      const response = await request.post('/api/users', { data: user });
      const responseTimeMs = Date.now() - startedAt;

      expectJsonResponse(response, 201);
      expect(responseTimeMs).toBeLessThan(responseTimeLimitMs);

      const body: CreateUserResponse = CreateUserResponseSchema.parse(await response.json());

      expect(body.name).toBe(user.name);
      expect(body.job).toBe(user.job);

      const createdAtTimestamp = Date.parse(body.createdAt);
      expect(typeof createdAtTimestamp).toBe('number');
      expect(createdAtTimestamp).toBeGreaterThan(0);
    });
  }
});
