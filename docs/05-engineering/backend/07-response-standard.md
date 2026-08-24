# Response Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/response-standard.md`

---

# 1. Purpose

This document defines the standardized API response format used throughout the MaintainPro backend.

Every HTTP response produced by the backend follows a consistent structure regardless of module.

A standardized response format improves:

* frontend development
* API predictability
* debugging
* SDK generation
* long-term API evolution

---

# 2. Philosophy

Responses communicate business outcomes.

They should be:

* predictable
* minimal
* consistent
* versionable

Clients should never need to inspect different response shapes for different endpoints.

---

# 3. Standard Success Response

Every successful response follows this structure.

```text
success

message

data

meta
```

Where:

* **success** indicates operation outcome.
* **message** provides a human-readable summary.
* **data** contains the requested resource.
* **meta** contains optional metadata.

---

# 4. Standard Error Response

Every failed response follows this structure.

```text
success

message

code

errors

meta
```

Where:

* **success** is false.
* **message** explains the failure.
* **code** is the stable application error code.
* **errors** contains field-level validation details when applicable.
* **meta** contains optional metadata.

---

# 5. Success Flag

Every response includes:

```text
success
```

Possible values

```text
true

false
```

Clients should not determine success from HTTP status codes alone.

---

# 6. Message

The message provides a concise business description.

Examples

```text
Asset created successfully.

Vendor approved successfully.

Subscription renewed successfully.
```

Messages should remain human-readable.

---

# 7. Data

The data property contains the primary response payload.

Examples

```text
Asset

Vendor

Organization

WorkOrder

Report
```

Data should always use Response DTOs.

---

# 8. Meta

Meta provides supplemental information.

Examples

```text
pagination

requestId

executionTime

warnings

version
```

Meta should never contain business entities.

---

# 9. Pagination Responses

Paginated endpoints return:

```text
data

meta

page

limit

total

totalPages

hasNext

hasPrevious
```

Pagination remains identical across every module.

---

# 10. Collection Responses

Collections always return arrays.

Example

```text
data

[]

meta
```

Empty collections should return an empty array rather than null.

---

# 11. Single Resource Responses

Single resources return one Response DTO.

Example

```text
data

AssetResponseDto
```

Never wrap individual resources inside unnecessary arrays.

---

# 12. Empty Responses

Operations with no resource payload should return:

```text
success

message

data: null
```

Examples

* Archive
* Delete
* Restore

---

# 13. Error Responses

Business failures should never expose internal details.

Example

Good

```text
Work Order has already been completed.
```

Avoid

```text
Mongo update failed.
```

---

# 14. Validation Errors

Validation failures include field-level details.

Each validation error contains:

```text
field

message

code
```

Validation errors should remain deterministic.

---

# 15. Error Codes

Every error response includes a stable application code.

Examples

```text
ASSET_NOT_FOUND

INVALID_EMAIL

WORK_ORDER_ALREADY_CLOSED

INSUFFICIENT_PERMISSION
```

Clients should rely on codes rather than messages for business logic.

---

# 16. Sensitive Information

Responses must never expose:

* passwords
* secrets
* JWT payloads
* internal database identifiers
* stack traces
* infrastructure details

Only approved business information should leave the application.

---

# 17. HTTP Status

HTTP status codes remain meaningful.

Examples

```text
200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

500 Internal Server Error
```

Response bodies remain standardized regardless of status.

---

# 18. Versioning

Future API versions should preserve response structure whenever possible.

Breaking changes should introduce new API versions rather than modifying existing response contracts.

---

# 19. Architectural Rules

* Every response follows one standard.
* Success responses always include `success`, `message`, and `data`.
* Error responses always include `success`, `message`, and `code`.
* Collections return arrays.
* Empty collections return empty arrays.
* Empty payloads return `data: null`.
* Internal implementation details never leave the backend.

---

# 20. Guiding Principle

> **MaintainPro exposes a single, predictable response contract across every API endpoint. Clients interact with consistent response structures regardless of business module, allowing simpler integrations, reusable SDKs, and long-term API stability.**
