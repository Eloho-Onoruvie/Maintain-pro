# Caching Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/infrastructure/caching-standard.md`

---

# 1. Purpose

This document defines the caching strategy used throughout the MaintainPro platform.

Caching improves application performance by reducing latency, minimizing database load, and increasing scalability while preserving data consistency.

The caching system must be:

* predictable
* centralized
* observable
* replaceable
* secure

---

# 2. Philosophy

Caching is an optimization layer.

It must never become the primary source of truth.

The authoritative source of business data is always the database.

---

# 3. Cache Architecture

```text id="9r5jwx"
Application

↓

Repository

↓

Cache Layer

↓

Database
```

Repositories decide when cached data should be used.

Business services remain unaware of caching implementation.

---

# 4. Cache Ownership

Only infrastructure components may interact directly with the cache provider.

Application Services and Controllers must never communicate directly with Redis or other cache systems.

---

# 5. Cache Provider

MaintainPro supports pluggable cache providers.

Examples include:

* Redis
* In-memory cache (development/testing)
* Managed cloud cache

The application depends only on cache abstractions.

---

# 6. Cacheable Data

Suitable candidates include:

* Organization settings
* User permissions
* Feature flags
* Reference data
* Dashboard summaries
* Frequently accessed assets
* Configuration data

Frequently changing transactional data should generally not be cached.

---

# 7. Cache Keys

Cache keys must be deterministic and descriptive.

Examples

```text id="hlqf3e"
organization:{id}

asset:{id}

user:{id}:permissions

dashboard:{organizationId}

feature-flags
```

Keys should be namespaced by resource.

---

# 8. Time-To-Live (TTL)

Every cached item must define an expiration strategy.

Examples

* 5 minutes
* 30 minutes
* 24 hours
* No expiration (only when justified)

TTL values should be configurable.

---

# 9. Cache Invalidation

When authoritative data changes, affected cache entries must be invalidated.

Typical triggers include:

* create
* update
* archive
* restore
* delete

Cache invalidation should occur immediately after successful persistence.

---

# 10. Cache Strategy

MaintainPro primarily follows the **Cache-Aside** pattern.

```text id="hprhqx"
Read Request

↓

Check Cache

↓

Cache Hit

Return Data

OR

Cache Miss

↓

Database

↓

Populate Cache

↓

Return Data
```

---

# 11. Write Strategy

Write operations always update the database first.

Cache should then be:

* invalidated
* refreshed
* or rebuilt

The database remains the system of record.

---

# 12. Distributed Cache

Multiple application instances must share a common distributed cache in production.

Local in-memory caches should be limited to development or carefully controlled scenarios.

---

# 13. Sensitive Data

The cache must never store:

* passwords
* authentication secrets
* encryption keys
* payment credentials
* private tokens

Sensitive information should remain outside the cache.

---

# 14. Monitoring

Cache metrics should include:

* hit rate
* miss rate
* latency
* eviction count
* memory usage
* connection status

These metrics feed the observability platform.

---

# 15. Failure Handling

If the cache becomes unavailable:

* requests should continue using the database
* the application should degrade gracefully
* cache failures should not prevent business operations

Caching is an optimization, not a dependency.

---

# 16. Testing

Tests should verify:

* cache population
* cache invalidation
* cache expiration
* graceful cache failures
* fallback to database

Business logic should behave correctly regardless of cache availability.

---

# 17. Architectural Rules

* Cache is never the source of truth.
* Repositories own cache interaction.
* Cache keys are standardized.
* Every cached entry has a defined invalidation strategy.
* Cache failures must not interrupt business operations.
* Sensitive information must never be cached.
* Cache providers remain replaceable.

---

# 18. Anti-Patterns

Avoid:

* caching everything
* direct Redis access from services
* inconsistent cache keys
* stale cache without invalidation
* caching secrets
* permanent cache entries without justification

---

# 19. Future Enhancements

The caching layer should support future capabilities including:

* distributed invalidation
* cache warming
* regional caches
* query result caching
* analytics caching
* predictive preloading

---

# 20. Guiding Principle

> **MaintainPro uses caching as a transparent performance optimization that accelerates data access while preserving the database as the single source of truth. Cache behavior remains centralized, observable, replaceable, and resilient to failures.**
