# MaintainPro Authorization Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines how MaintainPro authorizes authenticated actors to perform business operations.

Authorization determines whether an authenticated actor may perform a requested action on a protected resource.

Authorization begins only after successful authentication.

---

# 2. Authorization Philosophy

MaintainPro follows **default deny**.

Every protected operation must be explicitly authorized.

Authorization should be:

* predictable
* consistent
* auditable
* business-aware

---

# 3. Authorization Pipeline

Every protected request follows the same evaluation sequence.

```text
Incoming Request

↓

Authentication

↓

Resolve Actor

↓

Resolve Tenant

↓

Resolve Permission

↓

Resolve Ownership

↓

Evaluate Policies

↓

Evaluate Business Rules

↓

Allow

or

Deny
```

The pipeline stops immediately when any stage fails.

---

# 4. The Actor

Authorization operates on a single object:

The **Actor**.

Example

```text
Actor

User ID

Actor Type

Organization ID

Vendor ID

Roles

Permissions
```

Business modules should authorize using the Actor rather than reading authentication tokens directly.

---

# 5. Authorization Layers

Authorization consists of six layers.

---

## Layer 1 — Authentication

Identity must already be verified.

Anonymous actors cannot access protected resources.

---

## Layer 2 — Tenant Validation

The actor must belong to the resource's tenant.

Examples

Organization User

↓

Organization Resources

Vendor User

↓

Vendor Resources

Cross-tenant access is denied.

---

## Layer 3 — Permission Validation

The actor must possess the required permission.

Example

```text
assets.update
```

Lacking the permission immediately denies access.

---

## Layer 4 — Ownership Validation

Some operations require ownership.

Examples

Vendor owns:

* quotations
* applications
* vendor profile

Organization owns:

* facilities
* assets
* work orders

Ownership validation occurs after permission validation.

---

## Layer 5 — Policy Evaluation

Policies evaluate complex business authorization.

Examples

CanAssignWorkOrder

CanApproveServiceRequest

CanAwardContract

Policies encapsulate authorization logic.

---

## Layer 6 — Business Rules

Business rules provide the final authorization layer.

Examples

Completed Work Orders cannot be modified.

Retired Assets cannot receive maintenance.

Expired subscriptions disable premium functionality.

Business rules override permissions.

---

# 6. Authorization Location

Authorization should occur inside the Application Layer.

Controllers should never contain authorization logic.

Repositories should never perform authorization.

---

# 7. Authorization Middleware

Middleware performs generic authorization responsibilities.

Examples

* authentication verification
* actor resolution
* tenant resolution
* permission requirements

Business-specific authorization remains inside services and policies.

---

# 8. Policies

Policies encapsulate reusable authorization logic.

Example

```text
CanUpdateAsset

CanDeleteFacility

CanVerifyVendor

CanManageSubscription
```

Policies should be deterministic.

They should not modify business state.

---

# 9. Ownership Checks

Ownership should be evaluated using resource ownership.

Examples

Organization ID

Vendor ID

Created By

Assigned To

Ownership is evaluated independently of roles.

---

# 10. Permission Resolution

Permissions are resolved through Roles.

Example

Facility Manager

↓

assets.read

assets.update

workorders.assign

Permissions should remain atomic.

---

# 11. Service Responsibilities

Application Services remain responsible for authorization decisions.

Example

```text
Update Asset

↓

Validate Actor

↓

Validate Permission

↓

Validate Ownership

↓

Apply Business Rules

↓

Update Asset
```

Services own authorization.

---

# 12. Repository Responsibilities

Repositories never authorize.

Repositories only persist and retrieve data.

Authorization must already be complete before persistence begins.

---

# 13. Shared Authorization Utilities

Shared authorization components may include:

* Actor Resolver
* Permission Evaluator
* Policy Base Classes
* Authorization Exceptions
* Authorization Middleware

Business-specific authorization should never exist inside Shared.

---

# 14. Authorization Events

Authorization itself should not generate business events.

Repeated authorization failures may generate:

* Audit Records
* Security Events

---

# 15. Failure Responses

Authorization failures should return consistent responses.

Examples

Unauthorized

Authentication missing or invalid.

Forbidden

Authentication valid, but access denied.

Authorization failures should never expose internal implementation details.

---

# 16. Testing

Authorization should be independently testable.

Tests should verify:

* permission checks
* ownership checks
* policy evaluation
* tenant isolation
* business rule enforcement

Authorization tests should not require HTTP.

---

# 17. Future Authorization

MaintainPro should support future authorization models including:

* Attribute-Based Access Control (ABAC)
* Department-based permissions
* Facility-level permissions
* Project-level permissions
* Time-based permissions
* Delegated administration

Future capabilities should extend rather than replace the existing authorization pipeline.

---

# 18. Security Principles

Authorization follows:

* least privilege
* explicit permission grants
* tenant isolation
* policy-based evaluation
* immutable audit history

Access is denied unless explicitly allowed.

---

# 19. Architectural Rules

Authorization must:

* remain inside the Application Layer
* avoid HTTP dependencies
* avoid database-specific behavior
* remain reusable across transports
* remain independent of Express

---

# 20. Guiding Principle

> **Authorization evaluates identity, tenant, permissions, ownership, policies, and business rules to determine whether an authenticated actor may perform a business operation. Access is denied by default and granted only through explicit authorization.**
