# MaintainPro Event Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines how business events are produced, published, and consumed throughout MaintainPro.

Events enable communication between domains while preserving module independence.

MaintainPro uses Domain Events to coordinate workflows rather than tightly coupling services together.

---

# 2. Event Philosophy

Business actions produce business facts.

MaintainPro models these facts as Events.

Events describe **what happened**, not **what should happen**.

Example

Instead of:

```text
SendVendorNotification()
```

The system publishes:

```text
WorkOrderAssigned
```

Notifications, analytics, auditing, and reporting react independently.

---

# 3. Event Flow

Every event follows the same lifecycle.

```text id="d4yq8v"
Business Operation

↓

Application Service

↓

Domain Event

↓

Event Bus

↓

Event Handlers

↓

Side Effects
```

The originating service never executes downstream side effects directly.

---

# 4. Domain Events

Domain Events represent business facts.

Examples

```text id="d3q6h2"
OrganizationCreated

VendorRegistered

VendorVerified

FacilityCreated

AssetCreated

ServiceRequestSubmitted

WorkOrderCreated

WorkOrderAssigned

WorkOrderCompleted

SubscriptionActivated

SubscriptionRenewed

PaymentReceived
```

Events are immutable.

---

# 5. Event Naming

Events follow the format:

```text id="mpk7h5"
Entity + Past Tense
```

Examples

```text id="jq3v9d"
OrganizationCreated

VendorInvited

AssetRetired

InvoiceGenerated
```

Avoid imperative names.

Incorrect

```text id="h1w2r8"
CreateOrganization

SendNotification

UpdateDashboard
```

---

# 6. Event Payload

Every event should contain only the information required for downstream consumers.

Typical payload

```typescript id="m8yt1p"
{
    eventId,

    occurredAt,

    actorId,

    tenantId,

    entityId,

    entityType,

    payload
}
```

Events should not expose unnecessary internal state.

---

# 7. Event Bus

The Event Bus distributes events to interested handlers.

Initial implementation may use an in-process event bus.

Future implementations may use:

* RabbitMQ
* Kafka
* AWS EventBridge
* Google Pub/Sub
* Azure Service Bus

Business modules should remain independent of the transport mechanism.

---

# 8. Event Handlers

Handlers react to events.

Examples

WorkOrderCreated

↓

Notification Handler

↓

Audit Handler

↓

Analytics Handler

↓

Marketplace Handler

Each handler owns one responsibility.

---

# 9. Event Consumers

A single event may have many consumers.

Example

```text id="c0vw8s"
SubscriptionActivated

├── Billing
├── Notification
├── Audit
├── Analytics
└── Reporting
```

Consumers remain unaware of one another.

---

# 10. Event Ownership

Only the owning Aggregate publishes events about itself.

Example

Billing publishes:

```text id="1v8xpc"
SubscriptionRenewed
```

Marketplace does not publish Billing events.

---

# 11. Event Ordering

Consumers should not rely on processing order unless explicitly documented.

Events should remain independently consumable.

---

# 12. Idempotency

Handlers should be idempotent.

Processing the same event multiple times should not produce inconsistent business state.

---

# 13. Reliability

Events should eventually be delivered.

Temporary failures should support retry mechanisms.

Permanent failures should be logged for investigation.

---

# 14. Synchronous vs Asynchronous

Critical business operations execute synchronously.

Side effects execute asynchronously whenever practical.

Examples of asynchronous work:

* emails
* push notifications
* analytics
* search indexing
* audit logs
* recommendation engines

---

# 15. Event Versioning

Events should support future evolution.

Breaking payload changes require versioning.

Consumers should tolerate additional fields.

---

# 16. Event Logging

Published events should be traceable.

Typical metadata includes:

* Event ID
* Timestamp
* Producer
* Correlation ID
* Tenant
* Actor

This enables observability across distributed workflows.

---

# 17. Future Integrations

External systems should subscribe through Integration Events rather than Domain Events directly.

Examples

* Payment Providers
* ERP Systems
* Accounting Platforms
* CRM Systems

This protects internal domain models from external dependencies.

---

# 18. Architectural Rules

* Services publish events.
* Services do not call unrelated modules directly for side effects.
* Handlers own one responsibility.
* Events describe facts, not commands.
* Events are immutable.
* Event transport is infrastructure, not business logic.

---

# 19. Benefits

MaintainPro's Event Architecture provides:

* loose coupling
* scalability
* extensibility
* asynchronous processing
* easier testing
* clearer business workflows

New functionality can often be added by introducing a new event handler rather than modifying existing services.

---

# 20. Guiding Principle

> **Business operations publish facts. Other parts of the platform react to those facts independently. Events reduce coupling, improve scalability, and allow MaintainPro to evolve without turning application services into orchestration engines.**
