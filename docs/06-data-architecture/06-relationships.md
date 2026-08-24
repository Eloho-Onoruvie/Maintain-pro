# Relationships

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/06-data-architecture/06-relationships.md`

---

# 1. Purpose

This document defines how business entities relate to one another within the MaintainPro platform.

Relationships establish the structural rules governing:

* ownership
* references
* composition
* dependency
* navigation

Relationship design directly impacts scalability, maintainability, query performance, and data integrity.

---

# 2. Philosophy

Relationships should model business reality rather than database convenience.

Every relationship must answer:

* Who owns whom?
* Who depends on whom?
* Can each entity exist independently?
* Should this relationship be embedded or referenced?

---

# 3. Relationship Categories

MaintainPro uses four primary relationship types.

```text id="5fgrx1"
Composition

Association

Aggregation

Reference
```

Each serves a different business purpose.

---

# 4. Composition

Composition represents ownership.

Child objects cannot exist independently.

Example

```text id="s7d1oc"
Asset

├── Warranty

├── Specifications

├── Dimensions

└── GPS Location
```

Deleting the parent removes the child.

Composition is implemented through embedded documents.

---

# 5. Aggregation

Aggregation represents a "has-a" relationship where both entities have independent lifecycles.

Example

```text id="x1t84m"
Organization

↓

Assets
```

Assets belong to an organization but remain independent entities.

Aggregation is implemented through references.

---

# 6. Association

Association represents interaction without ownership.

Example

```text id="m9pl2v"
Technician

↓

Work Order
```

The technician is assigned to the work order but owns neither entity.

---

# 7. Reference

References connect aggregate roots.

Example

```text id="7zv9rk"
WorkOrder

↓

assetId

↓

vendorId

↓

assignedUserId
```

References always point to another aggregate.

---

# 8. One-to-One Relationships

Examples include:

```text id="q8wb3a"
User

↓

User Preferences
```

or

```text id="y6dk4o"
Organization

↓

Subscription
```

These may be embedded or referenced depending on lifecycle requirements.

---

# 9. One-to-Many Relationships

The most common relationship.

Examples:

```text id="gn4l7p"
Organization

↓

Assets
```

```text id="3yfh9r"
Asset

↓

Work Orders
```

```text id="vp8e5x"
Vendor

↓

Service Requests
```

The "many" side stores the reference.

---

# 10. Many-to-Many Relationships

Many-to-many relationships should use linking collections.

Example

```text id="8lx0un"
Technician

↓

Assignments

↓

WorkOrder
```

Avoid storing large arrays of references inside both entities.

---

# 11. Parent Ownership

Ownership determines lifecycle.

Example

```text id="v9k3as"
Organization

↓

Asset

↓

Work Order
```

Deleting or archiving a parent should never silently invalidate historical child records.

---

# 12. Bidirectional Navigation

Relationships are conceptually bidirectional but physically stored in one direction whenever possible.

Example

Stored:

```text id="8b7fkp"
Asset

organizationId
```

Not stored:

```text id="9sx4ld"
Organization

assetIds[]
```

Queries derive reverse relationships when needed.

---

# 13. Historical Relationships

Historical records preserve references even after related entities become archived.

Example

```text id="h5yr2v"
Archived Vendor

↓

Historical Work Orders

↓

Remain Valid
```

Relationships should preserve business history.

---

# 14. Cascading Rules

MaintainPro avoids automatic cascading deletes.

Instead:

* archive parent
* preserve children
* prevent invalid references

Administrative purge operations may cascade only under controlled procedures.

---

# 15. Optional Relationships

Some references are optional.

Example

```text id="pr7w0x"
Vendor

↓

assignedTechnician

(optional)
```

Optional relationships should remain nullable or absent until established.

---

# 16. Circular Dependencies

Circular ownership is prohibited.

Incorrect:

```text id="2gv6rb"
Asset

↓

Vendor

↓

Asset
```

Relationships should form a directed ownership hierarchy.

---

# 17. Repository Responsibility

Repositories resolve references.

Controllers never manually navigate entity relationships.

Business services coordinate multiple repositories when necessary.

---

# 18. Relationship Integrity

Referenced entities should exist before references are persisted.

Validation should prevent:

* orphaned references
* invalid identifiers
* cross-tenant relationships

---

# 19. Tenant Boundaries

Relationships never cross organization boundaries unless explicitly allowed.

Example

```text id="uk5w91"
Organization A

↓

Asset

↓

Organization B

❌ Invalid
```

Repositories enforce tenant integrity.

---

# 20. Architectural Rules

* Composition uses embedding.
* Aggregate relationships use references.
* One-to-many stores the reference on the many side.
* Many-to-many uses linking collections.
* Reverse navigation is query-derived.
* Relationships preserve history.
* Tenant boundaries are enforced.
* Cascading deletes are avoided.

---

# 21. Anti-Patterns

Avoid:

* circular ownership
* duplicate relationship storage
* oversized reference arrays
* cross-tenant references
* cascading hard deletes
* embedding independent aggregates

---

# 22. Future Enhancements

Relationship management may evolve to support:

* graph traversal
* dependency visualization
* relationship versioning
* relationship analytics
* dynamic association policies

---

# 23. Guiding Principle

> **MaintainPro models relationships according to business ownership rather than database convenience. Aggregate roots remain independent, composition is embedded, associations are referenced, tenant boundaries are preserved, and historical relationships remain intact throughout the lifecycle of every business entity.**
