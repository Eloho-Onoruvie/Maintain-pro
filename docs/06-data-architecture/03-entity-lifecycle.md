# Entity Lifecycle

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/06-data-architecture/03-entity-lifecycle.md`

---

# 1. Purpose

This document defines the lifecycle that governs every business entity within the MaintainPro platform.

Rather than allowing each module to invent its own state transitions, MaintainPro standardizes how entities are created, modified, archived, restored, and retired.

A consistent lifecycle improves:

* predictability
* auditing
* authorization
* reporting
* data integrity

---

# 2. Philosophy

Every business entity has a beginning, an active life, and an end.

Lifecycle management should be:

* explicit
* auditable
* recoverable
* consistent

Entities should never disappear unexpectedly.

---

# 3. Universal Lifecycle

Most entities follow the same high-level lifecycle.

```text id="mkw1oq"
Created

↓

Active

↓

Updated

↓

Archived

↓

Restored

↓

Archived

↓

Deleted (Administrative Purge)
```

Not every entity supports every stage, but deviations should be intentional.

---

# 4. Lifecycle Definitions

## Created

The entity has been successfully persisted.

Characteristics:

* unique identifier assigned
* ownership established
* audit record created

---

## Active

The entity participates in normal business operations.

Examples:

* active assets
* active vendors
* active PM plans
* active inventory items

Most queries return only Active entities by default.

---

## Updated

The entity has changed.

Updates may include:

* name
* description
* assignment
* location
* metadata

Each update should create an audit trail.

---

## Archived

The entity is no longer operational but must remain historically available.

Examples:

* retired assets
* inactive vendors
* obsolete PM plans

Archived entities should not participate in normal business workflows.

---

## Restored

Previously archived entities may return to Active status.

Restoration should preserve:

* identifier
* history
* ownership
* relationships

---

## Deleted

Deletion is reserved for administrative or regulatory purposes.

Deletion should normally occur only after retention policies permit permanent removal.

---

# 5. Lifecycle Metadata

Every lifecycle-aware entity should maintain:

```text id="5lfw8v"
createdAt

updatedAt

archivedAt

deletedAt

createdBy

updatedBy

archivedBy

deletedBy
```

Not every field is populated simultaneously.

---

# 6. Business Identity

An entity's identifier never changes throughout its lifecycle.

Business references remain valid after archival.

Historical records should never lose referential integrity.

---

# 7. Ownership

Ownership remains constant.

Examples:

```text id="lcl4v7"
organizationId
```

Archiving or restoring an entity must not alter ownership.

---

# 8. Relationships

Lifecycle changes should preserve valid relationships.

Example:

```text id="pt0j7s"
Asset

↓

Archived

↓

Historical Work Orders

↓

Remain Intact
```

Historical records should continue referencing archived entities.

---

# 9. State Transitions

Valid transitions:

```text id="y2l6gn"
Created

↓

Active

↓

Archived

↓

Restored

↓

Active
```

Invalid transitions should be rejected.

Example:

```text id="ggc5wl"
Deleted

↓

Restored
```

Unless explicitly supported through administrative recovery procedures.

---

# 10. Module Examples

## Assets

Created

↓

Active

↓

Archived

↓

Restored

---

## Vendors

Created

↓

Active

↓

Suspended (business-specific)

↓

Archived

---

## Work Orders

Created

↓

Assigned

↓

In Progress

↓

Completed

↓

Closed

Work Orders define their own domain workflow while still respecting lifecycle principles.

---

# 11. Audit Integration

Every lifecycle transition generates an audit event.

Examples:

* Asset Archived
* Vendor Restored
* Inventory Deleted

Audit records remain immutable.

---

# 12. Authorization

Lifecycle operations require authorization.

Examples:

| Operation | Permission                |
| --------- | ------------------------- |
| Create    | Create Permission         |
| Archive   | Archive Permission        |
| Restore   | Restore Permission        |
| Delete    | Administrative Permission |

Authorization follows the Authorization Standard.

---

# 13. Reporting

Reports should distinguish between:

* Active
* Archived
* Deleted

Historical reporting should include archived entities when appropriate.

---

# 14. Search

Search behavior should default to Active entities.

Archived entities should be searchable only when explicitly requested.

Deleted entities should not appear in search results.

---

# 15. Event Publishing

Lifecycle changes publish domain events.

Examples:

```text id="jlwmkk"
AssetArchived

VendorRestored

InventoryCreated

OrganizationArchived
```

Other modules may react asynchronously.

---

# 16. Architectural Rules

* Every entity follows a defined lifecycle.
* Lifecycle transitions are explicit.
* History is preserved.
* Ownership never changes.
* Identifiers remain permanent.
* Lifecycle operations are auditable.
* Invalid transitions are rejected.

---

# 17. Anti-Patterns

Avoid:

* hard deletion during normal operations
* silent archival
* changing identifiers
* bypassing lifecycle validation
* deleting entities referenced by historical records
* lifecycle logic inside controllers

---

# 18. Future Enhancements

Entity lifecycle management should support:

* configurable workflows
* scheduled archival
* automatic retention expiration
* lifecycle analytics
* lifecycle notifications
* policy-driven state transitions

---

# 19. Guiding Principle

> **MaintainPro treats every business entity as a long-lived asset with a clearly defined lifecycle. Creation, activation, archival, restoration, and deletion are explicit, authorized, and auditable operations that preserve business history, maintain referential integrity, and provide consistent behavior across every module in the platform.**
