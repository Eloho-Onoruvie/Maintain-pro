# Document Design

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/06-data-architecture/05-document-design.md`

---

# 1. Purpose

This document defines how business entities are modeled as MongoDB documents within the MaintainPro platform.

It establishes consistent document composition principles that optimize:

* readability
* maintainability
* scalability
* performance
* data integrity

These standards apply to every MongoDB collection.

---

# 2. Philosophy

Documents represent complete business concepts.

A document should model how the business thinks about an entity rather than how the database stores data.

Document design prioritizes:

* business consistency
* aggregate integrity
* predictable access patterns

---

# 3. Aggregate Design

Every collection represents one aggregate root.

Examples:

```text id="3e5lbn"
Organization

Asset

WorkOrder

Vendor

InventoryItem

PreventiveMaintenancePlan
```

Only aggregate roots receive repositories.

Child objects belong to their parent aggregate.

---

# 4. Aggregate Ownership

Each aggregate owns its internal data.

Example

```text id="6g7ktx"
Asset

├── Metadata

├── Specifications

├── Location

└── Warranty
```

These components should not exist independently.

---

# 5. Embedded Documents

Embed data when it satisfies all of the following:

* belongs only to one parent
* has no independent lifecycle
* is always loaded together
* is relatively small
* changes with the parent

Examples:

* Address
* GPS Coordinates
* Contact Information
* Dimensions
* Warranty Details

---

# 6. Referenced Documents

Reference another collection when:

* it has its own lifecycle
* multiple entities reuse it
* it grows independently
* it changes frequently
* it requires independent authorization

Examples:

```text id="7tx1ku"
Asset

↓

Vendor

↓

Organization

↓

User
```

---

# 7. Value Objects

Value objects describe characteristics rather than identities.

Examples:

```text id="v4o6mw"
Address

Money

Dimensions

Coordinates

OperatingHours
```

Value objects do not receive identifiers.

---

# 8. Entity References

References should store only identifiers.

Preferred:

```text id="zfq8mp"
vendorId

assignedTechnicianId

organizationId
```

Avoid duplicating unrelated business information.

---

# 9. Document Composition

Documents should group related information logically.

Example:

```text id="9d4qtm"
Asset

├── Identity

├── Classification

├── Location

├── Specifications

├── Status

├── Warranty

├── Metadata
```

Organization improves maintainability.

---

# 10. Nested Structures

Nesting should remain shallow.

Preferred depth:

```text id="7owdbe"
2–3 levels
```

Deep nesting increases:

* complexity
* update difficulty
* query complexity

---

# 11. Arrays

Arrays should represent bounded relationships.

Good examples:

* phone numbers
* certifications
* attachments
* maintenance schedules

Poor examples:

* unlimited activity history
* audit logs
* notifications
* millions of events

Large histories belong in dedicated collections.

---

# 12. Duplication

Controlled duplication is acceptable when it improves performance.

Examples:

Store:

```text id="b6k1ht"
vendorName
```

inside historical work orders so historical reports remain stable even if the vendor later changes their company name.

Duplicated data should never become the primary source of truth.

---

# 13. Immutable Data

Historical information should remain immutable.

Examples:

* completed work order snapshot
* approval information
* inspection results
* completed invoices

Immutable sections should not be rewritten.

---

# 14. Mutable Data

Operational information changes throughout an entity's lifecycle.

Examples:

* status
* assigned technician
* location
* priority

Mutable fields should remain isolated from historical records.

---

# 15. Metadata

Every aggregate includes operational metadata.

Examples:

```text id="1vfjlwm"
createdAt

updatedAt

createdBy

updatedBy

organizationId
```

Metadata remains consistent across collections.

---

# 16. Domain Boundaries

Each aggregate belongs to one business domain.

Examples:

Asset Domain

```text id="sq0t8m"
Asset

AssetType

AssetCategory
```

Vendor Domain

```text id="ldgx8s"
Vendor

VendorService

VendorReview
```

Domains communicate through references rather than shared documents.

---

# 17. Repository Mapping

Each aggregate maps to one repository.

```text id="mu9d0g"
AssetRepository

VendorRepository

WorkOrderRepository
```

Repositories manage complete aggregate persistence.

---

# 18. Architectural Rules

* Every document models one aggregate.
* Embedded objects have no independent lifecycle.
* References connect independent aggregates.
* Value objects remain identifier-free.
* Arrays remain bounded.
* Nesting remains shallow.
* Metadata is standardized.
* Aggregate ownership is respected.

---

# 19. Anti-Patterns

Avoid:

* deeply nested documents
* oversized aggregates
* duplicated business logic
* storing unrelated entities together
* embedding independently managed entities
* circular document references

---

# 20. Future Enhancements

Document modeling may evolve to support:

* aggregate snapshots
* document versioning
* event sourcing
* CQRS read models
* polymorphic documents where justified

---

# 21. Guiding Principle

> **MaintainPro models each business concept as a well-defined aggregate with clear ownership boundaries. Documents contain only the information necessary to represent their aggregate consistently, while independent entities communicate through references. This balance between embedding and referencing produces a scalable, maintainable, and business-focused document model.**
