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

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function expectJsonResponse(response: APIResponse, expectedStatus: number) {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toContain('application/json');
}
