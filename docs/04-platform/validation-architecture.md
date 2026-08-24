# MaintainPro Validation Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines how validation is performed throughout MaintainPro.

Validation ensures that incoming data satisfies the structural and business requirements of the platform before business logic executes.

MaintainPro separates transport validation from business validation.

---

# 2. Validation Philosophy

Validation exists to answer different questions at different layers.

Transport Validation asks:

> "Is this request structurally correct?"

Business Validation asks:

> "Does this operation make business sense?"

Both are required.

---

# 3. Validation Layers

MaintainPro performs validation in multiple stages.

```text
Client

↓

Request Validation

↓

DTO Validation

↓

Business Validation

↓

Persistence Validation
```

Each layer validates only its own responsibility.

---

# 4. Request Validation

Request validation occurs immediately after authentication.

Responsibilities include validating:

* request body
* URL parameters
* query parameters
* headers (when applicable)

Request validation should reject malformed requests before controllers execute.

---

# 5. Schema Validation

MaintainPro standardizes request validation using schema definitions.

Current implementation:

* Zod

Schemas should define:

* required fields
* optional fields
* data types
* string constraints
* enums
* arrays
* nested objects

Schemas should never perform business operations.

---

# 6. DTO Validation

Validated requests become strongly typed DTOs.

Example

```typescript
req.validated.body

req.validated.params

req.validated.query
```

Controllers should consume DTOs rather than raw request objects.

---

# 7. Business Validation

Business validation belongs inside the Application Layer.

Examples include:

* organization already exists
* subscription expired
* asset retired
* completed work order
* vendor suspended

Business validation should throw domain exceptions rather than validation errors.

---

# 8. Persistence Validation

The persistence layer may enforce database integrity.

Examples include:

* unique indexes
* required persistence fields
* foreign key constraints
* database schema validation

Persistence validation complements business validation.

It should never replace it.

---

# 9. Validation Middleware

Validation middleware performs transport validation.

Responsibilities:

* execute schemas
* populate `req.validated`
* reject invalid requests

Validation middleware should never:

* access repositories
* call services
* perform authorization
* execute business logic

---

# 10. Validation Exceptions

Transport validation failures produce Validation Exceptions.

Examples include:

* invalid email
* missing field
* malformed UUID
* invalid enum value

Validation failures should terminate request processing immediately.

---

# 11. Business Exceptions

Business validation failures should throw Business Exceptions.

Examples:

```text
Organization already exists

Vendor already verified

Subscription inactive

Work Order already completed
```

Business failures are not validation failures.

---

# 12. Validation Ownership

Validation responsibilities are clearly separated.

Schema

↓

Structure

Application Service

↓

Business Rules

Database

↓

Integrity

No layer should perform another layer's responsibility.

---

# 13. Shared Validation

Reusable validators belong in the Shared layer.

Examples include:

* email schema
* password schema
* phone schema
* object ID schema
* pagination schema

Business-specific validators remain inside their owning module.

---

# 14. Validation Composition

Large schemas should be composed from reusable parts.

Example

```text
Email Schema

+

Password Schema

+

Organization Schema

↓

Register Organization Schema
```

Favor composition over duplication.

---

# 15. Error Reporting

Validation failures should provide meaningful information.

Current response:

```json
{
  "success": false,
  "message": "Validation failed"
}
```

Future versions may include:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

The response format should remain consistent across every endpoint.

---

# 16. Validation Principles

Validation should be:

* deterministic
* side-effect free
* reusable
* composable
* predictable

Validation must never modify business state.

---

# 17. Testing

Validation tests should verify:

* accepted inputs
* rejected inputs
* boundary values
* optional fields
* nested structures
* reusable schema composition

Business validation should be tested independently from transport validation.

---

# 18. Future Validation

The architecture should support future capabilities including:

* localized validation messages
* custom validators
* asynchronous validation
* schema generation
* OpenAPI generation
* frontend schema sharing

These capabilities should not require changes to business modules.

---

# 19. Architectural Rules

* Controllers never validate manually.
* Services assume structurally valid input.
* Business rules never belong in schemas.
* Validation middleware never performs business logic.
* Shared validators remain generic.
* Module validators remain business-specific.

---

# 20. Guiding Principle

> **Validation progressively establishes trust in incoming data. Schemas verify structure, services verify business rules, and persistence enforces integrity. Each layer validates only what it owns.**
