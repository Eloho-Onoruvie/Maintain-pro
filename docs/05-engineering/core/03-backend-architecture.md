# Backend Architecture

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/core/backend-architecture.md`

---

# 1. Purpose

This document defines the architectural structure of the MaintainPro backend.

The backend is designed as a modular, layered, event-driven system following Domain-Driven Design (DDD) and Clean Architecture principles.

The architecture prioritizes:

* maintainability
* scalability
* testability
* replaceable infrastructure
* clear business boundaries

---

# 2. Architectural Philosophy

Business logic is the center of the application.

Everything else exists to support it.

The backend should evolve without requiring changes to unrelated modules.

Modules communicate through contracts and domain events rather than direct implementation dependencies.

---

# 3. High-Level Architecture

```text id="p10d8u"
HTTP

↓

Controllers

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

MongoDB / External Services
```

Dependencies always point inward.

---

# 4. Layer Responsibilities

## Presentation Layer

Responsible for:

* HTTP
* Authentication
* Validation
* Request Mapping
* Response Mapping

Contains:

* Controllers
* Middleware
* Guards

Business logic is prohibited.

---

## Application Layer

Responsible for:

* Use Cases
* Workflow Coordination
* Transactions
* Orchestration

Contains:

* Services
* Commands
* Queries

This layer coordinates business operations.

---

## Domain Layer

Responsible for:

* Business Rules
* Domain Models
* Domain Events
* Policies

Contains no framework-specific code.

This is the heart of MaintainPro.

---

## Infrastructure Layer

Responsible for:

* Database
* Messaging
* Storage
* AI Providers
* Email
* Billing Providers
* Search Providers

Infrastructure implements interfaces defined by the domain.

---

# 5. Module Structure

Every business module follows the same structure.

Example

```text id="9g4yd4"
asset/

controller/

application/

domain/

infrastructure/

contracts/

events/

validation/

dto/
```

Consistency is mandatory.

---

# 6. Controller Layer

Controllers should:

* receive requests
* validate input
* invoke one application service
* return standardized responses

Controllers should never contain business logic.

---

# 7. Application Services

Application Services coordinate business operations.

Responsibilities include:

* invoking repositories
* coordinating workflows
* publishing events
* handling transactions

Application Services do not implement infrastructure.

---

# 8. Domain

The Domain Layer owns:

* business entities
* value objects
* policies
* business rules

Examples

* Asset
* Work Order
* Vendor
* Subscription

The domain should remain independent of Express, MongoDB, or third-party providers.

---

# 9. Repositories

Repositories abstract persistence.

Application Services depend on repository contracts rather than MongoDB implementations.

Replacing MongoDB should not affect business logic.

---

# 10. Domain Events

Business operations publish Domain Events.

Example

```text id="vlk17o"
WorkOrderCreated

↓

Notification

↓

Audit

↓

Reporting

↓

Workflow
```

Events reduce coupling between modules.

---

# 11. Validation

Validation occurs before entering the application layer.

Business Services should assume validated input.

Validation belongs to dedicated validators.

---

# 12. Authorization

Authorization occurs before business execution.

Application Services receive an already-authorized request context.

Permission checks should remain centralized.

---

# 13. Responses

Application Services return business results.

Controllers convert them into HTTP responses.

The domain never generates HTTP responses.

---

# 14. Error Handling

Errors are represented using domain-specific exceptions.

Examples

* NotFoundException
* ValidationException
* AuthorizationException
* BusinessException
* ConflictException

Infrastructure errors should be translated into domain exceptions where appropriate.

---

# 15. Dependency Injection

Dependencies should be resolved through the Dependency Injection container.

Modules should depend on abstractions rather than implementations.

Manual dependency construction is discouraged.

---

# 16. Background Processing

Long-running operations should execute asynchronously.

Examples

* Notifications
* Report Generation
* AI Processing
* Search Indexing
* Image Processing

Application Services publish work rather than blocking requests.

---

# 17. Cross-Cutting Concerns

Shared platform capabilities include:

* Logging
* Audit
* Metrics
* Events
* Caching
* Configuration

Business modules consume these capabilities through shared abstractions.

---

# 18. Testing Strategy

Every layer supports independent testing.

Controllers

→ HTTP Tests

Application Services

→ Unit Tests

Repositories

→ Integration Tests

Domain

→ Pure Business Tests

The architecture encourages isolated testing.

---

# 19. Architectural Rules

* Controllers never contain business logic.
* Business logic belongs to the Domain.
* Services orchestrate use cases.
* Infrastructure depends on the Domain.
* Dependencies always point inward.
* Modules communicate using contracts and Domain Events.
* Every module follows the same folder structure.

---

# 20. Guiding Principle

> **MaintainPro's backend is a layered, modular, event-driven architecture where business rules remain independent of infrastructure, modules communicate through contracts and events, and every component has a single, clearly defined responsibility.**
