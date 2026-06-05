# Test Design

This document describes the test design approach and links to detailed frontend and API test design documents.

The project uses a black-box testing approach: tests validate application behavior through the public UI and API without relying on internal implementation details or source code access. The focus is on functionality from the end-user and API consumer perspective.

## Design Hierarchy

```text
Application
  -> Business Flow or API Capability
    -> Functional Area
      -> Test Suite
        -> Test Scenario
          -> Test Case
            -> Test Steps
```

## Design Documents

- [Frontend test design](frontend-test-design.md)
- [API test design](api-test-design.md)

## Coverage Strategy

The frontend test design starts from the main SauceDemo business flow:

```text
User buys products
```

The API test design starts from the assigned ReqRes API capabilities:

```text
Client lists users
Client creates users
```

Only implemented automated test cases are listed in the detailed documents. Additional negative and edge cases can be added later as the suite grows.
