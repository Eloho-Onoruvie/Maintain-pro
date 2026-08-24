# DTO Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/backend/dto-standard.md`

---

# 1. Purpose

This document defines the Data Transfer Object (DTO) standard used throughout the MaintainPro backend.

DTOs define the contract between architectural layers.

They isolate business models from transport models and ensure that data crossing application boundaries is explicit, predictable, and versionable.

---

# 2. Philosophy

DTOs are contracts.

They are **not**:

* database models
* domain entities
* business objects

Their only responsibility is moving structured data between layers.

---

# 3. Architectural Position

```text id="j41xla"
HTTP Request

↓

Request DTO

↓

Application Service

↓

Domain

↓

Response DTO

↓

HTTP Response
```

DTOs exist only at application boundaries.

---

# 4. Responsibilities

DTOs are responsible for:

* transporting data
* defining request contracts
* defining response contracts
* preventing domain leakage
* supporting API versioning

---

# 5. Prohibited Responsibilities

DTOs must never:

* contain business logic
* perform validation
* access repositories
* contain persistence behavior
* publish events
* execute workflows

DTOs are data structures only.

---

# 6. Types of DTOs

MaintainPro recognizes several DTO categories.

## Request DTO

Represents incoming client data.

Example

```text id="1e9b9w"
CreateAssetRequestDto
```

---

## Response DTO

Represents outgoing API data.

Example

```text id="2zbtbo"
AssetSummaryResponseDto
```

---

## Internal DTO

Transfers data between application components.

These are never exposed publicly.

---

## Event DTO

Carries information between domain events.

---

# 7. Request DTO Rules

Request DTOs:

* describe client input
* remain immutable after creation
* contain only transport fields

Business entities should never be passed directly from controllers.

---

# 8. Response DTO Rules

Response DTOs:

* expose only required information
* hide internal implementation details
* never expose database structures
* remain stable across versions

---

# 9. Mapping

DTOs should be mapped explicitly.

Example

```text id="p8hy6i"
Request DTO

↓

Application

↓

Domain Entity

↓

Response DTO
```

Mapping should be centralized.

---

# 10. Validation

Validation belongs to validators.

DTOs define shape.

Validators enforce correctness.

The two concerns remain separate.

---

# 11. Naming

DTO names should clearly communicate intent.

Examples

```text id="yuk7bh"
CreateAssetRequestDto

UpdateVendorRequestDto

AssignTechnicianRequestDto

AssetResponseDto

VendorSummaryResponseDto
```

Avoid generic names.

Bad

```text id="n6mp5d"
AssetDto

VendorDto

DataDto
```

---

# 12. Versioning

Public DTOs should support API evolution.

Breaking changes should create new DTOs rather than modifying existing contracts.

Example

```text id="9tujwz"
CreateAssetRequestV2Dto
```

only when required.

---

# 13. Optional Fields

Optional properties should remain truly optional.

Required business information should never be represented as optional without explicit business justification.

---

# 14. Nested DTOs

Complex objects should use nested DTOs rather than anonymous structures.

Example

```text id="vtx9qb"
AssetLocationDto

OrganizationSummaryDto

VendorContactDto
```

This improves reuse and readability.

---

# 15. Sensitive Information

Response DTOs must never expose:

* passwords
* secrets
* tokens
* internal identifiers
* security metadata

Only business-approved information should leave the application.

---

# 16. Pagination DTOs

Paginated responses should follow one standard.

Example

```text id="ddv78f"
data

meta

page

limit

total

totalPages
```

All paginated endpoints should use the same structure.

---

# 17. Mapping Responsibility

Application Services coordinate mapping.

Controllers should not manually construct complex Response DTOs.

Dedicated mappers may be introduced for larger modules.

---

# 18. Testing

DTO tests verify:

* serialization
* mapping correctness
* contract stability

Business behavior is tested elsewhere.

---

# 19. Architectural Rules

* DTOs define contracts.
* DTOs contain no business logic.
* DTOs never expose persistence models.
* Mapping remains explicit.
* Validation remains external.
* Public contracts evolve through versioning.
* Response DTOs hide implementation details.

---

# 20. Guiding Principle

> **MaintainPro uses Data Transfer Objects as explicit contracts between architectural boundaries. DTOs transport data without business behavior, protecting the domain model while providing stable, predictable interfaces for clients and internal application components.**
