# Folder Structure

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/core/folder-structure.md`

---

# 1. Purpose

This document defines the standard directory organization for MaintainPro.

Every application, module, package, and service follows the same folder conventions.

Consistency is more important than personal preference.

---

# 2. Philosophy

Folders represent responsibilities.

Folders do **not** represent developers.

Folders do **not** represent temporary implementation details.

A directory should communicate its purpose immediately.

---

# 3. Repository Structure

```text id="6jxkzy"
maintainpro/

apps/

packages/

services/

infrastructure/

docs/

scripts/

tools/

tests/
```

Top-level directories represent architectural boundaries.

---

# 4. Backend Structure

```text id="c7qxur"
apps/api/

src/

bootstrap/

config/

container/

modules/

shared/

platform/

main.ts
```

The backend remains organized around business modules.

---

# 5. Module Structure

Every module follows the same layout.

```text id="o7c4uh"
asset/

controller/

application/

domain/

repository/

infrastructure/

validation/

dto/

events/

contracts/

index.ts
```

No module should invent its own structure.

---

# 6. Shared Structure

Reusable code belongs inside:

```text id="7qkg4q"
shared/

components/

utilities/

exceptions/

constants/

types/

helpers/

decorators/

middleware/
```

Business-specific logic does not belong here.

---

# 7. Platform Structure

Cross-cutting platform capabilities belong inside:

```text id="h5lgua"
platform/

events/

workflow/

notifications/

billing/

search/

audit/

reporting/

ai/

iot/
```

Platform capabilities serve every module.

---

# 8. Configuration

Application configuration belongs inside:

```text id="l0cqpj"
config/

database/

environment/

storage/

queue/

security/
```

Configuration remains centralized.

---

# 9. Dependency Injection

Dependency registration belongs inside:

```text id="mfhjpp"
container/
```

Only the composition root performs dependency registration.

---

# 10. Frontend Structure

```text id="6crk9l"
apps/web/

src/

app/

features/

shared/

api/

layouts/

hooks/

styles/

assets/
```

Business capabilities determine the structure.

---

# 11. Feature Structure

Every feature follows the same organization.

```text id="y1qh4o"
work-orders/

pages/

components/

hooks/

api/

validation/

types/

constants/

index.ts
```

Features own their UI.

---

# 12. Shared Frontend

Reusable frontend resources belong inside:

```text id="1jfxzl"
shared/

components/

icons/

hooks/

utilities/

constants/

types/
```

Shared components should remain business-independent.

---

# 13. API Layer

Frontend API communication belongs inside:

```text id="9mk6jp"
api/

auth/

assets/

vendors/

billing/

notifications/
```

Components never communicate directly with HTTP clients.

---

# 14. Assets

Static resources belong inside:

```text id="kx8ft2"
assets/

images/

icons/

fonts/

logos/
```

Generated assets should not mix with source code.

---

# 15. Tests

Testing follows predictable organization.

Unit tests remain colocated.

Shared testing resources belong inside:

```text id="4xh3zn"
tests/

integration/

e2e/

fixtures/

performance/

security/
```

---

# 16. Naming Rules

Directory names should:

* be lowercase
* use kebab-case when necessary
* avoid abbreviations
* reflect business language

Examples

Good

```text id="prmhru"
work-orders

preventive-maintenance

marketplace
```

Avoid

```text id="r2qd6d"
WO

pm

misc

common2
```

---

# 17. Growth Rules

New functionality should be added by extending existing architectural boundaries.

Avoid creating new top-level folders unless a new architectural concern is introduced.

The structure should evolve gradually rather than through large reorganizations.

---

# 18. Architectural Rules

* Every module follows the standard layout.
* Shared code remains business-independent.
* Platform capabilities remain centralized.
* Features own their implementation.
* Configuration remains centralized.
* Folder names communicate responsibilities.

---

# 19. Anti-Patterns

Avoid folders such as:

```text id="3ngllw"
misc/

helpers2/

new/

temp/

old/

random/
```

Avoid technology-based grouping inside business modules.

Example

```text id="agvm4l"
controllers/

services/

repositories/

models/
```

at the application root.

Prefer business-first organization.

---

# 20. Guiding Principle

> **MaintainPro's folder structure reflects architectural responsibilities and business capabilities rather than technologies or individual preferences. Every engineer should know where a file belongs before creating it.**
