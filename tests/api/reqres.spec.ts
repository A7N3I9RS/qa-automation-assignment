import { expect, test, type APIResponse } from '@playwright/test';
import createUsers from './data/create-users.json';

type ReqResUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

type ListUsersResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUser[];
  support: {
    url: string;
    text: string;
  };
};

type CreateUserResponse = {
  name: string;
  job: string;
  id: string;
  createdAt: string;
};

const responseTimeLimitMs = Number(process.env.API_RESPONSE_TIME_LIMIT_MS ?? 1000);

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isReqResUser(value: unknown): value is ReqResUser {
  const user = value as ReqResUser;

  return (
    typeof user?.id === 'number' &&
    isString(user.email) &&
    isString(user.first_name) &&
    isString(user.last_name) &&
    isString(user.avatar)
  );
}

function expectSuccessfulResponse(response: APIResponse, expectedStatus: number) {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toContain('application/json');
}

test.describe('ReqRes API', () => {
  test.skip(
    !process.env.REQRES_API_KEY,
    'REQRES_API_KEY is required because ReqRes now rejects unauthenticated legacy API requests.'
  );

  test('GET list users returns expected users, counts and data types', async ({ request }) => {
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Listing users is essential because consumers need stable pagination metadata and predictable user records.'
    });

    const response = await request.get('/api/users?per_page=12');
    expectSuccessfulResponse(response, 200);

    const body = (await response.json()) as ListUsersResponse;

    expect(body.total).toBe(12);
    expect(body.data).toHaveLength(body.total);
    expect(body.data[0].last_name).toBe('Bluth');
    expect(body.data[1].last_name).toBe('Weaver');

    expect(typeof body.page).toBe('number');
    expect(typeof body.per_page).toBe('number');
    expect(typeof body.total_pages).toBe('number');
    expect(body.data.every(isReqResUser)).toBe(true);
    expect(isString(body.support.url)).toBe(true);
    expect(isString(body.support.text)).toBe(true);
  });

  for (const user of createUsers) {
    test(`POST create user returns id and timestamp for ${user.name}`, async ({ request }) => {
      test.info().annotations.push({
        type: 'rationale',
        description:
          'Creating users is essential because POST flows must validate request construction, response metadata and performance.'
      });

      const startedAt = Date.now();
      const response = await request.post('/api/users', { data: user });
      const responseTimeMs = Date.now() - startedAt;

      expectSuccessfulResponse(response, 201);
      expect(responseTimeMs).toBeLessThan(responseTimeLimitMs);

      const body = (await response.json()) as CreateUserResponse;

      expect(body).toMatchObject({
        name: user.name,
        job: user.job
      });
      expect(isString(body.id)).toBe(true);
      expect(isString(body.createdAt)).toBe(true);
      expect(Date.parse(body.createdAt)).not.toBeNaN();
    });
  }
});
