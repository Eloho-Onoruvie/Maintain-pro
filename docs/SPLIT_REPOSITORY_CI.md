# Split repository CI

MaintainPro is deployed from two repositories. Keep the workflows beside the code they verify.

## Backend repository

Copy the contents of `backend/` into the backend repository root, including:

- `.github/workflows/ci.yml`
- `package.json`
- `package-lock.json`
- `src/`
- `Dockerfile`

The backend workflow starts disposable MongoDB and Redis services, then runs the backend type-check, lint, build, audit, and tests.

## Frontend repository

The current `MaintainPro` repository is the frontend repository root. Keep the workflow at the repository root, while its commands target the existing `frontend/` application directory:

- `.github/workflows/frontend-ci.yml`
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/src/`

The frontend workflow runs lint, production build, and route-audit checks.

## Running either workflow

Push the workflow to the target repository, open **Actions**, select **Backend CI** or **Frontend CI**, and choose **Run workflow**. Both workflows also run automatically on pushes and pull requests to `main` and `develop`.

The frontend should receive the deployed backend URL through its repository environment configuration, not by importing backend code or secrets.
