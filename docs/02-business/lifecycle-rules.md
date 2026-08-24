# MaintainPro Lifecycle Rules

**Version:** 1.0
**Status:** Draft
**Document Type:** Business Rules Specification

---

# 1. Purpose

This document defines the lifecycle of every major entity within MaintainPro.

A lifecycle describes how an entity comes into existence, evolves over time, reaches completion, and is ultimately retired.

Lifecycle Rules ensure consistency across the platform by defining:

* creation
* activation
* modification
* suspension
* completion
* archival

Lifecycle Rules apply independently of specific business workflows.

---

# 2. Lifecycle Philosophy

MaintainPro follows five lifecycle principles.

---

## LR-001 — Every Entity Has a Beginning

Every entity must originate through a valid creation process.

Entities may never appear without an identifiable origin.

---

## LR-002 — Every Entity Evolves

Entities progress through well-defined lifecycle stages.

Each stage reflects a meaningful business condition.

---

## LR-003 — Historical Integrity

Lifecycle progression must preserve historical information.

Past states contribute to reporting, analytics, and auditing.

---

## LR-004 — Terminal States Are Final

Once an entity reaches a terminal state, it cannot resume an earlier lifecycle stage unless explicitly supported.

---

## LR-005 — Deletion Is Exceptional

Business entities should rarely be permanently deleted.

Archival is preferred over removal.

---

# 3. Organization Lifecycle

```text id="oorglife"
Created

↓

Pending Verification

↓

Active

↓

Suspended

↓

Archived
```

Rules

* Organizations begin in Created.
* Verification is required before activation.
* Archived organizations cannot return to Active without administrative restoration.

---

# 4. User Lifecycle

```text id="ouserlife"
Invited

↓

Pending Verification

↓

Active

↓

Suspended

↓

Archived
```

Rules

* Invitations expire.
* Suspended users retain historical ownership.
* Archived users remain referenced in audit records.

---

# 5. Facility Lifecycle

```text id="ofaclife"
Created

↓

Active

↓

Inactive

↓

Archived
```

Rules

* Facilities must belong to an Organization before activation.
* Archived Facilities cannot contain active operational work.

---

# 6. Asset Lifecycle

```text id="oassetlife"
Registered

↓

Active

↓

Under Maintenance

↓

Out of Service

↓

Retired

↓

Archived
```

Rules

* Every Asset begins as Registered.
* Maintenance history survives retirement.
* Archived Assets remain available for reporting.

---

# 7. Service Request Lifecycle

```text id="osrlife"
Draft

↓

Submitted

↓

Approved

↓

Converted

↓

Closed
```

Alternative terminal states

```text id="osralt"
Rejected

Cancelled
```

Rules

* Requests cannot bypass Submitted.
* Converted requests become historical records.

---

# 8. Work Order Lifecycle

```text id="owolife"
Draft

↓

Open

↓

Assigned

↓

In Progress

↓

Awaiting Review

↓

Completed
```

Alternative paths

```text id="owoalt"
On Hold

Cancelled
```

Rules

* Completed Work Orders remain immutable.
* Cancelled Work Orders preserve execution history.

---

# 9. Preventive Maintenance Lifecycle

```text id="opmlife"
Created

↓

Scheduled

↓

Generated

↓

Completed
```

Alternative

```text id="opmalt"
Skipped
```

Rules

* Generated schedules create Work Orders.
* Skipped schedules require documented justification.

---

# 10. Vendor Lifecycle

```text id="ovendlife"
Registered

↓

Pending Verification

↓

Verified

↓

Suspended

↓

Archived
```

Rules

* Verification is required before Marketplace participation.
* Archived Vendors retain historical contracts.

---

# 11. Vendor Application Lifecycle

```text id="oapplife"
Submitted

↓

Under Review

↓

Shortlisted

↓

Awarded
```

Alternative

```text id="oappalt"
Rejected
```

Rules

* Awarded Applications proceed to Contract creation.

---

# 12. Quotation Lifecycle

```text id="oquotelife"
Draft

↓

Submitted

↓

Under Review

↓

Accepted
```

Alternative

```text id="oquotealt"
Rejected

Withdrawn
```

Rules

* Accepted Quotations become part of contractual history.

---

# 13. Contract Lifecycle

```text id="ocontractlife"
Pending

↓

Active

↓

Completed
```

Alternative

```text id="ocontractalt"
Cancelled
```

Rules

* Completed Contracts become immutable.

---

# 14. Subscription Lifecycle

```text id="osubslife"
Trial

↓

Active

↓

Past Due

↓

Expired
```

Alternative

```text id="osubsalt"
Cancelled
```

Rules

* Expiration never deletes customer data.
* Reactivation restores entitled capabilities.

---

# 15. Notification Lifecycle

```text id="onotiflife"
Generated

↓

Delivered

↓

Read

↓

Archived
```

Rules

* Archived notifications remain searchable.

---

# 16. Audit Record Lifecycle

```text id="oauditlife"
Created
```

Rules

Audit Records are immutable.

They have no additional lifecycle stages.

---

# 17. Lifecycle Events

Typical lifecycle events include:

* Created
* Updated
* Activated
* Assigned
* Verified
* Suspended
* Completed
* Cancelled
* Archived

Every significant event should:

* update timestamps
* generate audit records
* publish domain events where appropriate
* notify affected users when applicable

---

# 18. Cross-Lifecycle Consistency

Lifecycle transitions should remain consistent across the platform.

For example:

* "Archived" always represents permanent operational retirement.
* "Active" always represents operational availability.
* "Suspended" always represents temporary restriction.

State names should never have different meanings in different modules.

---

# 19. Future Lifecycles

Future modules should define lifecycles consistent with this specification, including:

* Inventory
* Procurement
* Purchase Orders
* Spare Parts
* AI Jobs
* IoT Devices
* Digital Twins

Every new entity introduced into MaintainPro must define its lifecycle before implementation.

---

# 20. Guiding Principle

> **Every MaintainPro entity should have a predictable, auditable, and well-defined lifecycle from creation to archival, ensuring operational consistency throughout the platform.**
