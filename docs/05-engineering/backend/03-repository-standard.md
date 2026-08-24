# Repository Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/repository-standard.md`

---

# 1. Purpose

This document defines the implementation standard for Repositories in the MaintainPro backend.

Repositories abstract data persistence from business logic.

They provide a consistent interface for storing and retrieving domain data while hiding infrastructure implementation details.

---

# 2. Philosophy

Repositories represent collections of business entities rather than database tables or collections.

The business should ask:

> "Give me an Asset."

Not

> "Query MongoDB."

Business code should remain completely unaware of the persistence mechanism.

---

# 3. Responsibilities

Repositories are responsible for:

* Persisting domain entities
* Retrieving domain entities
* Querying business data
* Mapping persistence models
* Managing persistence concerns

Repositories are the only layer allowed to communicate directly with the database.

---

# 4. Prohibited Responsibilities

Repositories must never:

* implement business rules
* perform authorization
* validate requests
* publish events
* execute workflows
* send notifications

Repositories manage persistence only.

---

# 5. Dependency Rule

Application Services depend on repository interfaces.

Example

```text id="xmdjz7"
AssetService

↓

IAssetRepository

↓

MongoAssetRepository

↓

MongoDB
```

Business layers never depend on concrete implementations.

---

# 6. Repository Interfaces

Every repository begins with an interface.

Example

```text id="o8x2ca"
IAssetRepository
```

Interfaces belong to the business layer.

Implementations belong to infrastructure.

---

# 7. Repository Implementations

Concrete implementations should be named after the storage technology.

Examples

```text id="vkjqg7"
MongoAssetRepository

PostgresVendorRepository

RedisSessionRepository
```

Business code remains unchanged when implementations change.

---

# 8. Repository Methods

Repository methods should describe business operations.

Good

```text id="a0s1fg"
findById()

findByOrganization()

findActiveAssets()

save()

archive()

exists()
```

Avoid exposing database-specific behavior.

Bad

```text id="b8ws7r"
aggregate()

collection()

pipeline()

executeQuery()
```

---

# 9. Persistence Models

Persistence models remain internal.

Repositories translate between:

* Domain Models
* Persistence Models

The rest of the application never sees persistence-specific structures.

---

# 10. Query Responsibility

Repositories own database queries.

Application Services should never construct queries.

Business code requests information through repository methods.

---

# 11. Transactions

Repositories participate in transactions coordinated by the Application Layer.

Repositories should not begin or commit transactions independently.

---

# 12. Pagination

Repository methods should support standardized pagination.

Examples

* page
* limit
* sort
* filters

Pagination behavior should remain consistent across repositories.

---

# 13. Filtering

Filtering belongs to repositories.

Application Services should express business intent rather than persistence logic.

Example

Good

```text id="s1rqw0"
findOverdueWorkOrders()
```

Instead of

```text id="qg3rby"
status = OPEN

dueDate < today
```

inside the service.

---

# 14. Performance

Repositories should optimize persistence.

Examples

* indexes
* projections
* batching
* aggregation
* query optimization

Performance decisions remain hidden from business logic.

---

# 15. Soft Deletes

Repositories implement soft deletion behavior where applicable.

Business Services invoke:

```text id="s8qzq7"
archive()

restore()
```

Repositories manage persistence details.

---

# 16. Testing

Repository implementations are tested using integration tests.

Repository interfaces are mocked during Application Service testing.

Business logic should not require a database.

---

# 17. Error Translation

Database-specific errors should be translated into domain exceptions.

Examples

Mongo duplicate key

↓

ConflictException

Missing document

↓

NotFoundException

Persistence details should never leak upward.

---

# 18. Naming

Repository interfaces:

```text id="2w6hlh"
IAssetRepository
```

Repository implementations:

```text id="2xoqfh"
MongoAssetRepository
```

Methods begin with verbs.

Examples

```text id="5ebkmt"
find()

save()

update()

archive()

delete()

exists()
```

---

# 19. Architectural Rules

* Repositories own persistence.
* Services never access databases directly.
* Business layers depend on interfaces.
* Persistence models remain internal.
* Repository methods express business intent.
* Infrastructure remains replaceable.
* Query optimization stays inside repositories.

---

# 20. Guiding Principle

> **Repositories isolate business logic from persistence by exposing business-oriented operations through stable interfaces while encapsulating database implementation, query optimization, and storage-specific behavior behind a consistent abstraction.**
