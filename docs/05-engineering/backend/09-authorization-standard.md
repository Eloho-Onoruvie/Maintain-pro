# Authorization Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/authorization-standard.md`

---

# 1. Purpose

This document defines the authorization model used throughout the MaintainPro backend.

Authorization determines **what an authenticated user is allowed to do**.

The authorization system must remain:

* consistent
* centralized
* auditable
* scalable
* business-driven

Authorization is a business concern, not merely a technical concern.

---

# 2. Philosophy

Authentication answers:

> "Who are you?"

Authorization answers:

> "What are you allowed to do?"

These concerns remain completely separate.

Every protected action must explicitly verify permissions before business execution.

---

# 3. Authorization Pipeline

```text
HTTP Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Application Service
```

No business operation executes before authorization succeeds.

---

# 4. Authorization Model

MaintainPro uses **Role-Based Access Control (RBAC)** with **Permission-Based Authorization**.

The hierarchy is:

```text
Organization

↓

Role

↓

Permission

↓

Action
```

Roles group permissions.

Permissions authorize actions.

---

# 5. Organizations as Security Boundaries

Every organization represents an isolated security boundary.

Users can never access resources belonging to another organization unless explicitly authorized.

Multi-tenancy is enforced by default.

---

# 6. Roles

Roles represent business responsibilities.

Examples include:

* Organization Owner
* Organization Admin
* Facility Manager
* Technician
* Staff
* Finance Officer
* Vendor Administrator
* Vendor Technician
* Marketplace Administrator
* Platform Administrator

Roles should reflect business responsibilities rather than technical implementation.

---

# 7. Permissions

Permissions authorize business actions.

Examples

```text
asset.create

asset.read

asset.update

asset.archive

work-order.assign

vendor.approve

billing.manage

report.export
```

Permission names follow:

```text
resource.action
```

---

# 8. Least Privilege

Users receive only the permissions required to perform their responsibilities.

Permissions should never be granted "just in case."

Default access is deny.

---

# 9. Ownership

Certain operations depend on ownership rather than role.

Examples

* User edits own profile
* Vendor updates own company
* Technician views assigned work orders

Ownership checks complement permission checks.

---

# 10. Resource Authorization

Authorization should evaluate:

* Organization ownership
* Resource ownership
* Assigned responsibilities
* Business state

Example

A Technician may update only work orders assigned to them.

---

# 11. Centralized Authorization

Authorization logic should remain centralized.

Business modules should reuse shared authorization policies.

Avoid embedding permission checks throughout services.

---

# 12. Policies

Complex authorization should be implemented through policies.

Examples

```text
AssetPolicy

VendorPolicy

WorkOrderPolicy

BillingPolicy
```

Policies encapsulate authorization decisions.

---

# 13. Controllers

Controllers should invoke authorization before business execution.

Controllers should not implement authorization logic themselves.

Authorization decisions belong to reusable authorization services or policies.

---

# 14. Services

Application Services should assume authorization has already succeeded.

Only business-specific authorization checks that depend on domain state belong inside services.

---

# 15. Permission Evaluation

Permission evaluation should remain deterministic.

Inputs include:

* authenticated user
* organization
* resource
* requested action

The result is always:

```text
ALLOW

or

DENY
```

---

# 16. Audit

Authorization failures should be auditable.

Audit entries should include:

* user
* organization
* requested action
* resource
* timestamp
* outcome

Authorization logs improve compliance and security investigations.

---

# 17. Error Handling

Authorization failures throw:

```text
AuthorizationException
```

HTTP mapping:

```text
403 Forbidden
```

Internal permission details should never be exposed.

---

# 18. Testing

Authorization tests verify:

* role permissions
* ownership rules
* organization isolation
* denied access
* elevated access
* policy evaluation

Every protected operation should have authorization coverage.

---

# 19. Architectural Rules

* Authorization follows authentication.
* Default access is deny.
* Roles group permissions.
* Permissions authorize actions.
* Ownership complements permissions.
* Authorization logic remains centralized.
* Services should not duplicate authorization logic.
* Every protected action must be auditable.

---

# 20. Guiding Principle

> **MaintainPro authorizes business actions through centralized, role- and permission-based policies that enforce least privilege, tenant isolation, and resource ownership. Authorization decisions are explicit, reusable, auditable, and driven by business rules rather than implementation details.**
