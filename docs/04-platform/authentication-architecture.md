# MaintainPro Authentication Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines how users authenticate with MaintainPro.

Authentication establishes identity.

It does not determine permissions or resource access.

Successful authentication produces a verified actor that may proceed to authorization.

---

# 2. Authentication Philosophy

Authentication answers only one question:

> **Who is this actor?**

Everything else is handled by:

* Authorization
* Business Rules
* Ownership
* Policies

---

# 3. Supported Identity Types

MaintainPro supports multiple identity types.

## Organization Users

Users employed by an Organization.

Examples:

* Owner
* Administrator
* Facility Manager
* Technician
* Staff
* Finance

---

## Vendor Users

Users belonging to Vendor organizations.

Examples:

* Vendor Owner
* Vendor Manager
* Vendor Technician

---

## Platform Administrators

Internal MaintainPro administrators responsible for platform operations.

Platform Administrators are isolated from customer business operations.

---

# 4. Authentication Flow

```text id="rjptp1"
Credentials

↓

Identity Verification

↓

Account Verification

↓

Generate Session

↓

Issue Tokens

↓

Authenticated Actor
```

Authentication stops immediately if verification fails.

---

# 5. Supported Authentication Methods

Primary authentication:

* Email + Password

Future authentication:

* Magic Link
* OAuth
* SSO (SAML / OIDC)
* Enterprise Identity Providers
* Passkeys / WebAuthn

All authentication methods must resolve to the same internal identity model.

---

# 6. Account Verification

Accounts may require verification before becoming active.

Examples include:

* Email verification
* Phone verification (future)
* Organization approval (future)

Unverified accounts authenticate only after satisfying verification requirements.

---

# 7. Password Management

Passwords are never stored in plain text.

Passwords must be:

* hashed
* salted
* irreversible

Password verification occurs during authentication only.

The original password is never recoverable.

---

# 8. Session Model

Successful authentication creates an authenticated session.

A session represents an active identity rather than an authorization decision.

Sessions should include:

* actor identifier
* actor type
* tenant identifier
* issued timestamp
* expiration timestamp

---

# 9. Token Strategy

MaintainPro uses token-based authentication.

Recommended token pair:

* Access Token
* Refresh Token

Access Tokens authenticate requests.

Refresh Tokens obtain new Access Tokens without requiring the user to sign in again.

---

# 10. Token Lifetime

Access Tokens should remain short-lived.

Refresh Tokens may remain valid for longer periods.

Token lifetimes should remain configurable.

---

# 11. Actor Context

Every authenticated request resolves an Actor.

Example Actor:

```text id="zlvvye"
Actor

User ID

Organization ID or Vendor ID

Actor Type

Roles

Authentication Status
```

The Actor becomes the input for Authorization.

---

# 12. Logout

Logging out invalidates the active session.

Future implementations may support:

* single-device logout
* all-device logout
* session revocation

---

# 13. Credential Recovery

Supported recovery operations:

* forgot password
* password reset
* password change

Recovery should never expose existing credentials.

---

# 14. Account Locking

Repeated authentication failures may temporarily lock an account.

Locking should reduce credential stuffing and brute-force attacks.

---

# 15. Authentication Events

Authentication produces business events.

Examples:

* UserAuthenticated
* UserLoggedOut
* PasswordChanged
* PasswordResetRequested
* EmailVerified

These events may trigger notifications and audit logging.

---

# 16. Security Requirements

Authentication should enforce:

* secure password storage
* HTTPS-only transport
* token expiration
* replay protection where applicable
* session invalidation
* secure token generation

---

# 17. Future Authentication

Future authentication capabilities include:

* Multi-Factor Authentication (MFA)
* Hardware Security Keys
* WebAuthn Passkeys
* Enterprise Single Sign-On
* Biometric Authentication (mobile)

These capabilities should integrate without changing the core identity model.

---

# 18. Relationship with Authorization

Authentication identifies the actor.

Authentication does not determine:

* permissions
* ownership
* resource visibility

After successful authentication, the request proceeds to the Authorization layer.

---

# 19. Architectural Principles

Authentication should remain:

* stateless where practical
* independent of business modules
* reusable across every API
* transport-independent

Business modules should never implement authentication logic.

---

# 20. Guiding Principle

> **Authentication establishes identity. It never grants authority. Every authenticated request must still pass authorization before business logic executes.**
