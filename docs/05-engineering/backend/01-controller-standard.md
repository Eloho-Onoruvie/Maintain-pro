# Controller Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/controller-standard.md`

---

# 1. Purpose

This document defines the implementation standard for Controllers in the MaintainPro backend.

Controllers represent the HTTP delivery layer of the application.

Their sole responsibility is translating HTTP requests into application use cases and translating application results into HTTP responses.

Controllers are not responsible for business logic.

---

# 2. Responsibilities

Controllers are responsible for:

* Receiving HTTP requests
* Extracting request data
* Invoking application services
* Returning standardized responses
* Mapping application exceptions to HTTP responses

Controllers should remain lightweight.

---

# 3. Prohibited Responsibilities

Controllers must never:

* implement business rules
* access the database directly
* contain workflow logic
* perform calculations
* publish domain events
* call third-party services directly

These responsibilities belong elsewhere.

---

# 4. Dependency Rule

Controllers depend only on:

* Application Services
* Request DTOs
* Response DTOs
* Validation
* Authentication Context

Controllers must not depend directly on repositories or infrastructure providers.

---

# 5. One Endpoint, One Use Case

Every controller action should invoke exactly one application use case.

Example

```text id="7nqg9u"
POST /work-orders

↓

CreateWorkOrderService
```

Avoid chaining multiple unrelated business operations inside a controller.

---

# 6. Request Processing Flow

```text id="m4j0wh"
HTTP Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Application Service

↓

HTTP Response
```

Controllers participate only after authentication, authorization, and validation.

---

# 7. Validation

Controllers should receive validated input.

Validation should occur through dedicated validation components before business execution.

Controllers should never manually validate fields.

---

# 8. Authentication

Authenticated user information should be provided through the request context.

Controllers should never verify credentials manually.

---

# 9. Authorization

Permission checks should occur before business execution.

Controllers may invoke authorization policies but should not implement permission logic themselves.

---

# 10. Response Standard

Controllers return standardized responses.

Example response structure:

```text id="5n08sy"
success

message

data

meta

errors
```

Controllers should never invent custom response formats.

---

# 11. Exception Handling

Controllers should not catch business exceptions unless translation is required.

Global exception middleware should handle:

* ValidationException
* AuthenticationException
* AuthorizationException
* BusinessException
* ConflictException
* NotFoundException

---

# 12. HTTP Status Codes

Controllers should return appropriate status codes.

Examples

* 200 OK
* 201 Created
* 204 No Content
* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 409 Conflict
* 422 Unprocessable Entity
* 500 Internal Server Error

Status codes should accurately reflect the outcome.

---

# 13. Logging

Controllers should not implement business logging.

Only request-level logging is appropriate.

Audit logging belongs to the Audit Platform.

---

# 14. Asynchronous Operations

Controllers should await application services.

Long-running operations should be delegated to background jobs through the application layer.

Controllers should never block waiting for asynchronous platform tasks.

---

# 15. Naming

Controller classes end with:

```text id="57wlmd"
Controller
```

Examples

* AssetController
* VendorController
* BillingController
* WorkOrderController

Methods begin with verbs.

Examples

* create()
* update()
* archive()
* approve()
* assign()

---

# 16. Testing

Controllers should be tested independently.

Tests verify:

* routing
* validation integration
* response mapping
* status codes
* dependency interaction

Business logic is tested in the application layer, not the controller.

---

# 17. Architectural Rules

* Controllers remain thin.
* One endpoint invokes one application use case.
* Business logic is prohibited.
* Controllers never access repositories directly.
* Responses follow the standard response format.
* Validation occurs before controller execution.
* Exceptions are handled globally.

---

# 18. Example Lifecycle

```text id="qk86tw"
Client

↓

POST /assets

↓

Authentication

↓

Authorization

↓

Validation

↓

AssetController

↓

CreateAssetService

↓

AssetRepository

↓

Response
```

The controller acts only as the HTTP adapter.

---

# 19. Benefits

Following this standard provides:

* predictable controllers
* easier testing
* reduced duplication
* cleaner business services
* consistent API behavior

---

# 20. Guiding Principle

> **Controllers translate HTTP communication into application use cases. They coordinate request handling without owning business logic, ensuring that every endpoint remains predictable, lightweight, and focused on delivery concerns.**
