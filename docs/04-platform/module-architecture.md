# MaintainPro Module Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines the internal architecture of every MaintainPro module.

Every business module must follow the same structure, conventions, and responsibilities.

A developer familiar with one module should immediately understand every other module.

---

# 2. Module Philosophy

A module represents one business capability.

Examples include:

* Identity
* Organization
* Facility
* Asset
* Maintenance
* Marketplace
* Billing

A module owns:

* business rules
* persistence
* validation
* APIs
* contracts

No business capability should be split across multiple unrelated modules.

---

# 3. Standard Module Structure

```text
module/

├── controllers/
│
├── services/
│
├── repositories/
│
├── models/
│
├── dto/
│
├── schemas/
│
├── policies/
│
├── events/
│
├── types/
│
├── routes/
│
├── constants/
│
├── mapper/
│
├── index.ts
```

Future additions may include:

* jobs/
* handlers/
* queries/
* commands/

---

# 4. Controllers

Controllers expose HTTP endpoints.

Responsibilities:

* receive requests
* invoke services
* return responses

Controllers should never:

* implement business logic
* access repositories
* construct database queries
* make authorization decisions

Controllers orchestrate.

---

# 5. Services

Services implement business behavior.

Responsibilities:

* business rules
* workflows
* domain decisions
* module coordination

Services may:

* call repositories
* call public interfaces of other modules
* publish domain events

Services should never:

* know Express
* know HTTP
* build responses

---

# 6. Repositories

Repositories interact with persistence.

Responsibilities:

* database operations
* query construction
* persistence mapping

Repositories should never:

* validate requests
* authorize users
* contain business workflows

---

# 7. Models

Models describe persistence structures.

Responsibilities:

* persistence mapping
* indexes
* schema configuration

Models should not contain business rules.

---

# 8. DTO

DTOs define data crossing module boundaries.

Responsibilities:

* request objects
* response objects
* command inputs
* query outputs

DTOs isolate business logic from transport formats.

---

# 9. Validation Schemas

Schemas validate incoming data.

Responsibilities:

* request validation
* business input validation
* API contracts

Validation occurs before business logic executes.

---

# 10. Policies

Policies define authorization rules.

Examples:

* CanUpdateAsset
* CanDeleteFacility
* CanAssignWorkOrder

Policies answer:

> Is this actor allowed to perform this action?

---

# 11. Events

Events publish business changes.

Examples:

* OrganizationCreated
* VendorVerified
* WorkOrderCompleted
* SubscriptionRenewed

Events communicate facts.

They never execute business logic directly.

---

# 12. Types

Types define module-specific TypeScript contracts.

Examples:

* interfaces
* aliases
* shared module contracts

---

# 13. Routes

Routes map endpoints to controllers.

Routes should contain no business logic.

---

# 14. Constants

Constants define module-specific values.

Examples:

* statuses
* limits
* enums
* configuration defaults

---

# 15. Mapper

Mappers translate between representations.

Examples:

* Database Model → Domain DTO
* DTO → Persistence Model
* External Provider → Internal Model

Business logic should not exist inside mappers.

---

# 16. Module Communication

Modules communicate through:

* Application Services
* Public DTOs
* Domain Events

Modules must never import another module's repositories or internal models.

---

# 17. Dependency Flow

Within every module:

```text
Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Models
```

Only downward dependencies are permitted.

---

# 18. Shared Components

Reusable infrastructure belongs in `/shared`.

Examples:

* AppError
* ApplicationResult
* Validation Middleware
* Authentication Middleware
* Logger
* Utilities

Business-specific code never belongs in Shared.

---

# 19. Module Independence

Every module should be independently testable.

Removing one module should not break unrelated business domains.

Dependencies between modules should remain explicit and minimal.

---

# 20. Guiding Principle

> **Every MaintainPro module should look, behave, and evolve consistently. Structure is a product decision, not a developer preference.**
