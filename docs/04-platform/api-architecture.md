# MaintainPro API Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines the architectural standards governing all HTTP APIs exposed by MaintainPro.

The objective is to ensure that every endpoint is:

* predictable
* discoverable
* versionable
* secure
* consistent

API architecture defines communication between clients and the platform.

It does not define business logic.

---

# 2. API Philosophy

MaintainPro exposes a Resource-Oriented REST API.

Resources represent business entities.

Examples:

* Organizations
* Facilities
* Assets
* Vendors
* Work Orders
* Service Requests
* Subscriptions

Endpoints manipulate resources rather than actions.

---

# 3. API Versioning

All APIs are versioned.

Current version

```text
/api/v1/
```

Future versions

```text
/api/v2/

/api/v3/
```

Breaking changes require a new API version.

---

# 4. URL Structure

URLs follow a consistent structure.

```text
/api/v1/{module}/{resource}
```

Examples

```text
/api/v1/auth/login

/api/v1/organizations

/api/v1/assets

/api/v1/work-orders

/api/v1/vendors

/api/v1/subscriptions
```

---

# 5. Resource Naming

Resources should use plural nouns.

Examples

```text
organizations

facilities

assets

vendors

work-orders

service-requests
```

Avoid verbs in URLs.

Incorrect

```text
/createVendor

/getAssets

/deleteFacility
```

---

# 6. HTTP Methods

MaintainPro follows standard HTTP semantics.

GET

Retrieve resources

POST

Create resources

PUT

Replace resources

PATCH

Partially update resources

DELETE

Remove resources

---

# 7. Status Codes

HTTP status codes communicate transport outcomes.

Examples

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity (optional)

500 Internal Server Error

---

# 8. Request Format

Requests follow the standard Request Architecture.

Validated inputs become:

```typescript
req.validated.body

req.validated.params

req.validated.query
```

Business logic should never consume raw request values.

---

# 9. Response Format

Every successful endpoint returns ApplicationResult.

Every failed endpoint returns the standardized Error Response.

No endpoint should invent its own response structure.

---

# 10. Pagination

Collection endpoints should support pagination.

Example

```text
?page=1

?limit=20
```

Future support

```text
cursor pagination
```

Metadata should include pagination information.

---

# 11. Filtering

Filtering should use query parameters.

Example

```text
?status=active

?plan=professional

?facility=123
```

Filters should remain composable.

---

# 12. Sorting

Sorting uses query parameters.

Example

```text
?sort=createdAt

?order=desc
```

---

# 13. Searching

Searching should remain resource-specific.

Example

```text
?q=generator
```

Search should not replace filtering.

---

# 14. Bulk Operations

Bulk operations should remain explicit.

Examples

```text
POST

/assets/bulk-import

/work-orders/bulk-update
```

Bulk operations remain resources rather than hidden behaviors.

---

# 15. Idempotency

GET

Safe

PUT

Idempotent

DELETE

Idempotent

POST

Non-idempotent unless explicitly designed.

---

# 16. Authentication

Protected APIs require authenticated actors.

Authentication occurs before controllers execute.

Public endpoints should remain explicitly documented.

---

# 17. Authorization

Authorization occurs after authentication.

API endpoints should never bypass the Authorization Architecture.

---

# 18. API Documentation

Every endpoint should document:

* purpose
* request
* response
* permissions
* status codes
* examples

Future API documentation should be generated automatically through OpenAPI.

---

# 19. Evolution

New endpoints should extend existing resources whenever practical.

Avoid duplicate resources.

Avoid inconsistent naming.

Maintain backwards compatibility within the same API version.

---

# 20. Guiding Principle

> **MaintainPro exposes a resource-oriented, versioned REST API where every endpoint follows the same request, authorization, validation, and response standards.**
