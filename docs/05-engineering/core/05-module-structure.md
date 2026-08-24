# Module Structure

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/core/module-structure.md`

---

# 1. Purpose

This document defines the standard internal structure for every MaintainPro module.

All business modules follow the same architecture regardless of complexity.

Consistency reduces onboarding time, improves maintainability, and allows engineers to move between modules without learning new patterns.

---

# 2. Module Philosophy

Every module represents a single business capability.

Examples include:

* Organizations
* Assets
* Facilities
* Vendors
* Marketplace
* Billing
* Work Orders
* Notifications

Modules should be self-contained.

---

# 3. Module Responsibilities

A module owns:

* Business Rules
* HTTP Endpoints
* Validation
* Events
* Persistence
* Permissions
* Use Cases

A module should never own unrelated business capabilities.

---

# 4. Standard Module Layout

Every module follows the same structure.

```text id="hmd8c2"
module/

controller/

application/

domain/

infrastructure/

repository/

validation/

dto/

events/

contracts/

index.ts
```

This structure is mandatory for all business modules.

---

# 5. Controller

Responsibilities

* Receive HTTP requests
* Invoke one application service
* Return standardized responses

Controllers never implement business rules.

---

# 6. Application

The Application layer coordinates use cases.

Examples

* Create Asset
* Update Asset
* Archive Asset

Responsibilities

* orchestration
* transactions
* workflow coordination
* event publishing

Business rules remain inside the domain.

---

# 7. Domain

The Domain layer contains:

* Entities
* Value Objects
* Business Policies
* Business Rules

The Domain has no dependency on Express, MongoDB, or external services.

---

# 8. Infrastructure

Infrastructure implements technical concerns.

Examples

* MongoDB
* Object Storage
* Email
* AI
* Billing Providers

Infrastructure depends on contracts defined by the domain.

---

# 9. Repository

Repositories abstract persistence.

Application Services communicate with repositories rather than database implementations.

Repositories should expose business-oriented methods rather than database operations.

---

# 10. Validation

Validation is isolated.

Contains:

* request schemas
* input validation
* business input constraints

Business services should assume validated input.

---

# 11. DTO

DTOs define communication boundaries.

Examples

* CreateAssetRequest
* UpdateVendorResponse
* BillingSummary

DTOs isolate business models from transport models.

---

# 12. Events

Every module owns its Domain Events.

Examples

```text id="xfn0gw"
AssetCreated

AssetArchived

VendorVerified

WorkOrderCompleted
```

Events allow other modules to react without coupling.

---

# 13. Contracts

Contracts define public interfaces.

Examples

* Repository Interfaces
* Service Interfaces
* External Provider Contracts

Contracts enable replaceable implementations.

---

# 14. Public API

Every module exports a controlled public interface.

Example

```text id="kw7lq8"
index.ts
```

Internal implementation details remain private.

---

# 15. Dependency Direction

Dependencies always flow inward.

```text id="g98a3z"
Controller

↓

Application

↓

Domain

↓

Contracts

↓

Infrastructure
```

Circular dependencies are prohibited.

---

# 16. Module Independence

Modules should remain loosely coupled.

Communication occurs through:

* contracts
* domain events
* workflow engine

Modules should avoid direct service-to-service dependencies.

---

# 17. Testing

Each layer supports isolated testing.

Controller

→ HTTP Tests

Application

→ Unit Tests

Domain

→ Pure Business Tests

Repository

→ Integration Tests

Every module should be independently testable.

---

# 18. Scalability

As modules grow, additional directories may be introduced.

Examples

```text id="jk7v1y"
queries/

commands/

policies/

factories/

specifications/
```

Growth should occur without changing the overall module structure.

---

# 19. Architectural Rules

* Every business capability is a module.
* Every module follows the same structure.
* Controllers never contain business logic.
* Domains remain infrastructure-independent.
* Modules communicate through events and contracts.
* Public APIs are explicitly exported.
* Internal implementation remains private.

---

# 20. Guiding Principle

> **MaintainPro modules are self-contained business capabilities with a consistent internal architecture. Every module follows the same layered structure, enabling predictable development, independent evolution, and long-term maintainability across the platform.**

