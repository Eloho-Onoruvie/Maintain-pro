# MaintainPro Core Concepts

**Version:** 1.0
**Status:** Draft
**Document Type:** Product Specification

---

# 1. Purpose

This document defines the fundamental concepts that make up the MaintainPro platform.

These concepts establish the common language used throughout the product.

Every workflow, feature, business rule, API, database model, and user interface should use these definitions consistently.

No concept should have multiple meanings.

---

# 2. Organization

An **Organization** is the highest operational boundary within MaintainPro.

Every customer operates inside an organization.

An organization owns:

* facilities
* assets
* users
* maintenance operations
* operational history
* subscriptions
* vendors (through relationships)

Organizations are completely isolated from one another.

Everything in MaintainPro belongs to exactly one organization unless explicitly stated otherwise.

---

# 3. Facility

A **Facility** is a physical location where operational activities occur.

Examples include:

* Office Building
* Hospital
* School Campus
* Factory
* Warehouse
* Hotel
* Retail Store

A facility belongs to one organization.

A facility contains assets.

Maintenance activities occur within facilities.

---

# 4. Asset

An **Asset** is any physical object that requires management, inspection, maintenance, or lifecycle tracking.

Examples include:

* Generator
* Elevator
* HVAC System
* Air Conditioner
* Vehicle
* Medical Equipment
* Server Rack
* Fire Extinguisher

Every asset belongs to one facility.

Every asset has a lifecycle.

Assets are the primary subjects of maintenance activities.

---

# 5. User

A **User** is an authenticated individual who interacts with MaintainPro.

Users always belong to one of the following operational contexts:

* Organization
* Vendor

Users perform actions according to assigned roles.

Users are responsible for creating, approving, assigning, reviewing, or completing operational activities.

---

# 6. Vendor

A **Vendor** is an external organization that provides maintenance or operational services.

A vendor may specialize in one or more service categories.

Examples include:

* Electrical Services
* Plumbing
* HVAC
* Cleaning
* Security Systems
* Fire Safety
* Elevator Maintenance

Vendors participate through the MaintainPro Marketplace.

---

# 7. Service Request

A **Service Request** is the formal report of a maintenance issue or operational need.

It answers the question:

> "Something requires attention."

A Service Request does not represent work.

It represents demand for work.

It may result in:

* rejection
* approval
* conversion into a Work Order

---

# 8. Work Order

A **Work Order** is an authorized maintenance activity created to resolve an approved Service Request or planned maintenance activity.

It answers the question:

> "Authorized work must now be performed."

Work Orders define:

* scope
* responsibility
* priority
* execution status
* completion

A Work Order is the primary operational unit within MaintainPro.

---

# 9. Preventive Maintenance

Preventive Maintenance is scheduled work intended to reduce equipment failure before problems occur.

Unlike reactive maintenance, preventive maintenance is planned.

Examples include:

* monthly inspections
* quarterly servicing
* annual certification
* scheduled replacements

Preventive Maintenance generates Work Orders according to defined schedules.

---

# 10. Quotation

A **Quotation** is a vendor's commercial proposal for completing a Work Order.

A quotation typically defines:

* pricing
* estimated duration
* materials
* labor
* notes

Organizations evaluate quotations before selecting a vendor.

---

# 11. Vendor Application

A Vendor Application represents a vendor's request to participate in fulfilling a Work Order.

Multiple vendors may apply for the same opportunity.

Organizations evaluate applications before requesting quotations or awarding contracts.

---

# 12. Contract Award

A Contract Award is the organization's formal decision selecting a vendor to execute a Work Order.

Once awarded:

* competing applications close
* execution responsibility transfers to the selected vendor
* SLA monitoring begins

---

# 13. Service Level Agreement (SLA)

An SLA defines the operational expectations agreed between an organization and a vendor.

Typical measurements include:

* response time
* resolution time
* warranty period
* service commitments
* penalties

SLAs provide measurable standards for vendor performance.

---

# 14. Maintenance Lifecycle

Every maintenance activity progresses through a defined lifecycle.

Typical progression:

Issue Identified

↓

Service Request

↓

Approval

↓

Work Order

↓

Execution

↓

Review

↓

Completion

↓

Historical Record

MaintainPro manages this lifecycle consistently across all organizations.

---

# 15. Operational History

Operational History represents the permanent record of maintenance activities.

It includes:

* inspections
* repairs
* approvals
* assignments
* vendor actions
* asset history

Operational History supports:

* audits
* reporting
* compliance
* analytics
* future planning

History is never treated as temporary information.

---

# 16. Subscription

A Subscription defines an organization's or vendor's commercial relationship with MaintainPro.

Subscriptions determine:

* available capabilities
* operational limits
* marketplace participation
* premium functionality

Billing governs subscriptions.

Subscriptions do not change operational ownership.

---

# 17. Marketplace

The Marketplace connects organizations requiring external services with qualified vendors.

It enables:

* vendor discovery
* vendor applications
* quotation management
* contract awards
* vendor performance evaluation

The Marketplace facilitates operational collaboration without changing organizational ownership of work.

---

# 18. Audit

An Audit is the immutable record of significant operational events.

Audits exist to answer:

* Who performed the action?
* What changed?
* When did it occur?
* What was affected?

Audit records strengthen accountability, compliance, and organizational trust.

---

# 19. Relationships

The primary relationships within MaintainPro are:

Organization

→ owns Facilities

Facility

→ contains Assets

Asset

→ generates Service Requests

Service Request

→ becomes Work Orders

Work Orders

→ may involve Vendors

Vendors

→ submit Quotations

Organization

→ awards Contracts

Contracts

→ operate under SLAs

Every completed activity

→ becomes Operational History

Significant events

→ generate Audit Records

---

# 20. Ubiquitous Language

The definitions in this document are the official vocabulary of MaintainPro.

Future documentation, implementation, and communication should use these meanings consistently.

No module, feature, or API should redefine these concepts.

---

# Guiding Principle

> **A shared understanding of the domain is the foundation of a reliable product. MaintainPro speaks one language across product, business, design, engineering, and operations.**
