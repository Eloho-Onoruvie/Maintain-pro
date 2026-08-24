# Multi-Tenancy

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/06-data-architecture/02-multi-tenancy.md`

---

# 1. Purpose

This document defines how MaintainPro isolates organizations while allowing all customers to share the same platform infrastructure.

Multi-tenancy is a foundational architectural principle.

Every business entity, authorization decision, query, and repository follows this strategy.

---

# 2. Philosophy

MaintainPro is a **shared-infrastructure SaaS**.

Organizations share:

* application servers
* databases
* queues
* storage infrastructure

Organizations never share business data.

Tenant isolation is enforced by architecture rather than convention.

---

# 3. Tenant Definition

A tenant represents an independent customer organization.

Examples include:

* Hotels
* Hospitals
* Banks
* Universities
* Manufacturing Companies
* Corporate Offices
* Government Agencies

Every tenant operates independently.

---

# 4. Tenant Identity

Every organization receives a globally unique identifier.

Example

```text id="o2xvsl"
organizationId
```

The organization identifier becomes the primary ownership boundary throughout the platform.

---

# 5. Ownership Model

Every business entity belongs to exactly one of the following:

* Organization
* Global Platform

Examples:

| Entity               | Owner        |
| -------------------- | ------------ |
| Asset                | Organization |
| Work Order           | Organization |
| Inventory            | Organization |
| Vendor               | Organization |
| Staff User           | Organization |
| Marketplace Category | Global       |
| System Configuration | Global       |

Ownership must always be explicit.

---

# 6. Tenant Boundary

The organization boundary protects:

* Assets
* Work Orders
* Vendors
* Inventory
* Reports
* Files
* Notifications
* AI Data
* Analytics

No business operation may cross tenant boundaries unless explicitly authorized by platform functionality.

---

# 7. Data Isolation

Every tenant-owned document must contain:

```text id="yzk24v"
organizationId
```

Repositories automatically include tenant filtering for all tenant-owned entities.

Application services should never manually implement tenant filtering.

---

# 8. Repository Enforcement

Repositories automatically enforce isolation.

Example

```text id="wv5rr7"
findAssets()

↓

organizationId injected

↓

Database Query
```

Controllers and business services should never bypass repository tenant enforcement.

---

# 9. Authentication

Authenticated users belong to one organization.

Authentication establishes:

* User
* Organization
* Roles
* Permissions

Every request carries tenant context.

---

# 10. Authorization

Authorization evaluates:

* authenticated user
* organization
* role
* permissions

A valid role never overrides tenant isolation.

Example:

An Administrator from Organization A cannot manage Organization B.

---

# 11. Shared Resources

Some resources are global.

Examples include:

* System Roles
* Marketplace Categories
* Country Lists
* Currency Definitions
* System Feature Flags

Global resources are read-only to tenant users.

---

# 12. Cross-Tenant Operations

Cross-tenant operations should be extremely rare.

Examples:

* Platform Administration
* Marketplace Discovery
* Vendor Invitations
* Global Analytics (Platform Only)

Every cross-tenant operation requires explicit authorization.

---

# 13. Storage Isolation

Object storage follows tenant boundaries.

Example

```text id="ctk91e"
organizations/

{organizationId}/

assets/

work-orders/

reports/
```

Storage paths reflect ownership.

---

# 14. Cache Isolation

Cache keys include tenant identifiers.

Example

```text id="zpm2ow"
organization:

{organizationId}:

dashboard
```

Cache collisions between organizations must never occur.

---

# 15. Queue Isolation

Background jobs include:

* organizationId
* correlationId

Workers process jobs within tenant context.

---

# 16. Search Isolation

Search indexes should respect tenant ownership.

Search queries automatically apply organization filters before returning results.

---

# 17. Analytics Isolation

Operational analytics remain tenant-specific.

Platform analytics aggregate anonymized operational metrics where appropriate but should not expose tenant business data without authorization.

---

# 18. Database Strategy

MaintainPro uses:

> **Shared Database + Shared Collections + Tenant Identifier**

Every tenant-owned collection includes:

```text id="bl7tnq"
organizationId
```

Benefits include:

* simpler operations
* efficient scaling
* centralized migrations
* lower infrastructure costs

---

# 19. Architectural Rules

* Every tenant-owned entity includes organizationId.
* Tenant filtering occurs automatically in repositories.
* Cross-tenant access is prohibited by default.
* Authentication establishes tenant context.
* Authorization enforces tenant ownership.
* Storage, cache, search, and queues remain tenant-aware.
* Global resources are explicitly identified.

---

# 20. Anti-Patterns

Avoid:

* queries without organization filters
* trusting client-provided organization identifiers
* sharing cache keys between tenants
* shared storage paths
* cross-tenant joins
* tenant filtering inside controllers

---

# 21. Future Enhancements

The tenancy model should support:

* enterprise organizations
* organization hierarchies
* regional data residency
* dedicated tenant infrastructure
* tenant-specific encryption keys
* premium isolated deployments

---

# 22. Guiding Principle

> **MaintainPro is a shared-platform, multi-tenant SaaS where every organization operates within a completely isolated business boundary. Tenant ownership is enforced automatically throughout repositories, storage, cache, queues, search, and authorization, ensuring strong security, predictable behavior, and scalable operations without requiring separate deployments for each customer.**
