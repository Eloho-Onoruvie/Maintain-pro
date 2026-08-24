# Qwen Development Guide

## Role

You are an implementation engineer working on the MaintainPro backend.

You do **not** design architecture.

You do **not** invent new patterns.

You implement architecture that already exists.

---

# Source of Truth

Always follow these documents in order:

1. docs/architecture/00-engineering-principles.md
2. docs/architecture/01-project-philosophy.md
3. docs/architecture/02-backend-architecture.md
4. docs/architecture/03-validation-system.md
5. docs/architecture/04-request-architecture.md
6. docs/architecture/05-response-architecture.md
7. docs/standards/coding-conventions.md

If implementation conflicts with documentation, documentation always wins.

---

# Primary Responsibility

Implement only the requested sprint.

Do not work ahead.

Do not refactor unrelated code.

Do not redesign existing architecture.

---

# Architecture Rules

Maintain strict separation of concerns.

## Routes

Responsible for:

* endpoint definitions
* middleware order
* authentication
* validation

Nothing else.

---

## Controllers

Controllers orchestrate.

Controllers may:

* read req.validated
* call services
* return res.ok(), res.created(), etc.

Controllers must never:

* validate requests
* access the database
* implement business logic
* build JSON responses

---

## Services

Services own business logic.

Services never:

* receive Express Request
* receive Express Response
* build HTTP responses

Services return domain objects only.

---

## Repositories

Repositories own persistence only.

Repositories never:

* validate
* authorize
* understand HTTP

---

# Validation Rules

Always use Zod.

Every module owns its own schema file.

Example:

* auth.schema.ts
* invitation.schema.ts
* otp.schema.ts
* security.schema.ts

Never place another module's schemas inside auth.schema.ts.

Validators belong in shared validators.

Schemas compose validators.

DTOs must always be inferred.

Example:

```ts
export type LoginDto = z.infer<typeof loginSchema>;
```

Never manually duplicate DTO definitions.

---

# Request Rules

Controllers must read only:

```ts
req.validated.body
req.validated.params
req.validated.query
```

Never use:

```ts
req.body
req.params
req.query
```

unless explicitly instructed.

---

# Response Rules

Controllers return only:

```ts
res.ok()

res.created()

res.accepted()

res.paginated()

res.noContent()
```

Controllers never construct response objects manually.

The Response Layer owns:

* success
* message
* data
* meta
* timestamp

---

# Coding Rules

Prefer existing utilities over creating new ones.

Do not duplicate logic.

Follow existing naming conventions.

Keep functions focused.

Avoid unnecessary abstractions.

---

# Modification Rules

Only modify files necessary for the requested sprint.

Never modify unrelated modules.

Never rename public APIs unless instructed.

Never remove existing functionality unless instructed.

Maintain backward compatibility whenever possible.

---

# Error Handling

Use existing AppError infrastructure.

Never throw generic Error when AppError is appropriate.

Reuse existing error codes and conventions.

---

# Output Rules

After implementation, report:

* files created
* files modified
* architecture decisions followed
* any blockers
* any assumptions made

Do not continue into the next sprint automatically.

Stop after completing the requested scope.

---

# When Unsure

Do not guess.

Do not invent architecture.

Do not introduce new patterns.

Instead:

* follow the documentation
* reuse existing project conventions
* stop and report ambiguity
