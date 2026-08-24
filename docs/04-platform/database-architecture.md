# MaintainPro Database Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines how MaintainPro persists business data.

It describes how the platform implements the Data Architecture using MongoDB and Mongoose while preserving domain ownership, aggregate boundaries, and long-term scalability.

---

# 2. Database Philosophy

The database exists to persist business state.

It does **not** define business rules.

Business rules belong to the Application Layer.

MongoDB implements the business model—it does not become the business model.

---

# 3. Database Technology

Current implementation:

* MongoDB
* Mongoose ODM

Future infrastructure should allow replacing the persistence implementation without changing business logic.

---

# 4. Collection Strategy

Each Aggregate Root owns one primary collection.

Examples

```text id="s5ggd3"
organizations

users

vendors

facilities

assets

serviceRequests

workOrders

preventiveMaintenancePlans

subscriptions

payments

notifications

auditLogs
```

Collections represent business aggregates rather than UI features.

---

# 5. Aggregate Mapping

One Aggregate Root corresponds to one collection.

Example

```text id="3w5gqg"
Organization

↓

organizations collection
```

Repositories interact with Aggregate Roots rather than unrelated documents.

---

# 6. Referencing vs Embedding

MaintainPro primarily favors **document references**.

Reference when:

* ownership differs
* independent lifecycle exists
* large collections exist
* independent updates occur

Embed when:

* child object cannot exist independently
* child is always loaded with parent
* child shares lifecycle

Example

Organization

↓

Facilities (reference)

Facility

↓

Location Settings (embedded)

---

# 7. Object Relationships

Typical relationships

```text id="jjivfr"
Organization

↓

Facility

↓

Asset

↓

Work Order
```

References use ObjectIds internally.

Business layers expose string identifiers.

---

# 8. Index Strategy

Indexes should reflect business access patterns.

Examples

Unique

```text id="88x9du"
email

organizationSlug

vendorEmail
```

Search

```text id="9tx0tv"
organizationName

vendorName
```

Location

```text id="ah5pi5"
2dsphere

baseCoordinates
```

Composite

```text id="pqqyzw"
organizationId

status

createdAt
```

Indexes should be intentional rather than automatic.

---

# 9. Geospatial Data

MaintainPro supports geospatial queries.

Examples

* Nearby Vendors
* Nearby Technicians
* Service Radius
* Distance Calculations

Standard structure

```typescript id="lqvqem"
{
    type: "Point",

    coordinates: [longitude, latitude]
}
```

Geospatial fields require 2dsphere indexes.

---

# 10. Transactions

Transactions should be used only when multiple aggregate updates must succeed together.

Examples

* Subscription Purchase
* Invoice Creation
* Payment Recording

Avoid unnecessary transactions.

Single Aggregate updates normally do not require them.

---

# 11. Repository Pattern

Application Services never communicate directly with Mongoose.

Flow

```text id="tbdmyr"
Service

↓

Repository

↓

Mongoose Model

↓

MongoDB
```

Repositories isolate persistence implementation.

---

# 12. Schema Responsibilities

Schemas define persistence structure.

Responsibilities

* field definitions
* defaults
* indexes
* timestamps

Schemas should not implement business workflows.

---

# 13. Mongoose Conventions

MaintainPro adopts consistent schema conventions.

Every schema should include

```typescript id="5op50y"
timestamps: true
```

Primary identifier

```text id="bcsu29"
_id
```

Public APIs expose

```text id="f6cl3y"
id
```

Business layers should not depend on ObjectId.

---

# 14. Soft Delete Strategy

Most entities should remain recoverable.

Preferred lifecycle

```text id="y5ndbk"
Active

↓

Inactive

↓

Archived
```

Avoid physical deletion except where legally or operationally required.

---

# 15. Auditing

Critical business changes should produce Audit Records.

Audit Logs remain immutable.

Audit collections should not modify operational collections.

---

# 16. Performance

Performance principles

* query only required fields
* paginate large collections
* avoid unnecessary population
* index common filters
* prevent N+1 query patterns

Performance should be designed rather than optimized later.

---

# 17. Migrations

Schema evolution should preserve existing business data.

Migration strategy should include:

* forward-compatible changes
* data backfills
* index migrations
* rollback planning

Breaking schema changes require migration scripts.

---

# 18. Backup Strategy

Database backups should support:

* point-in-time recovery
* disaster recovery
* production restoration

Backups should be automated and regularly verified.

---

# 19. Architectural Rules

* Business logic never belongs in schemas.
* Services never query Mongoose directly.
* Repositories own persistence.
* Collections map to Aggregate Roots.
* References are preferred over duplication.
* Every index should support a business query.

---

# 20. Guiding Principle

> **MaintainPro uses MongoDB to implement the business model, not define it. Collections represent business aggregates, repositories isolate persistence, and the database remains an implementation detail beneath the Application Layer.**
