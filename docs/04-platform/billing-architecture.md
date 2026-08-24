# MaintainPro Billing Architecture

**Version:** 1.0
**Status:** Draft
**Document Type:** System Architecture

---

# 1. Purpose

This document defines how subscriptions, plans, payments, usage limits, renewals, invoicing, and commercial entitlements are managed throughout MaintainPro.

Billing is responsible for commercial access to the platform.

Business modules consume billing information but never implement billing logic.

---

# 2. Billing Philosophy

Billing controls **entitlements**, not business logic.

Business modules ask:

> "Is this feature available?"

Billing answers:

> "Yes" or "No."

Business modules never calculate subscriptions.

---

# 3. Billing Components

The Billing Platform consists of:

* Plans
* Subscriptions
* Payments
* Invoices
* Usage Limits
* Trials
* Renewals
* Feature Entitlements
* Webhooks
* Billing Events

---

# 4. Supported Customers

MaintainPro supports multiple subscription types.

## Organization Subscription

Controls:

* Facilities
* Assets
* Users
* Work Orders
* Storage
* Reports
* API Access

---

## Vendor Subscription

Controls:

* Marketplace Visibility
* Verification Badge
* Application Limits
* Premium Ranking
* Quote Limits
* Analytics
* Premium Features

Each customer type maintains an independent subscription.

---

# 5. Plans

Plans define commercial offerings.

Organization

```text id="lswjlwm"
Free

Starter

Professional

Enterprise
```

Vendor

```text id="xnd3jj"
Free

Starter

Professional
```

Plans define available features.

Plans never store customer data.

---

# 6. Subscription Lifecycle

Subscriptions follow a lifecycle.

```text id="pdmvjw"
Created

↓

Trial

↓

Active

↓

Past Due

↓

Grace Period

↓

Cancelled

↓

Expired
```

Only Billing changes subscription state.

---

# 7. Trial Period

Paid plans may begin with a Trial.

During Trial:

* Premium features remain enabled.
* No feature restrictions apply.
* Billing reminders may be issued.

If payment succeeds:

Trial

↓

Active

Otherwise:

Trial

↓

Expired

---

# 8. Renewals

Subscriptions renew automatically whenever supported by the payment provider.

Renewal produces:

```text id="4t0zvf"
SubscriptionRenewed
```

The Billing Platform publishes renewal events.

Business modules react accordingly.

---

# 9. Payment Providers

Billing remains provider-independent.

Future providers include:

Fiat

* Stripe
* Paystack
* Flutterwave

Crypto

* Coinbase Commerce
* Circle
* T-Rex
* Stablecoin Wallets

Business modules never communicate directly with providers.

---

# 10. Stablecoin Support

MaintainPro supports future stablecoin subscriptions.

Examples

* USDC
* USDT
* EURC

Future wallet integrations should support delegated recurring authorization where available.

Blockchain transactions remain infrastructure concerns rather than business concerns.

---

# 11. Payment Lifecycle

```text id="zgaixk"
Payment Initiated

↓

Payment Pending

↓

Payment Confirmed

↓

Subscription Updated

↓

Invoice Generated

↓

Billing Event Published
```

Subscriptions change only after payment confirmation.

---

# 12. Invoices

Every successful payment produces an Invoice.

Invoices remain immutable.

Invoices represent accounting history rather than subscription state.

---

# 13. Feature Entitlements

Business modules never inspect plans directly.

Instead they request Entitlements.

Examples

```text id="2nmo3v"
CanCreateFacility

CanUseMarketplace

CanAccessReports

CanInviteUnlimitedUsers

CanExportAnalytics
```

Billing resolves these capabilities.

---

# 14. Usage Limits

Plans define usage limits.

Examples

Organization

* Facilities
* Assets
* Users
* Work Orders

Vendor

* Applications
* Marketplace Listings
* Quotes
* Premium Exposure

Usage limits belong to Billing.

Business modules query Billing before performing restricted operations.

---

# 15. Vendor Verification

Billing influences Vendor status.

Lifecycle

```text id="kpq6iu"
Registered

↓

Email Verified

↓

Verification Badge

↓

Premium Badge

↓

Enterprise Partner (future)
```

Premium badges remain commercial entitlements.

Verification remains an operational process.

---

# 16. Grace Period

Failed renewals enter Grace Period.

During Grace:

* Existing data remains accessible.
* Premium creation may be restricted.
* Billing reminders continue.

Grace expiration transitions the subscription according to platform policy.

---

# 17. Billing Events

Billing publishes events.

Examples

```text id="o6qdzi"
SubscriptionActivated

SubscriptionRenewed

SubscriptionExpired

PaymentSucceeded

PaymentFailed

InvoiceGenerated
```

Other modules subscribe rather than polling Billing.

---

# 18. Webhooks

External providers communicate using Webhooks.

Typical flow

```text id="brg0fx"
Payment Provider

↓

Webhook

↓

Webhook Verification

↓

Billing Service

↓

Subscription Update

↓

Billing Event
```

Webhooks should always be idempotent.

---

# 19. Architectural Rules

* Billing owns subscriptions.
* Billing owns plans.
* Billing owns invoices.
* Billing owns payment history.
* Business modules consume entitlements.
* Business modules never calculate subscription state.
* Payments never modify unrelated business modules directly.
* Billing communicates through Domain Events.

---

# 20. Guiding Principle

> **Billing is MaintainPro's commercial engine. It manages subscriptions, payments, entitlements, and usage limits while exposing a simple capability-based interface to the rest of the platform. Business modules consume entitlements—they never implement billing logic.**
