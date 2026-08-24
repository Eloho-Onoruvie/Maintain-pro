# Validation Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/validation-standard.md`

---

# 1. Purpose

This document defines the validation strategy used throughout the MaintainPro backend.

Validation protects the application by ensuring only well-formed, authorized, and business-compliant data reaches the application layer.

Validation should fail early, consistently, and predictably.

---

# 2. Philosophy

Validation is a boundary concern.

Business services should assume all incoming data has already passed structural validation.

Validation answers:

> "Is this input acceptable?"

Business logic answers:

> "Can this business operation happen?"

These responsibilities must never be mixed.

---

# 3. Validation Pipeline

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

↓

Domain
```

No request should reach a controller before validation succeeds.

---

# 4. Validation Layers

MaintainPro recognizes three validation layers.

## Transport Validation

Verifies request structure.

Examples

* Required fields
* Data types
* String length
* Number ranges
* Enum values
* Date formats

---

## Business Validation

Verifies business constraints.

Examples

* Asset already exists
* Vendor already approved
* Subscription expired
* Work Order already closed

Business validation belongs inside Application Services or Domain Policies.

---

## Persistence Validation

Database constraints.

Examples

* Unique indexes
* Foreign key integrity
* Duplicate records

Persistence validation complements but never replaces application validation.

---

# 5. Validation Location

Validation belongs inside:

```text
validation/
```

Every module owns its own validation rules.

Example

```text
assets/

validation/

create-asset.schema.ts

update-asset.schema.ts

archive-asset.schema.ts
```

---

# 6. Validation Technology

MaintainPro standardizes on a single validation library.

All request validation must use the same framework.

Custom validators should be created only when reusable business value exists.

---

# 7. Validation Rules

Validation should check:

* presence
* type
* format
* length
* range
* enumeration
* collection size
* nested structures

Validation should never perform database queries unless explicitly required.

---

# 8. Schema Organization

One schema per use case.

Examples

```text
CreateAssetSchema

UpdateAssetSchema

AssignTechnicianSchema

ApproveVendorSchema
```

Avoid large reusable schemas that attempt to validate unrelated operations.

---

# 9. Immutability

Validated request objects should be treated as immutable.

Application Services should not mutate validated input.

---

# 10. Error Reporting

Validation failures should return standardized errors.

Each error should contain:

* field
* message
* error code

Example

```text
field

message

code
```

Clients should always receive predictable validation responses.

---

# 11. Custom Validation

Custom validators should exist only when reusable.

Examples

* Organization Exists
* Vendor Is Active
* Valid Subscription
* Asset Ownership

Business-specific validation should remain centralized.

---

# 12. Nested Validation

Nested objects require independent schemas.

Example

```text
CreateOrganizationSchema

↓

AddressSchema

↓

ContactSchema
```

Validation should remain composable.

---

# 13. Array Validation

Collections should validate:

* size
* uniqueness
* element structure
* element type

Every element should satisfy its own schema.

---

# 14. Business Constraints

Business rules should never be implemented inside validation schemas.

Example

Good

```text
name

required

max length
```

Business Service

```text
Organization already exists
```

Validation and business behavior remain separate.

---

# 15. Validation Reuse

Shared validation belongs inside shared packages.

Examples

* Email
* Phone
* UUID
* ObjectId
* Pagination
* Date Range

Business-specific validation remains module-specific.

---

# 16. Logging

Validation failures should not generate audit events.

They may be logged for diagnostics when appropriate.

Business audit begins only after successful validation.

---

# 17. Testing

Validation tests verify:

* accepted input
* rejected input
* edge cases
* nested validation
* optional fields
* required fields

Validation should be tested independently from business services.

---

# 18. Architectural Rules

* Validation occurs before controllers.
* One schema per use case.
* Validation contains no business logic.
* Validation never accesses repositories directly.
* Validation failures use standardized responses.
* Shared validation remains reusable.
* Business validation remains outside schemas.

---

# 19. Anti-Patterns

Avoid:

* validation inside controllers
* validation inside services
* duplicated validation rules
* database access inside generic validators
* mixing business logic with schema definitions

Validation should remain deterministic.

---

# 20. Guiding Principle

> **MaintainPro treats validation as a dedicated boundary layer. Every request is structurally validated before reaching the application, while business rules remain within the domain, ensuring clean separation of concerns, predictable error handling, and consistent API behavior.**
