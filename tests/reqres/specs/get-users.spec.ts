import { expect, test } from '@playwright/test';
import { expectJsonResponse, requireReqResApiKey } from '../support/api-test-helpers.js';
import { GetUsersResponseSchema, type GetUsersResponse } from '../schemas/get-users-response.js';

test.describe('ReqRes API - GET List Users', () => {
  test.beforeAll(() => {
    requireReqResApiKey();
  });

  test('validates response schema', async ({ request }) => {
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Response schema validation covers the optional data-type assertions for the users list endpoint.'
    });

    const response = await request.get('/api/users');
    expectJsonResponse(response, 200);

    const body: GetUsersResponse = GetUsersResponseSchema.parse(await response.json());

    expect(body.data.length).toBeGreaterThan(0);
  });

  test('validates page 2 users and pagination metadata', async ({ request }) => {
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Listing users is essential because consumers need stable pagination metadata and predictable user records.'
    });

    const response = await request.get('/api/users?page=2');
    expectJsonResponse(response, 200);

    const body: GetUsersResponse = GetUsersResponseSchema.parse(await response.json());

    expect(body.total).toBe(12);
    expect(body.data).toHaveLength(body.per_page);
    expect(body.data[0].last_name).toBe('Lawson');
    expect(body.data[1].last_name).toBe('Ferguson');
  });
});
