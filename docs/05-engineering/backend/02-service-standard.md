# Service Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/service-standard.md`

---

# 1. Purpose

This document defines the implementation standard for Application Services in the MaintainPro backend.

Application Services implement business use cases by coordinating domain logic, repositories, workflows, and platform capabilities.

Application Services represent the application's business orchestration layer.

---

# 2. Responsibilities

Application Services are responsible for:

* Executing business use cases
* Coordinating repositories
* Enforcing business workflows
* Publishing domain events
* Coordinating transactions
* Returning business results

Services orchestrate business operations.

---

# 3. Prohibited Responsibilities

Application Services must never:

* handle HTTP requests
* generate HTTP responses
* perform request validation
* authenticate users
* authorize users directly
* execute database queries directly
* construct infrastructure dependencies

---

# 4. Dependency Rule

Services depend only on abstractions.

Examples

* Repository Interfaces
* Domain Services
* Event Bus
* Audit Service
* Workflow Engine

Services never depend directly on MongoDB, Redis, SMTP, or third-party SDKs.

---

# 5. One Service, One Use Case

Each Application Service should represent a single business action.

Examples

```text id="jlwmm1"
CreateAssetService

ArchiveAssetService

AssignTechnicianService

ApproveVendorService
```

Avoid "god services" containing unrelated business operations.

---

# 6. Business Flow

Typical execution flow:

```text id="jlwmm2"
Receive DTO

↓

Load Required Data

↓

Execute Business Rules

↓

Persist Changes

↓

Publish Events

↓

Return Result
```

Business rules should execute before persistence.

---

# 7. Business Rules

Business rules belong in:

* Domain Entities
* Domain Policies
* Domain Services

Application Services coordinate those rules.

They should not duplicate domain logic.

---

# 8. Repository Usage

Services communicate with persistence exclusively through repositories.

Example

```text id="jlwmm3"
AssetService

↓

IAssetRepository

↓

MongoAssetRepository
```

Database implementation remains hidden.

---

# 9. Transactions

When multiple operations must succeed together, services coordinate transactions.

Transactions belong to the application layer rather than controllers.

---

# 10. Domain Events

Business actions publish Domain Events.

Example

```text id="jlwmm4"
WorkOrderCreated

↓

Notification Platform

↓

Audit Platform

↓

Reporting Platform

↓

Workflow Engine
```

Services publish events after successful business execution.

---

# 11. Workflow Coordination

Services may invoke the Workflow Engine.

Example

```text id="jlwmm5"
Approve Service Request

↓

Workflow Engine

↓

Assign Technician

↓

Notify Vendor
```

Workflow definitions remain external to services whenever possible.

---

# 12. Audit

Application Services invoke the Audit Platform when business actions require traceability.

Controllers never write audit records directly.

---

# 13. External Providers

Services communicate with external systems only through provider interfaces.

Examples

* Storage
* Email
* AI
* Billing
* Search

Providers remain replaceable.

---

# 14. Error Handling

Services throw domain-specific exceptions.

Examples

* BusinessException
* ConflictException
* ValidationException
* NotFoundException

Services never generate HTTP responses.

---

# 15. Return Values

Services return business results.

They should not return HTTP-specific objects.

Returned data should use DTOs where appropriate.

---

# 16. Constructor Injection

Dependencies are injected through constructors.

Dependencies should remain explicit.

Example

```text id="jlwmm6"
IAssetRepository

IEventBus

IAuditService

IWorkflowEngine
```

---

# 17. Naming

Service classes end with:

```text id="jlwmm7"
Service
```

Examples

* CreateAssetService
* CompleteWorkOrderService
* RenewSubscriptionService

Service names describe business actions.

---

# 18. Testing

Application Services receive the highest testing priority.

Tests verify:

* business rules
* orchestration
* event publishing
* transaction behavior
* repository interaction

Infrastructure should be mocked.

---

# 19. Architectural Rules

* Services orchestrate business use cases.
* Services depend on abstractions.
* Services never access databases directly.
* Services publish Domain Events.
* Services coordinate workflows.
* Services remain HTTP-independent.
* Services return business results.

---

# 20. Guiding Principle

> **Application Services coordinate business use cases by orchestrating domain rules, repositories, workflows, and platform capabilities while remaining independent of HTTP, infrastructure implementations, and delivery mechanisms.**
