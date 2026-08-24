# Gemini CLI Operating Guide

This document defines how Gemini CLI should be used within the MaintainPro project.

Gemini CLI is an implementation assistant.

It is responsible for accelerating development while respecting MaintainPro's architecture.

Gemini does not make architectural decisions.

Those decisions are made before implementation begins.

---

# Primary Responsibilities

Gemini CLI is used for:

* large implementations
* repository-wide refactors
* repetitive edits
* boilerplate generation
* terminal-assisted development
* updating multiple related files
* searching large codebases

Gemini should optimize development speed without changing architectural direction.

---

# What Gemini Should Know

Before making changes Gemini should understand:

* Engineering Principles
* Project Philosophy
* Backend Architecture
* Validation System
* Coding Conventions
* AI Workflow

These documents are mandatory context.

---

# Implementation Philosophy

Gemini implements.

It does not redesign.

It should extend the existing architecture rather than inventing new patterns.

---

# Preferred Work Size

Gemini performs best with focused implementation batches.

Preferred examples:

* complete validator layer
* complete schema layer
* complete controller refactor
* complete service refactor
* complete repository implementation

Avoid asking Gemini to rebuild unrelated modules simultaneously.

---

# Required Prompt Structure

Every implementation request should include:

## Objective

What should be built.

---

## Scope

Exactly which folders/files may change.

Example:

```text id="q3n7bf"
src/modules/auth/**
src/shared/validators/**
```

---

## Constraints

Architectural rules Gemini must obey.

Examples:

* no business logic in controllers
* infer DTOs from schemas
* repositories remain persistence-only
* no manual request interfaces

---

## Deliverables

Clearly state expected outputs.

Examples:

* validators
* schemas
* controller updates
* route wiring
* tests

---

# Allowed Changes

Gemini may:

* create files
* modify files
* remove dead code
* update imports
* rename symbols
* improve typing

provided the architecture remains unchanged.

---

# Forbidden Changes

Gemini must never:

* redesign architecture
* bypass services
* bypass validation
* duplicate validators
* duplicate business logic
* introduce `any`
* manually define request DTOs
* change project conventions
* invent folder structures

---

# Layer Responsibilities

Gemini should preserve these boundaries.

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

No layer skipping.

---

# Validation Rules

Requests are validated before controllers.

Controllers consume:

```text id="z4kyd0"
req.validated.body
req.validated.params
req.validated.query
```

Gemini should never generate code using raw request data when validated data is available.

---

# DTO Rules

Request DTOs come from:

```text id="i5g9jq"
z.infer<typeof schema>
```

Never manually recreate DTO interfaces.

---

# Repository Rules

Repositories only:

* query
* insert
* update
* delete

Repositories do not:

* hash passwords
* send emails
* verify permissions
* enforce business rules

---

# Service Rules

Business logic belongs in services.

Examples:

* duplicate email checks
* OTP verification
* permission checks
* account lock rules
* invitation rules

---

# Controller Rules

Controllers should:

* read validated input
* call services
* return standardized responses

Nothing more.

---

# Refactoring Rules

Gemini may refactor when it improves:

* readability
* consistency
* duplication
* typing

Behavior must remain unchanged unless explicitly requested.

---

# Large Refactors

Repository-wide refactors should be performed incrementally.

Preferred flow:

```text id="0k9x2s"
Analyze

↓

Plan

↓

Implement

↓

Review

↓

Continue
```

Avoid changing hundreds of files without checkpoints.

---

# Expected Quality

Generated code should be:

* production-ready
* strongly typed
* architecture compliant
* readable
* maintainable

---

# Output Expectations

Gemini should:

* explain major decisions briefly
* identify assumptions
* avoid speculative changes
* preserve existing project style

---

# Success Criteria

A successful Gemini implementation:

* compiles
* respects architecture
* introduces no duplicated logic
* keeps layers separated
* improves consistency
* follows MaintainPro conventions

Speed is valuable.

Consistency is mandatory.
