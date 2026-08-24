# Codex Operating Guide

This document defines how Codex should operate within the MaintainPro codebase.

Codex is the primary implementation agent.

Its responsibility is to produce production-ready code that conforms to MaintainPro's architecture, engineering principles, and coding standards.

Codex is an implementation tool, not an architecture tool.

---

# Primary Responsibilities

Codex is responsible for:

* implementing approved features
* writing production-ready code
* refactoring existing implementations
* improving type safety
* removing duplication
* updating related files consistently
* maintaining architectural consistency

Codex should optimize correctness over speed.

---

# Required Context

Before implementing any feature, Codex should understand the following project documents:

* Engineering Principles
* Project Philosophy
* Backend Architecture
* Validation System
* Coding Conventions
* AI Workflow

If architectural context is missing, implementation should stop until sufficient context is provided.

---

# Implementation Philosophy

Codex follows the existing architecture.

It should never redesign project structure during implementation.

Its goal is to extend the existing system while preserving consistency.

---

# Preferred Task Size

Codex performs best with well-defined implementation phases.

Preferred examples:

* complete validator layer
* complete schema layer
* complete controller refactor
* complete service implementation
* complete repository implementation
* module-wide validation migration

Avoid combining unrelated features into one request.

---

# Required Prompt Structure

Every Codex task should include:

## Objective

What should be implemented.

---

## Scope

Files and folders that may be modified.

Example:

```text id="0zvslj"
src/modules/auth/**
src/shared/validators/**
src/shared/middleware/**
```

---

## Constraints

Architectural rules.

Examples:

* infer DTOs from schemas
* controllers remain thin
* repositories remain persistence-only
* services own business logic
* no manual request interfaces

---

## Deliverables

Expected outputs.

Examples:

* validators
* schemas
* service updates
* controller updates
* route wiring
* tests

---

# Layer Responsibilities

Codex must preserve layer boundaries.

```text id="qmk1mz"
Routes

↓

Middleware

↓

Controllers

↓

Services

↓

Repositories

↓

Models
```

Skipping layers is prohibited.

---

# Validation Rules

Every request must pass through the validation pipeline.

Controllers consume:

```text id="hr4zbt"
req.validated.body
req.validated.params
req.validated.query
```

Codex must not generate controllers that read raw request data when validated data is available.

---

# DTO Rules

Request DTOs are inferred.

Preferred pattern:

```text id="5r0qqe"
type LoginDto = z.infer<typeof loginSchema>
```

Manual request DTO interfaces are prohibited.

---

# Validator Rules

Validators should represent reusable business concepts.

Examples:

* email
* password
* phone
* objectId
* pagination

Validators should not contain endpoint-specific logic.

---

# Schema Rules

Each endpoint owns one schema.

Schemas compose validators.

Schemas should not duplicate validation logic already available in shared validators.

---

# Service Rules

Business logic belongs exclusively in services.

Examples:

* account verification
* password reset
* invitation acceptance
* authorization
* duplicate checks
* lockout rules

Services coordinate workflows.

---

# Repository Rules

Repositories interact with persistence only.

Repositories may:

* create
* read
* update
* delete

Repositories may not:

* hash passwords
* verify permissions
* send emails
* generate JWTs
* perform business validation

---

# Controller Rules

Controllers should only:

* read validated input
* build session metadata
* call services
* return standardized responses

Controllers should not contain business rules.

---

# Dependency Injection

Codex must respect constructor injection.

Never instantiate dependencies manually.

Correct:

```text id="dr9tjj"
Controller

↓

Service

↓

Repository
```

Incorrect:

```text id="9f3jfc"
new UserRepository()

new AuthService()
```

All new dependencies must be registered through the project's container.

---

# Refactoring Rules

Codex may refactor to improve:

* readability
* consistency
* typing
* duplication

Refactoring must preserve behavior unless explicitly instructed otherwise.

---

# Large Refactors

Large repository changes should follow this process:

```text id="5l0f9o"
Analyze

↓

Plan

↓

Implement

↓

Verify

↓

Continue
```

Avoid editing unrelated modules in a single step.

---

# Error Handling

Codex should use existing project error utilities.

Avoid introducing inconsistent error patterns.

Business errors belong in services.

HTTP formatting belongs in controllers.

---

# Type Safety

Strong typing is mandatory.

Avoid:

* any
* unnecessary assertions
* duplicated interfaces
* weakened generic constraints

Prefer inference whenever possible.

---

# Security

Codex must preserve security guarantees.

Never:

* expose password hashes
* expose refresh tokens
* bypass authorization
* bypass validation
* duplicate authentication logic

Security-sensitive code should reuse existing shared utilities.

---

# Documentation

When implementation changes architecture, public APIs, or conventions, corresponding documentation should also be updated.

---

# Success Criteria

A successful Codex implementation:

* compiles
* follows architecture
* preserves layer boundaries
* introduces no duplicated business logic
* maintains strong typing
* uses inferred DTOs
* integrates cleanly with the existing codebase
* requires minimal manual correction

Correctness takes priority over implementation speed.
