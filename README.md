# NetClaks — Automotive Showroom

An automotive showroom experience for exploring premium vehicles, with API-backed accounts and a protected administrator area.

[![Build](https://github.com/Abdullah-Mohammed456/Summer-Training-Web-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Abdullah-Mohammed456/Summer-Training-Web-Project/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](tsconfig.json)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAbdullah-Mohammed456%2FSummer-Training-Web-Project)

**Status:** Not publicly deployed.

## Features

- Responsive vehicle showroom pages for home, about, products, and contact.
- Vehicle catalog with brand and vehicle-type filters.
- Email and password accounts managed by the Render API, with scrypt password hashes and database-backed sessions.
- Administrator routes protected by HttpOnly session cookies and roles stored in Neon Postgres.
- Administrator user list backed by the API; vehicle, order, and dashboard views remain sample data.
- Strict server-side input validation, rate limiting, Helmet security headers, and origin allowlisting.
- Versioned PostgreSQL SQL migrations and a health endpoint for deployment checks.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, React Router |
| Authentication | Express API sessions, Node.js scrypt, HttpOnly cookies |
| API | Node.js 24, Express 5, TypeScript, Zod, Helmet, express-rate-limit |
| Database | Neon Postgres, `pg`, versioned SQL migrations |
| Hosting | Vercel for the frontend, Render for the API |
| Quality | ESLint, typescript-eslint, Prettier, GitHub Actions, Dependabot |

## Architecture

```text
Browser ── Vercel React app ── same-origin /api proxy ── Render API ── Neon Postgres
```

The browser sends same-origin API requests through Vercel rewrites. The Render API manages email/password accounts, stores only scrypt password hashes, and issues opaque HttpOnly session cookies whose hashes are stored in Neon. The API checks roles before returning protected data. The browser does not connect directly to Postgres. The product catalog and several admin dashboard sections are currently static demonstration content.

## Getting started

### Prerequisites

- Node.js 24.x and npm.
- A Neon Postgres database for API-backed accounts and roles.

### Install and configure

```bash
git clone https://github.com/Abdullah-Mohammed456/Summer-Training-Web-Project.git
cd Summer-Training-Web-Project
npm ci
cp .env.example .env
```

Fill in `.env` using the table below. The Vite development server proxies `/api` to the local Express API, so the browser does not need database credentials or authentication secrets.

| Variable | Used by | Description |
| --- | --- | --- |
| `DATABASE_URL` | Render API | Neon pooled Postgres URL; require TLS with `sslmode=require`. |
| `DIRECT_DATABASE_URL` | Render build / local migrations | Neon direct, non-pooled URL used by database migrations; require TLS. |
| `DATABASE_SSL` | Render API | Set to `true` in production. Use `false` only for a local database without TLS. |
| `CORS_ALLOWED_ORIGINS` | Render API | Comma-separated exact frontend origins, including scheme; no wildcard. |
| `PORT` | Render / local API | Render supplies this in production; local default is `3001`. |

### Run locally

Start the API in one terminal:

```bash
npm run dev:api
```

Start the Vite frontend in another terminal:

```bash
npm run dev
```

The API health check is available at `http://localhost:3001/health`. The API expects the database schema to be migrated before it can serve profile data.

### Build and quality checks

```bash
npm run lint
npm run typecheck
npm run typecheck:frontend
npm run build:frontend
npm run build
npm run preview
```

There is no automated test suite configured yet. Add unit and API integration coverage before using the admin tools with production data.

## Database and administrator setup

Build the API and apply the committed SQL migrations to the Neon database:

```bash
npm run server:build
npm run db:migrate
```

After registering the administrator account, grant its role only from a trusted SQL console, using its email address:

```sql
UPDATE user_profiles
SET role = 'ADMIN'
WHERE email = LOWER('<ADMIN_EMAIL>');
```

Do not grant roles from frontend code. Existing accounts do not migrate; users must register new accounts in the Neon-backed API.

## Deployment

### Frontend on Vercel

1. Import this repository into Vercel and keep the project root at the repository root.
2. Use the Vite framework preset, Node.js 24.x, `npm run build:frontend` as the build command, and `dist` as the output directory. The frontend-specific command type-checks the browser app and builds its static files without compiling the Express API.
3. No environment variables are required in Vercel. The `/api` rewrite in `vercel.json` proxies requests to `https://netclacks.onrender.com`.
4. Deploy and note the exact production origin, for example `https://your-project.vercel.app`. Sign-in and registration work after the Render API is deployed and its CORS origin is set.

If the Render service uses a different origin, update the `/api` rewrite destination in `vercel.json`.

### API on Render and database on Neon

1. Create a new, empty Neon Postgres database for this schema. Copy both its pooled connection string and its direct connection string; keep `sslmode=require` enabled.
2. Create a Render Blueprint from `render.yaml`. It defines the Node API, the `/health` check, and the database migration command. Set `DATABASE_URL` to the Neon pooled connection string and `DIRECT_DATABASE_URL` to the direct connection string before the first build; the build applies the migration.
3. After the Vercel deployment has a production URL, set `CORS_ALLOWED_ORIGINS` in Render to that exact origin. `DATABASE_SSL` is set to `true` in the Blueprint.
4. Register the intended administrator account from the app, then grant its role using the SQL shown above.

The Render Blueprint marks connection strings and project-specific values as `sync: false`; supply them in Render rather than committing values. The actual Render and Vercel URLs depend on the accounts and project names chosen during setup.

## Project structure

```text
src/                       React application and API-backed auth state
src/lib/api.ts             Typed API client
server/src/                Express API, authentication, validation, database access
server/migrations/         PostgreSQL schema migrations
legacy/                    Older static pages retained for reference
public/                    Static images and icons
.github/workflows/         CI checks
.github/dependabot.yml     Dependency update schedule
vercel.json                Vercel build, routing, and security headers
render.yaml                Render API service configuration
```

## Current limitations

- Vehicle, order, and some admin views use sample data.
- The contact form is not connected to an API endpoint.
- No automated test suite is configured yet.
- The app is not publicly deployed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the local workflow, quality checks, and security expectations.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

## Contact

For bugs or project questions, open a GitHub issue in this repository.
