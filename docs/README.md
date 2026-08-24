# MaintainPro Engineering Documentation

Welcome to the official engineering documentation for **MaintainPro**.

This documentation defines the architecture, engineering standards, design decisions, and development workflow for MaintainPro. It serves as the single source of truth for both human contributors and AI-assisted development across the monorepo.

Every implementation, refactor, and architectural decision should align with the principles documented here.

---

# Purpose

This documentation exists to:

* Maintain architectural consistency across the codebase.
* Eliminate undocumented engineering decisions.
* Standardize development practices.
* Reduce onboarding time for future contributors.
* Ensure AI-generated code follows MaintainPro's engineering standards.
* Preserve long-term maintainability as the project grows.

---

# Documentation Structure

## Architecture

Defines how the system is designed and why architectural decisions were made.

Read in order:

1. Engineering Principles
2. Project Philosophy
3. Backend Architecture
4. Validation System
5. API Conventions
6. Multi-Tenancy
7. Security

---

## Standards

Defines how code should be written.

Includes:

* Coding conventions
* Folder structure
* Naming conventions

These standards are mandatory across the entire codebase.

---

## Workflows

Defines engineering workflows used throughout development.

Includes:

* AI development workflow

Additional workflows may be added as the project evolves.

---

## AI

Defines the responsibilities and operating rules for every AI assistant used during development.

Current AI assistants:

* ChatGPT
* Gemini CLI
* Codex
* Claude

Each assistant has a clearly defined responsibility and should only operate within its assigned role.

---

## Architecture Decision Records (ADR)

Architecture Decision Records document significant engineering decisions.

Each ADR answers:

* What decision was made?
* Why was it made?
* What alternatives were considered?
* What are the long-term consequences?

ADRs are immutable historical records. New decisions create new ADRs rather than modifying previous ones.

---

## Prompts

Reusable prompt templates for AI-assisted development.

These prompts ensure consistent implementation, reviews, and refactors across the project.

---

# Reading Order

All contributors should read the documentation in the following order before implementing features or performing refactors:

1. Engineering Principles
2. Project Philosophy
3. Backend Architecture
4. Validation System
5. Coding Conventions
6. AI Workflow
7. Relevant ADRs

---

# Documentation Rules

This documentation is part of the codebase and must evolve alongside it.

Whenever an architectural or engineering decision changes:

* Update the relevant documentation.
* Create a new ADR if the change affects architecture.
* Keep implementation consistent with documented standards.
* Avoid undocumented conventions.

Documentation should always describe the current state of the system.

---

# Ownership

The MaintainPro engineering documentation is the authoritative reference for all architectural and engineering decisions within the project.

When implementation and documentation disagree, the discrepancy must be resolved immediately before further development continues.
