import { expect, type APIResponse } from '@playwright/test';

declare const nonEmptyStringBrand: unique symbol;

export type NonEmptyString = string & {
  readonly [nonEmptyStringBrand]: true;
};

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNonEmptyString(value: unknown): value is NonEmptyString {
  return typeof value === 'string' && value.length > 0;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function expectPlainObject(
  value: unknown,
  message = 'Expected value to be an object.'
): asserts value is Record<string, unknown> {
  expect(isPlainObject(value)).toBe(true);
  if (!isPlainObject(value)) {
    throw new Error(message);
  }
}

export function expectArray(
  value: unknown,
  message = 'Expected value to be an array.'
): asserts value is unknown[] {
  expect(Array.isArray(value)).toBe(true);
  if (!Array.isArray(value)) {
    throw new Error(message);
  }
}

export function expectJsonResponse(response: APIResponse, expectedStatus: number) {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toContain('application/json');
}
