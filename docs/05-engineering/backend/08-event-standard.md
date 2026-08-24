# Event Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/event-standard.md`

---

# 1. Purpose

This document defines the event-driven architecture standard used throughout the MaintainPro backend.

Domain Events enable modules to communicate without creating direct dependencies.

Events improve:

* loose coupling
* scalability
* extensibility
* maintainability
* asynchronous processing

Events are first-class architectural components.

---

# 2. Philosophy

Business modules should communicate through events rather than direct service calls whenever immediate consistency is not required.

The module that performs an action should not know who reacts to it.

Instead, it publishes an event.

---

# 3. Event Flow

```text
Business Action

↓

Application Service

↓

Domain Event

↓

Event Bus

↓

Subscribers

↓

Platform Services
```

The publisher never depends on subscribers.

---

# 4. Event Categories

MaintainPro recognizes three event categories.

## Domain Events

Represent completed business actions.

Examples

* WorkOrderCreated
* VendorApproved
* AssetArchived
* SubscriptionRenewed

---

## Integration Events

Communicate with external systems.

Examples

* InvoiceGenerated
* PaymentSucceeded
* SMSRequested
* EmailRequested

---

## System Events

Represent internal platform activities.

Examples

* CacheInvalidated
* SearchIndexUpdated
* AIProcessingStarted

---

# 5. Event Naming

Events use:

* PascalCase
* Past tense

Examples

```text
WorkOrderCreated

VendorApproved

AssetAssigned

PreventiveMaintenanceGenerated

SubscriptionExpired
```

Events describe something that has already happened.

---

# 6. Event Ownership

Every event belongs to exactly one module.

Example

```text
Asset Module

↓

AssetArchived
```

Only the owning module may publish its domain events.

---

# 7. Event Publishing

Application Services publish Domain Events after successful completion of business operations.

Never publish events before persistence succeeds.

Correct sequence

```text
Business Rules

↓

Persist

↓

Commit

↓

Publish Event
```

---

# 8. Event Bus

All events pass through a centralized Event Bus.

Responsibilities

* publish
* subscribe
* dispatch
* retry
* logging

Business modules never communicate directly with subscribers.

---

# 9. Event Payload

Event payloads should contain only information required by subscribers.

Example

Good

```text
workOrderId

organizationId

createdBy

createdAt
```

Avoid sending entire domain objects.

---

# 10. Event Immutability

Events are immutable.

Once published, event payloads must never change.

---

# 11. Subscribers

Subscribers react to events.

Examples

```text
WorkOrderCreated

↓

Notification Module

↓

Audit Module

↓

Reporting Module

↓

Workflow Engine
```

Subscribers remain independent.

---

# 12. Multiple Subscribers

One event may have many subscribers.

Example

```text
SubscriptionRenewed

↓

Billing

↓

Audit

↓

Reporting

↓

Notification

↓

Analytics
```

Publishers remain unaware of subscriber count.

---

# 13. Event Ordering

Ordering should only be guaranteed when explicitly required.

Independent subscribers should never rely on execution order.

---

# 14. Event Reliability

Events should support:

* retries
* dead-letter queues
* idempotent handlers

Subscribers should safely handle duplicate delivery.

---

# 15. Event Versioning

Breaking payload changes require new event versions.

Example

```text
VendorApprovedV2
```

Avoid modifying existing event contracts.

---

# 16. Event Logging

Every published event should be logged.

Metadata includes

* event name
* timestamp
* publisher
* correlation ID
* organization ID
* event version

Logging improves traceability.

---

# 17. Event Boundaries

Events communicate facts.

They do not request work.

Avoid

```text
SendEmail
```

Prefer

```text
VendorApproved
```

The Notification module decides whether an email should be sent.

---

# 18. Testing

Event tests verify:

* publication
* payload correctness
* subscriber execution
* retry behavior
* idempotency

Subscribers should be testable independently.

---

# 19. Architectural Rules

* Events describe completed business actions.
* Events are immutable.
* Publishers never know subscribers.
* Event payloads remain minimal.
* Subscribers are independent.
* Domain Events belong to one owning module.
* Event handlers should be idempotent.

---

# 20. Guiding Principle

> **MaintainPro uses Domain Events to communicate completed business actions across the platform. Events enable independent modules to collaborate without direct dependencies, creating a scalable, extensible, and loosely coupled architecture where new capabilities can be added without modifying existing business logic.**
