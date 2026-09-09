# MaintainPro engineering baseline

Recorded: 2026-09-09

This baseline is for the recovered frontend repository at commit `d1bc90f`.
The backend is maintained in its separate repository at commit `723ce32`.
The local working trees contain user changes that are intentionally not part
of this baseline commit.

## Repository model

- Frontend repository: `git@github.com:Eloho-Onoruvie/Maintain-pro.git`
- Backend repository: `git@github.com:Samuel1604/maintain_pro_backend.git`
- Branch used for baseline: `main`
- Node runtime used for checks: Node 22.11.0

## Frontend checks

Working directory: `frontend/`

| Check | Result |
| --- | --- |
| `npm run type-check` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run audit:routes` | PASS — 25 entries |
| `npm test` | NOT AVAILABLE — no test script |

## Backend checks

Working directory: `backend/`

| Check | Result |
| --- | --- |
| `npm run type-check` | PASS |
| `npm run lint` | NOT AVAILABLE — no lint script |
| `npm test` | NOT AVAILABLE — no test script |
| `npm ls --depth=0` | WARNING — installed tree contains extraneous packages |

The backend's committed baseline contains the application source and package
manifests, but does not yet expose the test/lint/release scripts required by
the master implementation plan. These are implementation tickets, not reasons
to mark the baseline green.

## Baseline conclusion

HARD-001 baseline establishment is complete with known failures recorded.
The next ticket is HARD-002: verify and formalize repository topology and the
independent source-of-truth/release boundaries before security hardening begins.
