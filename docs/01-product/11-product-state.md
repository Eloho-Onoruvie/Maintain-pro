# MaintainPro Product States

**Version:** 1.0
**Status:** Draft
**Document Type:** User Experience Specification

---

# 1. Purpose

This document defines every operational state used throughout MaintainPro.

A Product State represents the current lifecycle position of an entity.

Every state must have:

* a clear meaning
* valid transitions
* business rules
* ownership
* completion conditions

The definitions in this document are the authoritative source for all backend enums, frontend badges, workflows, notifications, APIs, and reporting.

---

# 2. State Philosophy

MaintainPro follows four principles.

## Every state has meaning

A state should describe business reality, not technical implementation.

---

## States are finite

Every entity has a clearly defined lifecycle.

There should never be ambiguous or undefined states.

---

## State transitions are controlled

Entities move only through valid transitions.

Invalid transitions must be rejected.

---

## States drive behavior

Permissions, notifications, dashboards, reports, and workflows are determined by state.

---

# 3. Organization States

| State                | Description                                 |
| -------------------- | ------------------------------------------- |
| Pending Verification | Organization created but email not verified |
| Active               | Organization fully operational              |
| Suspended            | Access temporarily disabled                 |
| Archived             | Organization permanently closed             |

---

# 4. User States

| State                | Description                  |
| -------------------- | ---------------------------- |
| Invited              | Invitation sent              |
| Pending Verification | Email verification pending   |
| Active               | User can access the platform |
| Suspended            | Login disabled               |
| Archived             | User removed from operations |

---

# 5. Facility States

| State    | Description                         |
| -------- | ----------------------------------- |
| Active   | Operational facility                |
| Inactive | Temporarily unavailable             |
| Archived | Permanently removed from operations |

---

# 6. Asset States

| State             | Description                      |
| ----------------- | -------------------------------- |
| Active            | Operational asset                |
| Under Maintenance | Currently undergoing maintenance |
| Out of Service    | Temporarily unavailable          |
| Retired           | Permanently removed from service |

---

# 7. Service Request States

| State     | Description                   |
| --------- | ----------------------------- |
| Draft     | Request not yet submitted     |
| Submitted | Awaiting review               |
| Approved  | Ready for work order creation |
| Rejected  | Declined                      |
| Converted | Converted into a work order   |
| Cancelled | Closed without execution      |

---

# 8. Work Order States

| State           | Description                         |
| --------------- | ----------------------------------- |
| Draft           | Being prepared                      |
| Open            | Ready for assignment                |
| Assigned        | Assigned to technician or vendor    |
| In Progress     | Work has started                    |
| On Hold         | Execution paused                    |
| Awaiting Review | Work completed, awaiting inspection |
| Completed       | Successfully finished               |
| Cancelled       | Work terminated                     |

---

# 9. Preventive Maintenance States

| State       | Description                  |
| ----------- | ---------------------------- |
| Scheduled   | Planned for future execution |
| Generated   | Work order generated         |
| In Progress | Maintenance underway         |
| Completed   | Successfully executed        |
| Skipped     | Deliberately not performed   |

---

# 10. Vendor States

| State                | Description                            |
| -------------------- | -------------------------------------- |
| Pending Verification | Registration awaiting verification     |
| Verified             | Eligible for Marketplace participation |
| Suspended            | Marketplace participation suspended    |
| Archived             | Vendor no longer participates          |

---

# 11. Vendor Application States

| State        | Description                        |
| ------------ | ---------------------------------- |
| Submitted    | Application received               |
| Under Review | Organization reviewing application |
| Shortlisted  | Selected for further evaluation    |
| Rejected     | Not selected                       |
| Awarded      | Vendor chosen                      |

---

# 12. Quotation States

| State        | Description               |
| ------------ | ------------------------- |
| Draft        | Quotation being prepared  |
| Submitted    | Sent to organization      |
| Under Review | Evaluation in progress    |
| Accepted     | Selected quotation        |
| Rejected     | Not selected              |
| Withdrawn    | Vendor withdrew quotation |

---

# 13. Contract States

| State     | Description         |
| --------- | ------------------- |
| Pending   | Awaiting acceptance |
| Active    | Contract in force   |
| Completed | Contract fulfilled  |
| Cancelled | Terminated          |

---

# 14. Subscription States

| State     | Description            |
| --------- | ---------------------- |
| Trial     | Free trial period      |
| Active    | Paid subscription      |
| Past Due  | Payment overdue        |
| Cancelled | Subscription cancelled |
| Expired   | Subscription ended     |

---

# 15. Invoice States

| State    | Description          |
| -------- | -------------------- |
| Draft    | Not yet issued       |
| Issued   | Awaiting payment     |
| Paid     | Payment received     |
| Failed   | Payment unsuccessful |
| Refunded | Payment returned     |
| Void     | Cancelled invoice    |

---

# 16. Notification States

| State    | Description              |
| -------- | ------------------------ |
| Unread   | Not yet viewed           |
| Read     | Viewed by recipient      |
| Archived | Hidden from active inbox |

---

# 17. Audit Record States

Audit records are immutable.

They do not change state after creation.

---

# 18. General State Transition Rules

Every entity must:

* begin in a valid initial state
* transition only through permitted states
* maintain complete historical records
* never silently change state

State transitions should generate:

* audit records
* notifications (where applicable)
* updated reporting metrics

---

# 19. Future State Machines

Future modules will define additional lifecycles, including:

* Inventory
* Procurement
* Purchase Orders
* Spare Parts
* AI Jobs
* IoT Devices
* Digital Twins

These should follow the same lifecycle principles defined in this document.

---

# 20. Guiding Principle

> **A product state represents business reality. Every transition should be intentional, auditable, and governed by explicit business rules.**
