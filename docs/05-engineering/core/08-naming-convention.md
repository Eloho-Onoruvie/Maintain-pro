# Naming Conventions

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/core/naming-conventions.md`

---

# 1. Purpose

This document defines the naming conventions used throughout the MaintainPro codebase.

Consistent naming improves:

* readability
* maintainability
* discoverability
* onboarding
* collaboration

These conventions apply to every application, package, module, and service.

---

# 2. General Principles

Names should be:

* descriptive
* consistent
* business-oriented
* intention-revealing
* concise

Avoid abbreviations unless they are universally understood.

Good

```text
WorkOrder

PreventiveMaintenance

MarketplaceVendor
```

Avoid

```text
WO

PM

MktVendor
```

---

# 3. Business Language

Code should use the same language as the business.

Examples

* Asset
* Facility
* Organization
* Vendor
* Subscription
* Work Order

Avoid technical names where business names exist.

---

# 4. File Names

File names use **kebab-case**.

Examples

```text
asset-service.ts

create-work-order.dto.ts

vendor-controller.ts

billing-workflow.ts
```

---

# 5. Folder Names

Folders use **kebab-case**.

Examples

```text
preventive-maintenance

work-orders

vendor-marketplace
```

---

# 6. Classes

Classes use **PascalCase**.

Examples

```text
AssetService

VendorRepository

CreateWorkOrderCommand

NotificationDispatcher
```

---

# 7. Interfaces

Interfaces begin with **I**.

Examples

```text
IAssetRepository

IStorageProvider

IAIProvider

INotificationService
```

---

# 8. Types

Type aliases use **PascalCase**.

Examples

```text
AssetSummary

VendorStatus

WorkOrderPriority
```

---

# 9. Enums

Enums use **PascalCase**.

Members use **UPPER_SNAKE_CASE**.

Example

```text
WorkOrderStatus

OPEN

IN_PROGRESS

COMPLETED

CANCELLED
```

---

# 10. Variables

Variables use **camelCase**.

Examples

```text
workOrder

vendorProfile

organizationId

assetLocation
```

Variable names should communicate intent.

---

# 11. Constants

Constants use **UPPER_SNAKE_CASE**.

Examples

```text
DEFAULT_PAGE_SIZE

MAX_UPLOAD_SIZE

PASSWORD_MIN_LENGTH
```

---

# 12. Functions

Functions use **camelCase** and begin with a verb.

Examples

```text
createWorkOrder()

approveVendor()

archiveAsset()

calculateMaintenanceCost()
```

Function names should describe behavior.

---

# 13. Boolean Values

Boolean variables begin with words indicating state.

Examples

```text
isActive

isArchived

hasPermission

canApprove

shouldNotify
```

Avoid ambiguous names.

Bad

```text
active

permission

notify
```

---

# 14. Events

Domain Events use **PascalCase** and past tense.

Examples

```text
WorkOrderCreated

VendorApproved

SubscriptionRenewed

AssetArchived
```

Events describe something that has already happened.

---

# 15. Commands

Commands use **PascalCase** and begin with a verb.

Examples

```text
CreateWorkOrder

ApproveVendor

AssignTechnician
```

Commands describe intended actions.

---

# 16. DTOs

DTOs end with their purpose.

Examples

```text
CreateAssetRequestDto

UpdateVendorRequestDto

BillingSummaryResponseDto
```

Request and response DTOs should be clearly distinguishable.

---

# 17. Repositories

Repositories end with **Repository**.

Examples

```text
AssetRepository

VendorRepository

BillingRepository
```

Interfaces follow the same pattern.

```text
IAssetRepository
```

---

# 18. Services

Services end with **Service**.

Examples

```text
AssetService

BillingService

NotificationService
```

Service names should represent business capabilities.

---

# 19. Controllers

Controllers end with **Controller**.

Examples

```text
AssetController

VendorController

BillingController
```

---

# 20. API Routes

Routes use lowercase and hyphens.

Examples

```text
/api/v1/work-orders

/api/v1/preventive-maintenance

/api/v1/vendors
```

Routes should mirror business terminology.

---

# 21. Database Collections

Collections use **plural kebab-case**.

Examples

```text
organizations

facilities

assets

work-orders

subscriptions
```

Collection names remain stable over time.

---

# 22. Environment Variables

Environment variables use **UPPER_SNAKE_CASE**.

Examples

```text
DATABASE_URI

JWT_SECRET

SMTP_HOST

REDIS_URL
```

---

# 23. Test Files

Test files mirror source file names.

Examples

```text
asset-service.spec.ts

vendor-controller.spec.ts

billing-service.integration.spec.ts
```

---

# 24. Anti-Patterns

Avoid:

* generic names
* numbered files
* temporary names
* inconsistent casing
* unexplained abbreviations

Examples

```text
temp.ts

helper.ts

newService.ts

service2.ts

misc.ts
```

Every name should communicate purpose.

---

# 25. Architectural Rules

* Use business terminology.
* Prefer descriptive names over short names.
* Follow established suffixes.
* Maintain consistent casing.
* Avoid abbreviations unless universally understood.
* Similar concepts should use similar names.

---

# 26. Guiding Principle

> **Names are part of the architecture. Every identifier in MaintainPro should communicate business intent clearly, consistently, and predictably, allowing engineers to understand the system without relying on implementation details.**
