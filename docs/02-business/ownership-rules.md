# MaintainPro Ownership Rules

**Version:** 1.0
**Status:** Draft
**Document Type:** Business Rules Specification

---

# 1. Purpose

This document defines ownership across MaintainPro.

Ownership determines:

* who controls a resource
* who may modify it
* who may delete it
* who may assign it
* who may view it

Ownership is separate from permissions.

Permissions determine what a role can do.

Ownership determines which resource those permissions apply to.

---

# 2. Ownership Philosophy

MaintainPro follows four ownership principles.

---

## OR-001 — Every Resource Has One Owner

Every resource belongs to exactly one owner.

Ownership is never ambiguous.

---

## OR-002 — Ownership Is Explicit

Ownership must always be represented within the data model.

Examples:

* organizationId
* vendorId
* createdBy
* assignedTo

Ownership should never be inferred.

---

## OR-003 — Ownership Is Auditable

Ownership changes are operational events.

Every ownership transfer should generate an Audit Record.

---

## OR-004 — Ownership Does Not Equal Permission

Owning a resource does not automatically grant unrestricted access.

Authorization always evaluates:

* ownership
* role
* business rules

---

# 3. Organization Ownership

Organizations own:

* Facilities
* Assets
* Service Requests
* Work Orders
* Preventive Maintenance Plans
* Internal Users
* Reports
* Documents
* Contracts

These resources cannot belong to another Organization.

---

# 4. Vendor Ownership

Vendors own:

* Vendor Profile
* Vendor Technicians
* Certifications
* Quotations
* Applications
* Vendor Documents
* Subscription

Vendor-owned resources remain isolated from other Vendors.

---

# 5. Facility Ownership

Each Facility belongs to exactly one Organization.

A Facility cannot belong to:

* multiple Organizations
* Vendors
* Users

Facility ownership cannot be transferred without explicit administrative action.

---

# 6. Asset Ownership

Each Asset belongs to:

* one Organization
* one Facility

Assets never belong directly to Users.

Assets may move between Facilities within the same Organization.

Moving an Asset between Organizations is not supported.

---

# 7. Service Request Ownership

Service Requests belong to the Organization.

The requester is recorded as:

createdBy

Ownership remains with the Organization regardless of who created it.

---

# 8. Work Order Ownership

Work Orders belong to the Organization.

Execution responsibility may belong to:

* Internal Technician
* Vendor

Execution responsibility is not ownership.

The Organization remains the owner throughout the lifecycle.

---

# 9. Preventive Maintenance Ownership

Preventive Maintenance Plans belong to the Organization.

Generated Work Orders inherit Organization ownership.

---

# 10. Vendor Application Ownership

Applications belong to the Vendor.

Organizations may review them.

Organizations never become owners of Vendor Applications.

---

# 11. Quotation Ownership

Quotations belong to the Vendor that created them.

Organizations may:

* review
* compare
* accept
* reject

Organizations never modify Vendor quotations.

---

# 12. Contract Ownership

Contracts belong jointly to:

* Organization
* Vendor

Each party maintains visibility.

Neither party may unilaterally modify an active contract.

---

# 13. Subscription Ownership

Organization subscriptions belong to the Organization.

Vendor subscriptions belong to the Vendor.

Users never own subscriptions.

---

# 14. User Ownership

Users own:

* personal profile
* preferences
* notification settings

Organizations own:

* employment relationship
* organizational membership
* assigned roles

---

# 15. Audit Ownership

Audit Records belong to the platform.

They cannot be edited or transferred.

---

# 16. Ownership Transfers

Ownership transfers are exceptional operations.

Transfers require:

* authorization
* audit logging
* timestamp updates

Examples include:

* Facility reassignment (future)
* Vendor ownership change
* Organization ownership transfer

---

# 17. Visibility Rules

Ownership influences visibility.

Users may only view resources they are authorized to access.

Examples:

An Organization Administrator may view every Organization resource.

A Technician views only assigned work.

A Vendor views only Vendor-owned resources and awarded contracts.

A Staff Member views only requests they created or are permitted to access.

---

# 18. Multi-Tenant Isolation

MaintainPro is a multi-tenant platform.

Every Organization and Vendor operates within an isolated data boundary.

Cross-tenant access is prohibited unless explicitly implemented in future platform capabilities.

---

# 19. Future Ownership

Future modules will define ownership for:

* Inventory
* Procurement
* Purchase Orders
* Spare Parts
* AI Agents
* IoT Devices
* Digital Twins

Every new entity introduced into MaintainPro must define ownership before implementation.

---

# 20. Guiding Principle

> **Ownership defines responsibility. Permissions define authority. Authorization requires both.**
