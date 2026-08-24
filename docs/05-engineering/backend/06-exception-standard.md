# Exception Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/exception-standard.md`

---

# 1. Purpose

This document defines the exception handling strategy used throughout the MaintainPro backend.

Exceptions provide a consistent mechanism for communicating failures between architectural layers while keeping business logic clean and predictable.

The exception system ensures every failure has:

* a clear meaning
* a consistent structure
* an appropriate HTTP mapping
* predictable behavior

---

# 2. Philosophy

Exceptions represent exceptional business conditions.

They are **not**:

* validation results
* control flow
* logging mechanisms
* return values

Exceptions should communicate **why** an operation failed.

---

# 3. Exception Flow

```text
Application

↓

Throws Exception

↓

Global Exception Handler

↓

Standard Error Response

↓

HTTP Client
```

Controllers should never manually build error responses.

---

# 4. Architectural Layers

Exceptions may originate from:

* Validation Layer
* Application Layer
* Domain Layer
* Infrastructure Layer

Every exception is normalized before leaving the application.

---

# 5. Exception Hierarchy

All exceptions inherit from a common base.

```text
AppError

├── ValidationException

├── AuthenticationException

├── AuthorizationException

├── BusinessException

├── ConflictException

├── NotFoundException

└── InfrastructureException
```

Every exception belongs to a well-defined category.

---

# 6. ValidationException

Thrown when request data fails validation.

Examples

* Invalid email
* Missing required field
* Invalid date
* Invalid enum value

HTTP Mapping

```text
422 Unprocessable Entity
```

---

# 7. AuthenticationException

Thrown when authentication fails.

Examples

* Missing token
* Invalid token
* Expired token

HTTP Mapping

```text
401 Unauthorized
```

---

# 8. AuthorizationException

Thrown when an authenticated user lacks permission.

Examples

* Missing permission
* Incorrect role
* Organization mismatch

HTTP Mapping

```text
403 Forbidden
```

---

# 9. NotFoundException

Thrown when a required resource cannot be found.

Examples

* Asset not found
* Vendor not found
* Work Order not found

HTTP Mapping

```text
404 Not Found
```

---

# 10. ConflictException

Thrown when the requested operation conflicts with existing state.

Examples

* Duplicate email
* Asset code already exists
* Subscription already active

HTTP Mapping

```text
409 Conflict
```

---

# 11. BusinessException

Thrown when business rules prevent an operation.

Examples

* Archived asset cannot be edited
* Closed Work Order cannot be reassigned
* Vendor cannot approve itself

HTTP Mapping

Typically

```text
400 Bad Request
```

or another appropriate business status.

---

# 12. InfrastructureException

Represents infrastructure failures.

Examples

* Database unavailable
* Storage unavailable
* Queue unavailable
* AI provider unavailable

Infrastructure details should never be exposed to clients.

---

# 13. Exception Messages

Exception messages should be:

* human-readable
* business-oriented
* actionable
* free of implementation details

Good

```text
Asset already exists.
```

Avoid

```text
Mongo duplicate key error.
```

---

# 14. Error Codes

Every exception should expose a stable application error code.

Example

```text
ASSET_ALREADY_EXISTS

INVALID_SUBSCRIPTION

WORK_ORDER_CLOSED

INSUFFICIENT_PERMISSION
```

Clients should rely on codes rather than messages.

---

# 15. Sensitive Information

Exceptions must never expose:

* stack traces
* database queries
* provider responses
* internal identifiers
* secrets
* environment information

Internal diagnostics remain server-side.

---

# 16. Exception Translation

Infrastructure errors should be translated into business exceptions whenever possible.

Example

```text
Mongo Duplicate Key

↓

ConflictException
```

Application Services should never expose infrastructure-specific failures.

---

# 17. Logging

Every unhandled exception should be logged.

Logging should include:

* timestamp
* request identifier
* user identifier (when available)
* module
* exception type
* stack trace

Logging is independent from the client response.

---

# 18. Global Exception Handler

MaintainPro uses one centralized exception handler.

Responsibilities include:

* exception mapping
* response formatting
* logging
* masking sensitive details

Controllers should not catch business exceptions unless recovery is possible.

---

# 19. Architectural Rules

* Exceptions inherit from AppError.
* Exceptions communicate business intent.
* Infrastructure errors are translated.
* Sensitive information never reaches clients.
* Responses remain standardized.
* Global handlers own exception formatting.
* Error codes remain stable across versions.

---

# 20. Guiding Principle

> **MaintainPro uses a structured exception hierarchy to communicate failures consistently across the platform. Every exception represents a meaningful business or infrastructure condition, is translated into a standardized client response, and protects internal implementation details while providing predictable behavior for consumers.**
