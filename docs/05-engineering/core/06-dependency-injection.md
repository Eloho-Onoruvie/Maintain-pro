# Dependency Injection

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/core/dependency-injection.md`

---

# 1. Purpose

This document defines the Dependency Injection (DI) strategy used throughout the MaintainPro backend.

Dependency Injection ensures that modules remain loosely coupled, testable, replaceable, and maintainable by depending on abstractions rather than concrete implementations.

---

# 2. Philosophy

Business logic should never construct its own dependencies.

Instead of creating collaborators directly, components declare what they need and receive those dependencies from the application's Dependency Injection container.

Example:

Bad

```text
AssetService

↓

new AssetRepository()
```

Good

```text
AssetService

↓

IAssetRepository
```

The container decides which implementation is provided.

---

# 3. Objectives

The Dependency Injection system should provide:

* Loose coupling
* Testability
* Replaceable infrastructure
* Clear dependency graphs
* Predictable object lifecycles

---

# 4. Dependency Direction

Dependencies always point toward abstractions.

```text
Controller

↓

Application Service

↓

Repository Interface

↓

Repository Implementation

↓

MongoDB
```

Business layers never depend directly on infrastructure.

---

# 5. Registration

Every dependency must be registered with the application's DI container during application startup.

Registration should occur in one centralized composition root.

Example

```text
Application Startup

↓

Container Registration

↓

Application Boot
```

Business modules should never perform registration themselves.

---

# 6. Composition Root

There should be exactly one composition root for the backend.

Responsibilities include:

* Register services
* Register repositories
* Register infrastructure providers
* Register external integrations
* Configure object lifetimes

The composition root is the only place where concrete implementations are referenced.

---

# 7. Constructor Injection

Constructor injection is the preferred injection method.

Example

```text
AssetService

↓

IAssetRepository

IEventBus

IAuditService
```

Dependencies should be explicit.

Field injection and service location are discouraged.

---

# 8. Interfaces

Application layers depend on interfaces.

Examples

* IAssetRepository
* IUserRepository
* INotificationService
* IStorageProvider
* IAIProvider
* IPaymentProvider

Interfaces belong to the business layer.

Implementations belong to infrastructure.

---

# 9. Object Lifetimes

The container should support appropriate lifetimes.

Typical lifetimes include:

* Singleton
* Scoped
* Transient

Lifetime selection should match the responsibility of the dependency.

---

# 10. Infrastructure Providers

External systems are injected through provider interfaces.

Examples

* MongoDB
* Object Storage
* Email
* Search
* AI
* Billing
* Queue
* Cache

Business code remains unaware of provider implementations.

---

# 11. Module Registration

Every module exposes its registrations.

Example

```text
Asset Module

↓

registerAssetModule()

↓

Container
```

Modules remain independently composable.

---

# 12. Testing

Dependency Injection enables isolated testing.

During tests, implementations may be replaced with:

* mocks
* fakes
* stubs
* in-memory implementations

Production code should not require modification for testing.

---

# 13. Replaceability

Infrastructure implementations should be replaceable.

Example

```text
IStorageProvider

↓

S3StorageProvider

↓

CloudflareStorageProvider

↓

MinIOStorageProvider
```

Application Services remain unchanged.

---

# 14. Circular Dependencies

Circular dependencies are prohibited.

If two components require each other, the design should be refactored.

Domain Events or additional abstractions should be considered before introducing bidirectional dependencies.

---

# 15. Cross-Cutting Services

Shared platform services are injected like any other dependency.

Examples

* Logger
* Event Bus
* Audit Service
* Configuration
* Clock
* Cache

Cross-cutting concerns should never be accessed through global state.

---

# 16. Configuration

Configuration values should be injected.

Components should not read environment variables directly.

Example

```text
Environment

↓

Configuration Service

↓

Injected Component
```

This centralizes configuration management.

---

# 17. Architectural Rules

* Dependencies are declared, never constructed.
* Constructor injection is the standard.
* Business layers depend on abstractions.
* Infrastructure implements abstractions.
* Registration occurs only in the composition root.
* Global service locators are prohibited.
* Circular dependencies are prohibited.

---

# 18. Benefits

Following this strategy provides:

* easier testing
* clearer architecture
* replaceable infrastructure
* improved maintainability
* simpler onboarding
* reduced coupling

---

# 19. Future Evolution

The DI system should support future additions including:

* plugin modules
* feature flags
* multi-tenant providers
* dynamic provider selection
* runtime service discovery

These capabilities should not require changes to business modules.

---

# 20. Guiding Principle

> **MaintainPro uses Dependency Injection to separate business intent from technical implementation. Every component declares what it needs, the container supplies the implementation, and business logic remains independent, testable, and infrastructure-agnostic.**
