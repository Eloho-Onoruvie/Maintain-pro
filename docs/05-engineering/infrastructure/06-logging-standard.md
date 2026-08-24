# Logging Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/infrastructure/logging-standard.md`

---

# 1. Purpose

This document defines the logging strategy used throughout the MaintainPro platform.

Logging provides operational visibility into the application by recording important system activities, failures, and execution details.

The logging system must be:

* structured
* centralized
* searchable
* secure
* consistent

---

# 2. Philosophy

Logs exist for engineers, operators, and support teams.

Logs are **not**:

* business data
* audit records
* user-facing messages
* debugging print statements

Every log entry should communicate meaningful operational information.

---

# 3. Logging Architecture

```text id="kwhm3d"
Application

↓

Logger

↓

Log Transport

↓

Central Log Store

↓

Dashboards & Search
```

Application code never writes directly to files.

---

# 4. Structured Logging

All logs must use structured formats.

Every log entry should include machine-readable fields rather than free-form text.

Example fields:

* timestamp
* level
* message
* module
* service
* requestId
* correlationId

---

# 5. Log Levels

MaintainPro standardizes the following log levels.

### TRACE

Very detailed execution information.

Development only.

---

### DEBUG

Developer diagnostics.

Disabled in production by default.

---

### INFO

Normal application behavior.

Examples:

* user authenticated
* work order created
* vendor approved

---

### WARN

Unexpected but recoverable conditions.

Examples:

* retry scheduled
* slow response
* missing optional configuration

---

### ERROR

Operation failed.

Business continues.

Examples:

* email failed
* queue timeout
* storage unavailable

---

### FATAL

Application cannot continue safely.

Examples:

* startup failure
* database unavailable during boot
* corrupted configuration

---

# 6. Correlation IDs

Every request should receive a unique correlation identifier.

Example

```text id="1ctsl6"
Request

↓

Correlation ID

↓

Every Log Entry

↓

Distributed Trace
```

This enables tracing a request across services.

---

# 7. Request Context

Logs generated during requests should include:

* requestId
* correlationId
* authenticated user (when available)
* organization
* module
* endpoint

Context should automatically propagate.

---

# 8. Business Logging

Business events should log meaningful milestones.

Examples:

* Work Order created
* Asset archived
* Subscription renewed
* Vendor approved

Logs should describe completed actions rather than implementation details.

---

# 9. Exception Logging

Unhandled exceptions should log:

* exception type
* message
* stack trace
* request context
* correlation ID

Client responses should never expose stack traces.

---

# 10. Sensitive Information

Logs must never contain:

* passwords
* API keys
* JWT tokens
* access tokens
* secrets
* payment credentials
* personally sensitive information

Sensitive values should be masked or omitted.

---

# 11. Audit Logging

Operational logs are different from audit logs.

Operational Logs

* diagnostics
* monitoring
* debugging

Audit Logs

* business accountability
* compliance
* user actions

Audit logging is defined separately by the Audit Strategy.

---

# 12. Performance Logging

Performance metrics should include:

* execution time
* slow queries
* external API latency
* queue duration
* cache response time

Performance logging should remain lightweight.

---

# 13. Log Retention

Operational logs should follow defined retention policies.

Typical retention depends on:

* environment
* compliance
* storage costs

Retention should be configurable.

---

# 14. Centralized Logging

Production logs should aggregate into a centralized platform.

Examples include:

* ELK Stack
* OpenSearch
* Loki
* Datadog
* Cloud-native logging services

Application instances should not rely on local log files for diagnostics.

---

# 15. Log Rotation

When local log files exist:

* rotation should be automatic
* file size should be limited
* archived logs should compress

Production environments should prefer centralized logging over local persistence.

---

# 16. Testing

Logging tests should verify:

* structured format
* required metadata
* sensitive data masking
* correlation propagation

Tests should avoid asserting timestamps.

---

# 17. Architectural Rules

* All logs are structured.
* Log levels follow platform standards.
* Correlation IDs propagate automatically.
* Sensitive information is never logged.
* Logging remains centralized.
* Operational and audit logs remain separate.
* Log context is consistent across modules.

---

# 18. Anti-Patterns

Avoid:

* `console.log()` in production code
* logging passwords
* logging JWTs
* inconsistent log formats
* duplicated log entries
* excessive debug logging in production
* logging business data unnecessarily

---

# 19. Future Enhancements

The logging platform should support:

* distributed tracing
* log correlation with metrics
* AI-assisted log analysis
* anomaly detection
* automatic incident creation
* log sampling
* cross-service tracing

---

# 20. Guiding Principle

> **MaintainPro treats logging as a first-class operational capability. Every log entry is structured, contextual, searchable, and secure, enabling engineers to understand application behavior, diagnose failures, and operate the platform reliably without exposing sensitive information.**
