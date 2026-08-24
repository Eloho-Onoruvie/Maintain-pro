# MaintainPro Request Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines the lifecycle of every incoming request within MaintainPro.

Every request follows the same processing pipeline regardless of the business module being accessed.

The objective is to ensure requests are processed consistently, securely, and predictably across the platform.

---

# 2. Request Philosophy

A request should gradually gain trust.

When a request first reaches the server, nothing about it is trusted.

Each processing stage verifies one aspect of the request before allowing it to proceed.

Business logic executes only after the request has successfully passed every preceding stage.

---

# 3. Request Lifecycle

Every request follows this pipeline.

```text
Client Request

↓

Express Router

↓

Global Middleware

↓

Route Middleware

↓

Authentication

↓

Actor Resolution

↓

Validation

↓

Authorization

↓

Controller

↓

Application Service

↓

Repository

↓

Persistence

↓

ApplicationResult

↓

Response
```

Every request follows the same order.

---

# 4. Global Middleware

Global middleware executes for every request.

Examples include:

* Request ID generation
* CORS
* Helmet
* Compression
* Request logging
* JSON parsing
* Cookie parsing
* Rate limiting

Global middleware should never contain business logic.

---

# 5. Route Middleware

Route middleware executes only when required.

Examples include:

* Authentication
* Validation
* File upload
* Permission requirements

Route middleware should remain reusable.

---

# 6. Authentication Stage

Authentication verifies identity.

Successful authentication resolves an authenticated Actor.

Unauthenticated requests terminate immediately.

---

# 7. Actor Resolution

Authentication produces the Actor.

The Actor is attached to the request.

Example

```text
Request

Actor

↓

User ID

Actor Type

Organization ID

Vendor ID

Roles
```

Business modules use the Actor rather than authentication tokens.

---

# 8. Validation Stage

Validation occurs before controllers execute.

Validation verifies:

* body
* params
* query

Successful validation produces a typed object.

Example

```text
req.validated.body

req.validated.params

req.validated.query
```

Controllers should use validated input rather than raw request data.

---

# 9. Authorization Stage

Authorization validates:

* permissions
* ownership
* business policies

Authorization executes before controllers invoke business services.

---

# 10. Controller Stage

Controllers coordinate requests.

Responsibilities:

* receive validated request
* invoke Application Service
* return ApplicationResult

Controllers should never contain business logic.

---

# 11. Application Service Stage

Application Services perform business operations.

Services may:

* call repositories
* call policies
* publish events

Services should remain independent of Express.

---

# 12. Repository Stage

Repositories perform persistence.

Repositories interact only with the database.

Repositories never validate requests or authorize actors.

---

# 13. Response Stage

Application Services return ApplicationResult.

Controllers return ApplicationResult without modification.

Response formatting remains consistent across every endpoint.

---

# 14. Request Context

Every request carries context.

Typical request context includes:

* Request ID
* Actor
* Tenant
* Validated Input
* Timestamp

Future additions may include:

* Correlation ID
* Locale
* Feature Flags

---

# 15. Request Object

MaintainPro extends the standard Express Request.

Additional properties include:

```typescript
request.actor

request.validated

request.requestId
```

Custom request extensions should remain centralized.

---

# 16. Validation Ownership

Validation belongs to the request pipeline.

Business Services assume validated input.

Services should not repeat request validation.

Business validation remains the responsibility of the Application Layer.

---

# 17. Failure Handling

Requests terminate immediately when any stage fails.

Examples:

Authentication Failure

↓

401

Validation Failure

↓

400

Authorization Failure

↓

403

Business Exception

↓

Application Error

No further processing occurs after failure.

---

# 18. Logging

Every request should produce structured logs including:

* Request ID
* Route
* Method
* Duration
* Status Code
* Actor (when available)

Sensitive information must never be logged.

---

# 19. Architectural Rules

Every endpoint should follow the same processing pipeline.

Controllers should never bypass:

* validation
* authentication
* authorization

Business logic should never depend on Express.

---

# 20. Guiding Principle

> **Every request enters MaintainPro untrusted and becomes progressively trusted through authentication, validation, and authorization before business logic executes. Every endpoint follows the same request lifecycle to ensure consistency, security, and maintainability.**
