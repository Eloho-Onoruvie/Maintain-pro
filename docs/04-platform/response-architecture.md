# MaintainPro Response Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines the standard response contract for every successful API response produced by MaintainPro.

A consistent response structure improves:

* client development
* API discoverability
* documentation
* testing
* debugging
* maintainability

Every successful endpoint should return the same response format regardless of business module.

---

# 2. Response Philosophy

MaintainPro APIs should be predictable.

A frontend developer should never need to guess the structure of a successful response.

Every endpoint returns exactly one standard response envelope.

---

# 3. Standard Response Contract

All successful responses follow the same structure.

```typescript
interface ApplicationResult<T> {
  success: true;

  message: string;

  data: T;

  metadata?: ResponseMetadata;
}
```

This contract is shared across every module.

---

# 4. Required Fields

## success

Always:

```text
true
```

Successful requests always return `true`.

---

## message

A short human-readable description.

Examples:

* Organization created successfully
* Vendor retrieved successfully
* Work Order completed successfully

Messages should remain stable and user-friendly.

---

## data

Contains the requested business resource.

Examples:

* Organization
* Vendor
* Asset
* Work Order
* Subscription

Collections should also be returned inside `data`.

Example

```typescript
data: {
  items: [...]
}
```

---

# 5. Optional Metadata

Metadata contains information about the response rather than the business resource.

Examples include:

```typescript
interface ResponseMetadata {
  page?: number;

  limit?: number;

  total?: number;

  totalPages?: number;

  hasNext?: boolean;

  hasPrevious?: boolean;

  requestId?: string;

  executionTime?: number;
}
```

Metadata should never contain business data.

---

# 6. Example Responses

## Create Organization

```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "...": "..."
  }
}
```

---

## Retrieve Vendor

```json
{
  "success": true,
  "message": "Vendor retrieved successfully",
  "data": {
    "...": "..."
  }
}
```

---

## Paginated Assets

```json
{
  "success": true,
  "message": "Assets retrieved successfully",
  "data": {
    "items": [
      {}
    ]
  },
  "metadata": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "totalPages": 13,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

# 7. Collections

Collections should always be returned consistently.

Preferred structure

```typescript
data: {
    items: [...]
}
```

Avoid returning raw arrays at the top level.

---

# 8. Empty Results

An empty collection is still a successful response.

Example

```json
{
  "success": true,
  "message": "No vendors found",
  "data": {
    "items": []
  }
}
```

Do not return errors simply because a collection is empty.

---

# 9. Business Exceptions

Business failures are **not** returned through `ApplicationResult`.

Business failures are represented by Exceptions.

Examples include:

* ValidationException
* NotFoundException
* ConflictException
* AuthorizationException

The global exception handler converts these into standardized error responses.

---

# 10. HTTP Status Codes

Successful responses should use appropriate HTTP status codes.

Examples:

| Operation  | Status                           |
| ---------- | -------------------------------- |
| Retrieve   | 200 OK                           |
| Create     | 201 Created                      |
| Update     | 200 OK                           |
| Delete     | 200 OK                           |
| No Content | 204 No Content (when applicable) |

HTTP status codes remain independent of the response body.

---

# 11. Controllers

Controllers should not manually construct response payloads.

Controllers simply return the `ApplicationResult` received from the Application Service.

Example

```ts
const result = await authService.login(credentials);

return response.ok(res, result);
```

or

```ts
const result = await organizationService.create(dto);

return response.created(res, result);
```

Controllers should never reshape successful responses.

---

# 12. Services

Application Services own response construction.

Every public service method should return an `ApplicationResult<T>` unless the operation intentionally returns no content.

Example

```typescript
return {
  success: true,
  message: "Vendor profile updated successfully",
  data: vendor
};
```

---

# 13. Repository Responsibilities

Repositories never return `ApplicationResult`.

Repositories return only persistence models or primitive values.

Response formatting belongs to the Application Layer.

---

# 14. Future Extensions

Future metadata may include:

* cursor pagination
* execution timing
* cache information
* request identifiers
* API version

These additions should extend the response contract without breaking existing clients.

---

# 15. Versioning

The response contract should remain backward compatible.

Breaking changes require API versioning.

---

# 16. Consistency Rules

Every successful endpoint should:

* return `success`
* return `message`
* return `data`
* optionally return `metadata`

No additional top-level fields should be introduced without updating this specification.

---

# 17. Testing

Response tests should verify:

* response shape
* HTTP status
* message
* data type
* metadata (when applicable)

Tests should not rely on field ordering.

---

# 18. Shared Ownership

The `ApplicationResult<T>` contract belongs to the Shared layer.

Business modules consume the contract but do not redefine it.

---

# 19. Architectural Rules

Application Services create responses.

Controllers forward responses.

Repositories never create responses.

Every successful endpoint follows the same response contract.

---

# 20. Guiding Principle

> **Every successful MaintainPro API response should return a single, predictable response envelope. Business modules define the data, while the platform defines the response structure.**
