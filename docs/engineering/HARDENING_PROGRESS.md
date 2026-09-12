# MaintainPro Hardening Progress

This ledger is intentionally conservative. `VERIFIED` means the current
working tree contains the implementation and the relevant verification was
actually run. `PARTIAL` means only part of the acceptance criteria is covered.
`TODO` means the ticket still needs implementation or evidence.

| Ticket | Status | Evidence / remaining work |
|---|---|---|
| HARD-001 | VERIFIED | Baseline recorded in `docs/engineering/baseline.md`; the recorded baseline is historical and must not be confused with the current dirty trees. |
| HARD-002 | VERIFIED | The requested split-repository topology is intentional: frontend is the root repository and backend remains an independent repository with preserved history, remotes, CI, deployment, and release environments. |
| HARD-003 | VERIFIED | The split topology has independent, non-contradictory frontend and backend CI workflows covering install, lint, typecheck, tests, build, security audit, route audit, container build, and failure diagnostics. |
| HARD-004 | PARTIAL | Actor/scope data is present in critical paths; a complete service-wide actor context audit is still required. |
| HARD-005 | VERIFIED | Subscription ownership checks and authorization tests are present. |
| HARD-006 | VERIFIED | Subscription mutation ownership checks are present. |
| HARD-007 | PARTIAL | High-risk resource paths were audited; a complete endpoint inventory and regression suite remain. |
| HARD-008 | VERIFIED | Tenant/facility/vendor authorization regression coverage is present and passed in the backend integration run (`155` passing tests). |
| HARD-009 | VERIFIED | Production validation rejects mock billing configuration. |
| HARD-010 | PARTIAL | Ownership uniqueness/index work exists; production duplicate detection/remediation evidence remains. |
| HARD-011 | PARTIAL | Billing transitions are constrained by `SubscriptionPolicy`; terminal subscriptions can no longer change plans (`29750c2`), while the complete provider/state matrix remains. |
| HARD-012 | PARTIAL | Transactional payment/subscription paths exist; provider initialization failures now mark checkout attempts failed for retry, with focused coverage (`22309c6`, `42486dd`); provider-specific rollback coverage remains. |
| HARD-013 | VERIFIED | Stable checkout idempotency contract is implemented and tested in billing paths. |
| HARD-014 | VERIFIED | Provider event identity and duplicate handling are implemented; live-provider verification remains owner-controlled. |
| HARD-015 | PARTIAL | Billing tests cover core failures, checkout rollback, limiter behavior, and subscription policy: 2 files/21 tests passed against MongoDB replica set and Redis (`29750c2`); the complete concurrency/provider matrix remains. |
| HARD-016 | PARTIAL | Transactional inventory paths exist; transfer idempotency now returns the same mapped transaction shape on first execution and replay (`1a059f6`); every mutation variant still needs an acceptance audit. |
| HARD-017 | PARTIAL | Atomic constraints exist in key mutations; complete stock-race coverage remains. |
| HARD-018 | VERIFIED | Inventory idempotency and concurrent mutation behavior are covered by the passing integration suite and atomic mutation implementation. |
| HARD-019 | VERIFIED | Inventory integration coverage passes against the disposable MongoDB replica set and Redis, including concurrent receive, reserve, and consume races. |
| HARD-020 | VERIFIED | `/api/v1/inventory/reconciliation` returns organization-scoped discrepancies for managers. |
| HARD-021 | PARTIAL | OAuth state handling now validates the browser nonce before provider exchange and has replay, same-nonce/different-state, and callback-order regression coverage (`fc9cff2`, `2938bcf`); broader controller-level integration remains. |
| HARD-022 | PARTIAL | Provider identity validation now checks cross-account collisions and database-level unique sparse provider indexes, with a focused regression test (`6846403`, `02883c3`, `de774c0`); complete linking regression suite remains. |
| HARD-023 | PARTIAL | Redis fallback remains restricted to non-production, and regression coverage now proves production increment failures propagate while development may fall back (`0e87b4c`); the complete security-state operation matrix remains. |
| HARD-024 | PARTIAL | Redis-backed limiting covers login, registration, OTP, refresh, password change, email-change verification, and billing/payment mutations (`0b06b33`, `9027a4a`, `29750c2`); all sensitive endpoint dimensions still need audit. |
| HARD-025 | PARTIAL | Authentication security tests exist; authenticated security and billing mutations have scoped HTTP rate limits (`0b06b33`, `9027a4a`, `29750c2`), OAuth identity collisions are blocked (`6846403`, `02883c3`, `de774c0`), and production CSRF/CORS invariants are covered (`42cdb15`); complete matrix remains. |
| HARD-026 | VERIFIED | Transactional outbox model, repository, indexes, and worker exist. |
| HARD-027 | PARTIAL | Critical mutation paths use transactions/outbox; complete business-event inventory remains. |
| HARD-028 | VERIFIED | Durable outbox/event workers are wired into the worker process. |
| HARD-029 | VERIFIED | Retry, attempts, error, and dead-letter behavior are implemented. |
| HARD-030 | VERIFIED | Processed-event claims provide consumer idempotency in the event worker. |
| HARD-031 | PARTIAL | Work-order transitions are guarded in reviewed paths; complete lifecycle matrix remains. |
| HARD-032 | VERIFIED | Sparse unique `WorkOrder.serviceRequestId` index exists; migration/data-duplicate handling still needs deployment-owner verification. |
| HARD-033 | PARTIAL | Work-order tests exist; required concurrency cases remain. |
| HARD-034 | PARTIAL | High-volume reads were bounded, and work-order technician candidates plus marketplace relationship/policy reads now have explicit caps (`d30a1b0`, `9eac195`); work-order attachments, time logs, parts, and facility/vendor relationship lists now have 100-record caps (`154561e`, `72a9b49`); a complete repository/query audit remains. |
| HARD-035 | PARTIAL | Vendor-performance metrics now aggregate in MongoDB (`7510c26`); SLA/report paths still need a full aggregation audit. |
| HARD-036 | PARTIAL | Indexes exist across major models; query-plan and duplicate-data verification remains. |
| HARD-037 | VERIFIED | Repeatable concurrency verification covers inventory, work orders, and billing webhook delivery; the serialized backend suite passes against disposable MongoDB replica-set and Redis services. |
| HARD-038 | PARTIAL | Critical frontend contracts were improved; full `any` audit remains. Vendor/org route shells and portal-aware navigation access are now corrected (`905a958`, `3786bab`). |
| HARD-039 | VERIFIED | Billing catalog is served by the backend and rendered by the frontend. |
| HARD-040 | PARTIAL | Route audit passes 27 entries, vendor/org route-shell and navigation role separation is covered, vendor global search is scoped to assigned work orders (`436203b`), and frontend semantic type-check/build now pass (`c23a6ce`); the full role/scope matrix remains. |
| HARD-041 | PARTIAL | Critical workflow coverage exists; complete billing/inventory/work-order/service-request matrix remains. AppHeader no longer exposes work-order/service-request creation globally (`a6ea0d5`). |
| HARD-042 | VERIFIED | Active logger emits structured JSON records with sensitive metadata redaction; focused test passes (`514c604`). |
| HARD-043 | VERIFIED | Request correlation header is generated/propagated and covered by tests; async propagation is present in event/job envelopes. |
| HARD-044 | VERIFIED | Separate liveness/readiness endpoints and dependency semantics are implemented. |
| HARD-045 | VERIFIED | Production image, health check, non-root runtime, and API/worker commands were verified. |
| HARD-046 | VERIFIED | The split repositories each enforce their own release pipeline; backend CI includes type-check, lint, build, production dependency audit, release verification, image build, disposable MongoDB/Redis integration services, and failure diagnostics (`9780f73`, `1db59b7`), while frontend CI includes lint, typecheck, tests, build, route audit, security audit, and failure diagnostics. |
| HARD-047 | VERIFIED | Full backend suite passes deterministically: 40 test files, 155 passing tests, and one intentional skip, with shared database files serialized (`b864a9a`). |
| HARD-048 | PARTIAL | Several failure modes are tested; API and worker shutdown are now idempotent under repeated termination signals (`da8b934`), but the complete failure-mode matrix remains. |
| HARD-049 | PARTIAL | Security searches and focused tests were run; final P0/P1 audit and owner review remain. |
| HARD-050 | PARTIAL | Frontend and backend release gates are green, including type-checks, builds, deterministic backend integration tests, focused billing verification (21/21), route audit, container contract, and Compose validation. Release remains open for the remaining partial security/data-integrity audits and owner-controlled deployment prerequisites. |

## Recent focused commits

- `514c604` — `fix: emit structured redacted logs`
- `b99e87c` — `fix: parse redis disable flag consistently`
- `f33d764` — `chore: add production deployment artifacts`
- `3374989` — `ci: use replica-set URI for transactional tests`
- `436203b` — `fix: scope global search for vendor users`
- `9027a4a` — `security: rate limit billing mutations`
- `29750c2` — `fix: scope billing limiter and terminal plan changes`

## Release-owner prerequisites

The deployment owner must still supply and verify managed MongoDB/Redis,
HTTPS domains, mail/storage credentials, payment webhook secrets, rotated JWT
and OAuth secrets, provider dashboard callbacks, and a clean reviewed release
tree. These cannot be fabricated safely by the implementation pass.
