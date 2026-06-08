import { expect, test } from '@playwright/test';
import {
  expectJsonResponse,
  isNonEmptyString,
  isRecord,
  type NonEmptyString
} from './api-test-helpers.js';

type User = {
  id: number;
  email: NonEmptyString;
  first_name: NonEmptyString;
  last_name: NonEmptyString;
  avatar: NonEmptyString;
};

type GetUsersResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: {
    url: NonEmptyString;
    text: NonEmptyString;
  };
};

function isUser(value: unknown): value is User {
  if (!isRecord(value)) {
    return false;
  }

  const user = value as User;

  return (
    typeof user?.id === 'number' &&
    isNonEmptyString(user.email) &&
    isNonEmptyString(user.first_name) &&
    isNonEmptyString(user.last_name) &&
    isNonEmptyString(user.avatar)
  );
}

function expectGetUsersResponse(value: unknown): asserts value is GetUsersResponse {
  expect(isRecord(value)).toBe(true);
  if (!isRecord(value)) {
    throw new Error('Expected response body to be an object.');
  }

  expect(typeof value.page).toBe('number');
  expect(typeof value.per_page).toBe('number');
  expect(typeof value.total).toBe('number');
  expect(typeof value.total_pages).toBe('number');
  expect(Array.isArray(value.data)).toBe(true);
  if (!Array.isArray(value.data)) {
    throw new Error('Expected response data to be an array.');
  }

  expect(value.data.every(isUser)).toBe(true);
  expect(isRecord(value.support)).toBe(true);
  if (!isRecord(value.support)) {
    throw new Error('Expected response support to be an object.');
  }

  expect(isNonEmptyString(value.support.url)).toBe(true);
  expect(isNonEmptyString(value.support.text)).toBe(true);
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

    const body: unknown = await response.json();
    expectGetUsersResponse(body);

    expect(body.total).toBe(12);
    expect(body.data).toHaveLength(body.per_page);
    expect(body.data[0].last_name).toBe('Lawson');
    expect(body.data[1].last_name).toBe('Ferguson');

  });
});
