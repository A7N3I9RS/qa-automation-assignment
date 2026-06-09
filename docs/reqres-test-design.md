# ReqRes Test Design

## Application: ReqRes

ReqRes is a public REST API used for the API automation part of the assignment.

The tested API capabilities are:

```text
Client lists users
Client creates users
```

## Functional Area: Users API

The Users API exposes user listing and user creation behavior through public endpoints.

### Test Suite: List Users

#### Test Scenario: Client retrieves users

##### Test Case: API returns the expected users-list response schema

Automated in [tests/reqres/specs/get-users.spec.ts](../tests/reqres/specs/get-users.spec.ts).

Preconditions:

- `REQRES_API_KEY` is configured.

Test steps:

1. Send `GET /api/users`.
2. Verify status code.
3. Verify response content type.
4. Validate the response schema and possible data types with Zod.

Expected result:

- API returns `200`.
- Response matches the expected users-list schema.

##### Test Case: API returns expected page 2 users and pagination metadata

Automated in [tests/reqres/specs/get-users.spec.ts](../tests/reqres/specs/get-users.spec.ts).

Preconditions:

- `REQRES_API_KEY` is configured.

Test steps:

1. Send `GET /api/users?page=2`.
2. Verify status code.
3. Verify response content type.
4. Verify total user count and returned data count for the current page.
5. Verify known user last names.
6. Validate the response schema with Zod.

Expected result:

- API returns `200`.
- Response contains expected page 2 users, counts and data structure.

Why essential:

- Listing users is essential because consumers need stable pagination metadata and predictable user records.

### Test Suite: Create User

#### Test Scenario: Client creates users

##### Test Case: API returns the expected create-user response schema

Automated in [tests/reqres/specs/create-user.spec.ts](../tests/reqres/specs/create-user.spec.ts) with external data from [tests/reqres/data/create-users.json](../tests/reqres/data/create-users.json).

Preconditions:

- `REQRES_API_KEY` is configured.
- Create-user test data is available.

Test steps:

1. Read one user payload from external test data.
2. Send `POST /api/users`.
3. Verify status code.
4. Verify response content type.
5. Validate the response schema with Zod.

Expected result:

- API returns `201`.
- Response matches the expected create-user schema.

##### Test Case: API creates users from external test data

Automated in [tests/reqres/specs/create-user.spec.ts](../tests/reqres/specs/create-user.spec.ts) with external data from [tests/reqres/data/create-users.json](../tests/reqres/data/create-users.json).

Preconditions:

- `REQRES_API_KEY` is configured.
- Create-user test data is available.

Test steps:

1. Read user payloads from external test data.
2. Send `POST /api/users` for each payload.
3. Verify status code.
4. Verify response content type.
5. Verify response time.
6. Verify that request fields are echoed in the response.
7. Verify that generated `id` and `createdAt` are strings.
8. Verify that `createdAt` is parseable as a date.

Expected result:

- API returns `201`.
- Response contains created-user metadata and echoes the submitted data.

Why essential:

- Create-user coverage is essential because POST flows must validate request construction, response metadata and response performance.
