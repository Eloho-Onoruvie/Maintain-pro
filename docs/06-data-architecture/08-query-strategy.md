# Query Strategy

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/06-data-architecture/08-query-strategy.md`

---

# 1. Purpose

This document defines how data is queried throughout the MaintainPro platform.

A consistent query strategy ensures:

* predictable performance
* maintainable repositories
* tenant isolation
* scalable data access
* optimized database utilization

All database access follows these standards.

---

# 2. Philosophy

Queries should retrieve exactly the data required—no more and no less.

MaintainPro prioritizes:

* efficiency
* readability
* consistency
* security

Every query should have a clear business purpose.

---

# 3. Repository Ownership

Repositories own all database queries.

Application layers must never communicate directly with MongoDB.

```text id="v5x1rc"
Controller

↓

Service

↓

Repository

↓

MongoDB
```

Business logic remains independent from persistence.

---

# 4. Tenant Filtering

Every tenant-owned query automatically applies:

```text id="f9q7ye"
organizationId
```

Repositories enforce tenant isolation.

Business services never manually inject tenant filters.

---

# 5. Query Types

MaintainPro supports four primary query categories.

### Lookup

Retrieve a single document.

Example:

```text id="mr8p3w"
findById()
```

---

### Collection Query

Retrieve multiple documents.

Example:

```text id="j0dt4v"
findAssets()
```

---

### Aggregation

Generate summaries.

Example:

* Dashboard statistics
* Maintenance trends
* Inventory summaries

---

### Search

User-driven filtering and searching.

---

# 6. Pagination

Large datasets must always be paginated.

Supported parameters:

```text id="lb6w2x"
page

limit

sort

order
```

Repositories should never return entire collections.

---

# 7. Cursor Support

Future large-scale APIs may support cursor-based pagination.

Example:

```text id="m8k0tp"
nextCursor
```

Cursor pagination improves scalability for continuously growing datasets.

---

# 8. Sorting

Sorting should use indexed fields whenever possible.

Common sort fields include:

* createdAt
* updatedAt
* priority
* scheduledDate
* assetName

Sorting on unindexed fields should be avoided for large collections.

---

# 9. Filtering

Filtering should be explicit.

Example filters:

* status
* priority
* asset type
* vendor
* technician
* location
* date range

Repositories should combine filters efficiently.

---

# 10. Projections

Queries should return only required fields.

Example:

Preferred:

```text id="q4c9ne"
assetName

status

location
```

Instead of returning the complete document.

Smaller payloads improve performance.

---

# 11. Aggregation Pipelines

Aggregation should be reserved for:

* dashboards
* reports
* statistics
* analytics

Business CRUD operations should avoid unnecessary aggregation pipelines.

---

# 12. Lookup Operations

MongoDB `$lookup` should be used sparingly.

Prefer:

* separate repository calls
* denormalized read models
* embedded value objects

Use `$lookup` only when justified.

---

# 13. Batch Queries

When retrieving multiple entities:

Prefer:

```text id="p1kw8v"
findMany()
```

Avoid:

```text id="h6y4sl"
findOne()

↓

findOne()

↓

findOne()
```

Batch retrieval reduces database round trips.

---

# 14. Query Performance

Repositories should avoid:

* collection scans
* unnecessary sorting
* redundant queries
* repeated lookups

Query plans should align with defined indexes.

---

# 15. Read Consistency

Operational queries prioritize consistency.

Critical business operations should always return authoritative data.

Caches should never replace the database as the source of truth.

---

# 16. Error Handling

Repositories should distinguish between:

* entity not found
* validation failure
* database failure
* authorization failure

Errors should follow the Exception Standard.

---

# 17. Query Logging

Slow queries should be monitored.

Logging may include:

* execution time
* collection
* index usage
* query identifier

Sensitive data should never appear in logs.

---

# 18. Architectural Rules

* Repositories own all queries.
* Tenant filtering is automatic.
* Pagination is mandatory.
* Sorting follows indexed fields.
* Projections minimize payload size.
* Aggregation is used for reporting.
* Batch queries reduce round trips.
* Query performance is continuously monitored.

---

# 19. Anti-Patterns

Avoid:

* querying from services
* querying from controllers
* returning entire collections
* N+1 query patterns
* collection scans
* selecting unnecessary fields
* bypassing repository abstractions

---

# 20. Future Enhancements

The query layer should evolve to support:

* query caching
* read replicas
* Atlas Search
* vector search
* CQRS read models
* query optimization analytics

---

# 21. Guiding Principle

> **MaintainPro retrieves data through repository-owned, tenant-aware, and performance-optimized queries that return only the information required for each business operation. Query behavior is standardized across the platform to ensure consistency, scalability, maintainability, and predictable performance as the system grows.**
