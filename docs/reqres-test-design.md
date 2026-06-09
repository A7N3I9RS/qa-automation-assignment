# ReqRes Test Design

ReqRes coverage validates the assigned Users API capabilities:

```text
Client lists users
Client creates users
```

All ReqRes tests require `REQRES_API_KEY`.

## Automated Coverage

| Spec                                                             | Endpoint                | Test case                                           | Main assertions                                                                                              |
| ---------------------------------------------------------------- | ----------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [get-users.spec.ts](../tests/reqres/specs/get-users.spec.ts)     | `GET /api/users`        | Validates response schema                           | Status `200`, JSON content type, Zod schema, non-empty data                                                  |
| [get-users.spec.ts](../tests/reqres/specs/get-users.spec.ts)     | `GET /api/users?page=2` | Validates page 2 users and pagination metadata      | Status `200`, Zod schema, total count, page size, expected last names                                        |
| [create-user.spec.ts](../tests/reqres/specs/create-user.spec.ts) | `POST /api/users`       | Validates created user responses from external data | Status `201`, JSON content type, response time limit, Zod schema, echoed request data, parseable `createdAt` |

Create-user payloads are stored in [tests/reqres/data/create-users.json](../tests/reqres/data/create-users.json). `API_RESPONSE_TIME_LIMIT_MS` defaults to `2000` ms.
