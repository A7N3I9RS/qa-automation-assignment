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

##### Test Case: API returns expected users, counts and data types

Automated in [tests/reqres/reqres.spec.ts](../tests/reqres/reqres.spec.ts).

Preconditions:

- `REQRES_API_KEY` is configured.

Test steps:

1. Send `GET /api/users?per_page=12`.
2. Verify status code.
3. Verify response content type.
4. Verify total user count and returned data count.
5. Verify known user last names.
6. Verify pagination metadata and user field types.

Expected result:

- API returns `200`.
- Response contains expected users, counts and data structure.

Why essential:

- Listing users is essential because consumers need stable pagination metadata and predictable user records.

### Test Suite: Create User

#### Test Scenario: Client creates users

##### Test Case: API creates users from external test data

Automated in [tests/reqres/reqres.spec.ts](../tests/reqres/reqres.spec.ts) with external data from [tests/reqres/data/create-users.json](../tests/reqres/data/create-users.json).

Preconditions:

- `REQRES_API_KEY` is configured.
- Create-user test data is available.

Test steps:

1. Read user payload from external test data.
2. Send `POST /api/users`.
3. Verify status code.
4. Verify response content type.
5. Verify that request fields are echoed in the response.
6. Verify that generated `id` and `createdAt` are present.
7. Verify that `createdAt` is parseable as a date.
8. Verify response time.

Expected result:

- API returns `201`.
- Response contains created-user metadata and echoes the submitted data.

Why essential:

- Create-user coverage is essential because POST flows must validate request construction, response metadata and response performance.
