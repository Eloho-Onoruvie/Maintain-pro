# Soft Delete Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/06-data-architecture/10-soft-delete.md`

---

# 1. Purpose

This document defines the Soft Delete strategy used throughout the MaintainPro platform.

Soft deletion allows business entities to be removed from normal operations without permanently deleting their historical information.

This preserves:

* business history
* auditability
* referential integrity
* recovery capability

---

# 2. Philosophy

Business data should rarely disappear.

Most entities should become inactive rather than permanently deleted.

Hard deletion is reserved for:

* regulatory requirements
* administrative cleanup
* expired retention policies

---

# 3. Soft Delete Definition

A soft-deleted entity:

* remains in the database
* is excluded from normal queries
* preserves all relationships
* can be restored

The entity is considered inactive rather than destroyed.

---

# 4. Standard Fields

Every soft-deletable entity includes:

```text id="l9w2fe"
deletedAt

deletedBy
```

Optional fields:

```text id="k5t8pa"
deleteReason
```

If `deletedAt` is `null` or absent, the entity is considered active.

---

# 5. Delete Operation

Soft deletion updates metadata only.

Example:

```text id="u8c4mn"
deletedAt = Current UTC Time

deletedBy = Current User
```

The document itself remains unchanged.

---

# 6. Query Behavior

Normal repository queries automatically exclude deleted records.

Example:

```text id="a7x5qp"
WHERE deletedAt == null
```

Application developers should not manually implement this filter.

---

# 7. Administrative Queries

Administrative users may explicitly request deleted records.

Examples:

* recovery tools
* compliance reviews
* audit investigations

Deleted entities are never returned by default.

---

# 8. Restore Operation

Restoration clears deletion metadata.

Example:

```text id="r3y6dk"
deletedAt = null

deletedBy = null
```

Restored entities return to their previous operational state.

---

# 9. Historical Relationships

Soft deletion must never break relationships.

Example:

```text id="g2p9ts"
Archived Vendor

↓

Historical Work Orders

↓

Remain Valid
```

Historical business records continue referencing deleted entities.

---

# 10. Authorization

Soft deletion requires explicit permissions.

Typical permissions:

* Delete
* Restore
* View Deleted

Restoration permissions may differ from deletion permissions.

---

# 11. Business Restrictions

Certain entities should never support ordinary deletion.

Examples:

* completed work orders
* audit records
* financial records
* approval history

Business rules determine deletability.

---

# 12. Reporting

Reports may optionally include deleted entities.

Operational reports exclude them by default.

Historical reports may include them when appropriate.

---

# 13. Search

Search excludes deleted entities unless explicitly requested.

Search filters should support:

```text id="w0m8lh"
includeDeleted = true
```

Only authorized users may enable this option.

---

# 14. Events

Soft deletion publishes domain events.

Examples:

```text id="f7j2vn"
AssetDeleted

VendorDeleted

InventoryDeleted
```

Restoration publishes corresponding restore events.

---

# 15. Data Integrity

Soft deletion must preserve:

* identifiers
* tenant ownership
* references
* audit history

Deleted entities should remain internally consistent.

---

# 16. Hard Delete

Hard deletion is performed only after:

* retention policy expiration
* administrative approval
* regulatory authorization

Hard deletion permanently removes data.

---

# 17. Repository Responsibility

Repositories automatically enforce:

* deletion filtering
* restoration operations
* administrative inclusion

Business services remain independent of deletion implementation.

---

# 18. Architectural Rules

* Business entities use soft delete by default.
* Deleted entities remain recoverable.
* Queries automatically exclude deleted records.
* Relationships remain valid.
* Restoration preserves identity.
* Hard deletion is exceptional.
* Deletion operations are auditable.

---

# 19. Anti-Patterns

Avoid:

* hard deleting operational entities
* manual deletion filtering in services
* breaking historical references
* deleting audit records
* bypassing repository deletion logic
* reusing identifiers after deletion

---

# 20. Future Enhancements

The deletion strategy should support:

* scheduled deletion
* legal hold
* recycle bin
* bulk restoration
* retention-policy automation
* immutable archival before purge

---

# 21. Guiding Principle

> **MaintainPro treats deletion as a reversible business operation rather than immediate data destruction. Soft deletion preserves historical integrity, enables recovery, maintains relationships, and supports compliance while ensuring that normal business operations interact only with active entities.**
