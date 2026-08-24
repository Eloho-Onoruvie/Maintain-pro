# Repository Structure

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/core/repository-structure.md`

---

# 1. Purpose

This document defines the repository organization for MaintainPro.

The repository structure should:

* separate responsibilities
* encourage scalability
* simplify onboarding
* support independent deployment where necessary
* remain consistent throughout the project's lifetime

The repository is designed around architectural boundaries rather than technologies.

---

# 2. Repository Philosophy

The repository represents the platform.

It should be organized around business capabilities and engineering concerns rather than individual developers or temporary project needs.

Every directory should have a clearly defined purpose.

---

# 3. High-Level Repository Layout

```text
maintainpro/

├── apps/
├── packages/
├── services/
├── infrastructure/
├── docs/
├── scripts/
├── tools/
├── tests/
├── .github/
├── docker/
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

# 4. Applications

The `apps/` directory contains deployable applications.

Example

```text
apps/

├── web/
├── api/
├── admin/
├── mobile/          (future)
├── vendor-portal/   (future)
└── customer-portal/ (future)
```

Each application owns only presentation and delivery concerns.

---

# 5. Shared Packages

The `packages/` directory contains reusable libraries.

Example

```text
packages/

├── ui/
├── config/
├── types/
├── validation/
├── auth/
├── permissions/
├── events/
├── sdk/
└── utilities/
```

Packages contain reusable logic shared across applications.

---

# 6. Platform Services

The `services/` directory contains independent platform capabilities.

Example

```text
services/

├── billing/
├── notifications/
├── marketplace/
├── workflow/
├── audit/
├── search/
├── reporting/
├── ai/
└── iot/
```

Each service owns one platform capability.

---

# 7. Infrastructure

Infrastructure contains deployment and operational resources.

Example

```text
infrastructure/

├── terraform/
├── kubernetes/
├── monitoring/
├── nginx/
├── storage/
└── messaging/
```

Infrastructure should remain independent from business code.

---

# 8. Documentation

All documentation lives inside:

```text
docs/
```

Documentation is version-controlled alongside the codebase.

Implementation should follow documented architecture.

---

# 9. Scripts

Automation scripts belong here.

Examples

* database migration helpers
* code generation
* backups
* release automation
* maintenance utilities

Scripts should be idempotent whenever practical.

---

# 10. Tools

Developer tooling belongs here.

Examples

* generators
* CLI utilities
* development helpers
* internal productivity tools

Tools support engineers but are not part of the production application.

---

# 11. Testing

Testing remains independent from implementation.

Example

```text
tests/

├── integration/
├── e2e/
├── performance/
├── security/
└── fixtures/
```

Unit tests remain colocated with source code.

Higher-level tests belong in the shared testing directory.

---

# 12. GitHub Configuration

Automation resources belong inside:

```text
.github/
```

Examples

* workflows
* issue templates
* pull request templates
* CODEOWNERS
* contributing guidelines

---

# 13. Docker

Container resources belong inside:

```text
docker/
```

Examples

* development
* production
* local services
* database containers

Docker configuration should remain isolated from application code.

---

# 14. Environment Configuration

Configuration should never be committed with secrets.

Repository root should contain:

```text
.env.example
```

Actual environment values remain external.

---

# 15. Dependency Direction

Repository dependencies should follow this direction:

```text
Applications

↓

Platform Services

↓

Shared Packages

↓

Infrastructure
```

Shared packages should never depend on applications.

---

# 16. Scalability

The repository should support:

* additional applications
* additional services
* additional packages
* future OIL Labs products

Growth should occur by adding directories rather than restructuring existing ones.

---

# 17. Consistency Rules

Every directory should:

* have a single responsibility
* follow naming conventions
* avoid circular dependencies
* minimize duplication

Repository organization should remain predictable.

---

# 18. Future Expansion

The repository should accommodate:

* microservices
* independent deployments
* multiple client applications
* shared internal SDKs
* additional OIL Labs products

No structural redesign should be required.

---

# 19. Architectural Rules

* Applications deliver user experiences.
* Platform services implement reusable capabilities.
* Shared packages contain reusable libraries.
* Infrastructure remains independent.
* Documentation evolves alongside implementation.
* Repository organization reflects architecture rather than technology.

---

# 20. Guiding Principle

> **The MaintainPro repository is organized around architectural boundaries, enabling long-term scalability, clear ownership, and reusable platform capabilities across MaintainPro and future OIL Labs products.**
