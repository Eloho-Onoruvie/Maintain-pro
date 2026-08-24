# MaintainPro Error Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines how MaintainPro represents, propagates, and returns errors.

The objective is to provide a consistent error model across every business module while separating business failures from technical failures.

---

# 2. Error Philosophy

Errors represent exceptional situations.

MaintainPro distinguishes between:

* Business Exceptions
* Validation Exceptions
* Authorization Exceptions
* Infrastructure Failures
* Unexpected System Errors

Business logic should communicate failures through typed exceptions rather than error codes or boolean return values.

---

# 3. Error Categories

MaintainPro recognizes the following categories.

## Validation

Invalid client input.

Examples:

* invalid email
* missing field
* malformed request

---

## Authentication

Identity cannot be established.

Examples:

* invalid token
* expired token
* missing credentials

---

## Authorization

Identity is valid but access is denied.

Examples:

* insufficient permission
* tenant mismatch
* ownership violation

---

## Business

Business rules prevent the operation.

Examples:

* completed work order
* inactive subscription
* retired asset

---

## Conflict

The requested operation conflicts with current state.

Examples:

* duplicate email
* duplicate vendor
* existing organization

---

## Not Found

Requested resource does not exist.

Examples:

* organization not found
* work order not found
* vendor not found

---

## Infrastructure

External systems fail.

Examples:

* database unavailable
* payment provider unavailable
* email provider unavailable

---

## Internal

Unexpected failures.

These represent implementation defects rather than business failures.

---

# 4. Exception Hierarchy

Every exception derives from a common base.

```text id="1j7k0j"
Error

↓

AppError

├── ValidationException
├── AuthenticationException
├── AuthorizationException
├── BusinessException
├── ConflictException
├── NotFoundException
└── InfrastructureException
```

All business modules should use these exceptions.

---

# 5. AppError

`AppError` represents the platform's base exception.

Responsibilities:

* human-readable message
* HTTP status
* machine-readable error code
* optional metadata

Example

```typescript id="wq9krl"
class AppError extends Error {
    statusCode: number;

    code: string;

    details?: unknown;
}
```

Every custom exception extends `AppError`.

---

# 6. Validation Exceptions

Validation exceptions occur before business logic executes.

Examples:

* invalid request body
* invalid query
* invalid parameters

Validation exceptions should include validation details when appropriate.

---

# 7. Business Exceptions

Business exceptions represent legitimate business failures.

Examples:

* subscription expired
* asset retired
* work order completed

Business exceptions are expected outcomes.

They are not bugs.

---

# 8. Infrastructure Exceptions

Infrastructure exceptions represent failures outside the business domain.

Examples:

* MongoDB unavailable
* Redis unavailable
* SMTP unavailable
* Payment gateway unavailable

Infrastructure exceptions should never expose implementation details to clients.

---

# 9. Exception Throwing

Business logic should throw exceptions immediately when a rule cannot be satisfied.

Example

```typescript id="jlwmgw"
if (!vendor) {
    throw new NotFoundException("Vendor not found");
}
```

Avoid returning `null`, `false`, or magic values to represent exceptional situations.

---

# 10. Global Exception Handler

Every uncaught exception reaches a centralized exception handler.

Responsibilities:

* classify exception
* determine HTTP status
* produce standardized error response
* log unexpected failures

Business modules never build error responses directly.

---

# 11. Error Response Contract

All API failures return a consistent structure.

```json id="i2x65d"
{
  "success": false,
  "message": "Validation failed",
  "timestamp": "2026-07-29T12:00:00Z"
}
```

Future versions may include:

* code
* details
* requestId

The response contract should remain stable.

---

# 12. Error Codes

Every custom exception should expose a stable machine-readable code.

Examples

```text id="dr1h5g"
VALIDATION_ERROR

AUTHENTICATION_FAILED

ACCESS_DENIED

RESOURCE_NOT_FOUND

RESOURCE_CONFLICT

BUSINESS_RULE_FAILED

INFRASTRUCTURE_ERROR

INTERNAL_SERVER_ERROR
```

Codes are intended for client applications and integrations.

Messages are intended for humans.

---

# 13. Logging

Every exception should be logged appropriately.

Business Exceptions

* informational

Infrastructure Exceptions

* warning

Unexpected Exceptions

* error

Sensitive information must never be included in logs.

---

# 14. Stack Traces

Stack traces should never be returned to API consumers.

They remain available only in server logs and development environments.

---

# 15. Recoverable Errors

Expected business failures should not terminate application execution.

Only the current request should fail.

The application should continue processing subsequent requests normally.

---

# 16. Testing

Exception tests should verify:

* correct exception type
* correct status code
* correct error code
* correct message

Tests should focus on behavior rather than implementation.

---

# 17. Shared Ownership

All exception classes belong to the Shared layer.

Business modules consume exceptions but do not redefine them.

---

# 18. Architectural Rules

Controllers never catch business exceptions.

Services throw exceptions.

Repositories throw only persistence-related exceptions.

The global exception handler converts exceptions into HTTP responses.

---

# 19. Future Extensions

Future exception capabilities may include:

* localization
* structured validation errors
* retry hints
* correlation identifiers
* RFC 7807 compatibility

The architecture should support these without changing business modules.

---

# 20. Guiding Principle

> **Errors are part of the platform contract. Business failures should be explicit, typed, and predictable, while unexpected failures should remain isolated behind a consistent error response.**
