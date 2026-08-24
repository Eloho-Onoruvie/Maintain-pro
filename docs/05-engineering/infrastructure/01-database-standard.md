# Database Standards

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/infrastructure/database-standards.md`

---

# 1. Purpose

This document defines the engineering standards for database usage throughout the MaintainPro platform.

Its purpose is to ensure that all database interactions are:

* consistent
* secure
* maintainable
* performant
* independent of business logic

These standards apply to every service, repository, module, and engineer contributing to the platform.

---

# 2. Philosophy

The database is an infrastructure component.

Business logic should never depend directly on the database.

Instead, the architecture follows:

```text
Application Service

↓

Repository Interface

↓

Repository Implementation

↓

Database
```

The database stores business data but does not define business behavior.

---

# 3. Database Ownership

Only repository implementations may communicate directly with the database.

The following layers are prohibited from database access:

* Controllers
* Application Services
* Domain Entities
* Domain Services
* Workflow Engine
* Event Handlers (unless through repositories)

---

# 4. Repository Rule

Every collection or aggregate must have a corresponding repository.

Example

```text
assets

↓

IAssetRepository

↓

MongoAssetRepository
```

Repositories are the only abstraction responsible for persistence.

---

# 5. Collection Ownership

Each business module owns its collections.

Example

```text
Asset Module

↓

assets
```

Modules must not modify another module's collections directly.

Cross-module operations occur through services or published events.

---

# 6. Read and Write Responsibilities

Repositories are responsible for:

* create
* read
* update
* delete
* archive
* restore
* existence checks

Business decisions remain outside repositories.

---

# 7. Transactions

Transactions should be used only when multiple persistence operations must succeed or fail together.

Typical examples include:

* creating related records
* financial operations
* inventory adjustments
* subscription renewals

Long-running workflows should not rely on database transactions.

---

# 8. Query Ownership

All database queries belong inside repositories.

Application Services express business intent.

Repositories determine query implementation.

Good

```text
findOverdueWorkOrders()
```

Avoid exposing query construction to higher layers.

---

# 9. Performance

Repositories should optimize persistence using:

* indexes
* projections
* pagination
* batching
* aggregation
* efficient filters

Performance optimizations should remain transparent to business layers.

---

# 10. Pagination

Every collection endpoint should support standardized pagination.

Minimum parameters:

* page
* limit
* sort

Responses should follow the platform pagination standard.

---

# 11. Soft Deletes

Business records should generally use soft deletion.

Repositories expose business-oriented methods such as:

* archive()
* restore()

Physical deletion should be reserved for exceptional operational scenarios.

---

# 12. Audit Fields

Business collections should include standardized audit metadata where applicable.

Typical fields include:

* createdAt
* createdBy
* updatedAt
* updatedBy
* archivedAt
* archivedBy

Audit metadata should be maintained consistently.

---

# 13. Naming

Collection names use:

* lowercase
* plural
* kebab-case when needed

Examples

```text
organizations

work-orders

preventive-maintenance

vendors
```

---

# 14. Error Translation

Database-specific errors should never propagate outside repositories.

Repositories translate infrastructure failures into application exceptions.

Examples

* duplicate key → ConflictException
* missing document → NotFoundException

---

# 15. Security

Database credentials must never appear in source code.

Configuration must be provided through environment configuration.

Repositories should never build database connections manually.

---

# 16. Testing

Repository implementations should be verified with integration tests.

Business services should mock repository interfaces.

Database availability should not be required for unit tests.

---

# 17. Monitoring

Database operations should support:

* query timing
* slow query logging
* connection monitoring
* failure metrics

Monitoring should be centralized through the platform observability system.

---

# 18. Architectural Rules

* Only repositories access the database.
* Every aggregate has a repository.
* Modules own their collections.
* Services never construct queries.
* Repository interfaces isolate persistence.
* Database errors are translated.
* Transactions are used deliberately.
* Audit metadata is standardized.

---

# 19. Anti-Patterns

Avoid:

* direct database calls from services
* duplicated queries
* collection sharing between modules
* business rules inside repositories
* database credentials in source code
* persistence models leaking into business logic

---

# 20. Guiding Principle

> **MaintainPro treats the database as replaceable infrastructure. Business logic communicates through repository abstractions, ensuring persistence concerns remain isolated, secure, testable, and independent from the application's core business behavior.**
