# MaintainPro Access Control Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines how access to resources is controlled throughout MaintainPro.

Access Control determines whether an authenticated actor may perform a requested operation.

MaintainPro follows a layered authorization model rather than relying solely on user roles.

---

# 2. Access Control Philosophy

Every access decision should answer one question:

> **Is this actor allowed to perform this action on this resource at this time?**

Access decisions consider multiple dimensions rather than relying on a single role.

---

# 3. Access Decision Model

Every protected request is evaluated using the following order.

```text
Identity

↓

Tenant

↓

Role

↓

Permission

↓

Ownership

↓

Business Rules

↓

Resource State

↓

Decision
```

Authorization stops immediately when any layer denies access.

---

# 4. Identity

The actor must first be authenticated.

Supported actor types include:

* Organization User
* Vendor User
* Platform Administrator

Anonymous users have access only to explicitly public endpoints.

---

# 5. Tenant Isolation

Every authenticated actor belongs to exactly one operational context.

Organization

or

Vendor

Resources outside the actor's tenant are inaccessible unless explicitly supported.

Cross-tenant access is prohibited.

---

# 6. Roles

Roles define responsibilities.

Examples include:

Organization

* Owner
* Administrator
* Facility Manager
* Technician
* Staff
* Finance

Vendor

* Vendor Owner
* Vendor Manager
* Vendor Technician

Platform

* Super Administrator

Roles group permissions.

Roles do not make access decisions by themselves.

---

# 7. Permissions

Permissions define actions.

Examples:

```text
facilities.read

facilities.create

facilities.update

facilities.delete

assets.read

assets.update

workorders.assign

workorders.complete

vendors.verify

subscriptions.manage
```

Permissions are atomic.

Multiple roles may grant the same permission.

---

# 8. Ownership

Some operations require ownership.

Examples:

A Vendor may edit only:

* Vendor Profile
* Vendor Team
* Vendor Quotations

An Organization may edit only:

* Organization Facilities
* Organization Assets
* Organization Work Orders

Ownership is evaluated after permissions.

---

# 9. Business Rules

Permissions may still be denied when business rules prohibit the operation.

Examples:

A completed Work Order cannot be modified.

A retired Asset cannot receive maintenance.

A suspended Vendor cannot submit quotations.

Business rules always override permissions.

---

# 10. Resource State

Resources may become temporarily protected.

Examples:

Draft

↓

Open

↓

Completed

Completed resources become read-only regardless of permissions.

---

# 11. Authorization Flow

```text id="r8jvxf"
Request

↓

Authentication

↓

Resolve Actor

↓

Resolve Tenant

↓

Resolve Roles

↓

Resolve Permissions

↓

Validate Ownership

↓

Validate Business Rules

↓

Validate Resource State

↓

Allow

or

Deny
```

---

# 12. Policies

Complex authorization decisions should be implemented through Policies.

Examples:

CanUpdateFacility

CanAssignWorkOrder

CanVerifyVendor

CanAwardContract

Policies encapsulate authorization logic outside controllers and services.

---

# 13. Permission Naming

Permissions follow a consistent format.

```text
resource.action
```

Examples

```text
assets.read

assets.create

assets.update

assets.delete

workorders.assign

vendors.verify

reports.export
```

Avoid inconsistent naming conventions.

---

# 14. Service Responsibilities

Services perform authorization.

Controllers never determine access.

Controllers may invoke authorization middleware, but business-level authorization belongs inside the Application Layer.

---

# 15. Future Access Models

MaintainPro currently uses Role-Based Access Control (RBAC).

The architecture should support future expansion toward Attribute-Based Access Control (ABAC).

Possible future attributes include:

* Facility
* Department
* Region
* Shift
* Contract
* Project
* Cost Center

---

# 16. Platform Administration

Platform Administrators operate outside customer tenants.

Platform administration capabilities should be isolated from customer business operations.

Platform administrators should never automatically bypass business rules.

---

# 17. Auditing

Every denied access decision should be auditable.

Sensitive authorization failures should generate audit records where appropriate.

---

# 18. Security Principles

MaintainPro follows the principle of least privilege.

Actors receive only the permissions required for their responsibilities.

Default behavior is deny.

Access is granted explicitly.

---

# 19. Evolution

Access Control should evolve without modifying business domains.

New permissions, roles, and policies should integrate into the existing authorization model without changing unrelated modules.

---

# 20. Guiding Principle

> **Access is determined through identity, tenant, permissions, ownership, and business rules—not by roles alone. Every protected operation should be explicitly authorized and denied by default.**
