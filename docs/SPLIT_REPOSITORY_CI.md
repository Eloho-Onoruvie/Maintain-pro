# MaintainPro repository and CI boundary

MaintainPro is intentionally split into two repositories. Each repository owns
its code, workflow, dependencies, secrets, deployment, and release history.

## Frontend repository (this repository)

- Contains `frontend/`, frontend documentation, and `.github/workflows/frontend-ci.yml`.
- Validates deterministic install, lint, type-check, tests, production build,
  and route audit.
- Receives only the deployed API base URL through frontend environment
  configuration.
- Does not track `backend/`, backend secrets, backend deployment files, or
  backend CI.

## Backend repository

- Contains its own API, worker, container configuration, documentation, and
  `.github/workflows/ci.yml`.
- Validates deterministic install, type-check, lint, build, dependency audit,
  MongoDB/Redis-backed tests, and production container build.
- Owns all server-side and provider credentials.

Do not copy source files, workflows, or secrets between repositories. Cross
repository compatibility is enforced through the versioned HTTP API contract
and deployed-environment smoke tests.
