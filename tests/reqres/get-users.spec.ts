import { expect, test } from '@playwright/test';
import {
  expectJsonResponse,
  isPlainObject,
  isString
} from './api-test-helpers.js';

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

function isUser(value: unknown): value is User {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    typeof value.id === 'number' &&
    isString(value.email) &&
    isString(value.first_name) &&
    isString(value.last_name) &&
    isString(value.avatar)
  );
}

function expectValueToMatchGetUsersResponseShape(value: unknown): asserts value is GetUsersResponse {
  expect(isPlainObject(value)).toBe(true);
  if (!isPlainObject(value)) {
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
  expect(isPlainObject(value.support)).toBe(true);
  if (!isPlainObject(value.support)) {
    throw new Error('Expected response support to be an object.');
  }

  expect(isString(value.support.url)).toBe(true);
  expect(isString(value.support.text)).toBe(true);
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
    expectValueToMatchGetUsersResponseShape(body);

    expect(body.total).toBe(12);
    expect(body.data).toHaveLength(body.per_page);
    expect(body.data[0].last_name).toBe('Lawson');
    expect(body.data[1].last_name).toBe('Ferguson');
  });
});
