import { expect, test, type APIResponse } from '@playwright/test';

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

type GetUsersResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: {
    url: string;
    text: string;
  };
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isUser(value: unknown): value is User {
  const user = value as User;

  return (
    typeof user?.id === 'number' &&
    isNonEmptyString(user.email) &&
    isNonEmptyString(user.first_name) &&
    isNonEmptyString(user.last_name) &&
    isNonEmptyString(user.avatar)
  );
}

function expectJsonResponse(response: APIResponse, expectedStatus: number) {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toContain('application/json');
}

test.describe('ReqRes API - GET List Users', () => {
  test.skip(
    !process.env.REQRES_API_KEY,
    'REQRES_API_KEY is required because ReqRes now rejects unauthenticated legacy API requests.'
  );

  test('returns expected users, counts and data types', async ({ request }) => {
    test.info().annotations.push({
      type: 'rationale',
      description:
        'Listing users is essential because consumers need stable pagination metadata and predictable user records.'
    });

    const response = await request.get('/api/users?page=2');
    expectJsonResponse(response, 200);

    const body = (await response.json()) as GetUsersResponse;

    expect(body.total).toBe(12);
    expect(body.data).toHaveLength(body.per_page);
    expect(body.data[0].last_name).toBe('Lawson');
    expect(body.data[1].last_name).toBe('Ferguson');

    expect(typeof body.page).toBe('number');
    expect(typeof body.per_page).toBe('number');
    expect(typeof body.total_pages).toBe('number');
    expect(body.data.every(isUser)).toBe(true);
    expect(isNonEmptyString(body.support.url)).toBe(true);
    expect(isNonEmptyString(body.support.text)).toBe(true);
  });
});
