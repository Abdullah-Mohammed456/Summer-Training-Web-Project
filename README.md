# NetClaks

An automotive showroom experience for exploring premium vehicles, with Firebase sign-in and a protected administrator area.

[![Build](https://github.com/Abdullah-Mohammed456/Summer-Training-Web-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Abdullah-Mohammed456/Summer-Training-Web-Project/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](tsconfig.json)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAbdullah-Mohammed456%2FSummer-Training-Web-Project)

**Live demo:** Not deployed yet. Deploy the frontend using the instructions below.

## Screenshots

Add current screenshots before release:

- Homepage: `docs/screenshots/homepage.webp`
- Vehicle catalog: `docs/screenshots/catalog.webp`
- Mobile experience: `docs/screenshots/mobile.webp`
- Optional walkthrough: `docs/screenshots/walkthrough.gif`

## Features

- Responsive vehicle showroom pages for home, about, products, and contact.
- Vehicle catalog with brand and vehicle-type filters.
- Firebase email and password authentication.
- Administrator routes protected by server-verified Firebase ID tokens and roles stored in Neon Postgres.
- Administrator user list backed by the API; vehicle, order, and dashboard views remain sample data.
- Strict server-side input validation, rate limiting, Helmet security headers, and origin allowlisting.
- Versioned PostgreSQL SQL migrations and a health endpoint for deployment checks.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, React Router |
| Authentication | Firebase Authentication |
| API | Node.js 24, Express 5, TypeScript, Zod, Helmet, express-rate-limit |
| Database | Neon Postgres, `pg`, versioned SQL migrations |
| Hosting | Vercel for the frontend, Render for the API |
| Quality | ESLint, typescript-eslint, Prettier, GitHub Actions, Dependabot |

## Architecture

```text
Browser ── Firebase Authentication ── ID token ── Render API ── Neon Postgres
   │                                               │
   └────────────── Vercel static React app ────────┘
```

Firebase handles sign-in and issues ID tokens. The Render API verifies those tokens, reads administrator roles and user profiles from Neon, and enforces access before returning protected data. The browser does not connect directly to Postgres. The product catalog and several admin dashboard sections are currently static demonstration content.

## Getting started

### Prerequisites

- Node.js 24.x and npm.
- A Firebase project with Email/Password authentication enabled.
- A Neon Postgres database for API-backed accounts and roles.

### Install and configure

```bash
git clone https://github.com/Abdullah-Mohammed456/Summer-Training-Web-Project.git
cd Summer-Training-Web-Project
npm ci
cp .env.example .env
```

Fill in `.env` using the table below. Firebase web configuration values are public client configuration; do not put service-account credentials or database credentials in `VITE_*` variables.

| Variable | Used by | Description |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Vercel | Firebase web app API key; restrict it in Google Cloud. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Vercel | Firebase Authentication domain. |
| `VITE_FIREBASE_PROJECT_ID` | Vercel | Firebase project ID. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Vercel | Firebase Storage bucket name. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Vercel | Firebase messaging sender ID. |
| `VITE_FIREBASE_APP_ID` | Vercel | Firebase web app ID. |
| `VITE_API_BASE_URL` | Vercel / local frontend | API origin, such as `http://localhost:3001` locally. |
| `DATABASE_URL` | Render API | Neon pooled Postgres URL; require TLS with `sslmode=require`. |
| `DIRECT_DATABASE_URL` | Render build / local migrations | Neon direct, non-pooled URL used by database migrations; require TLS. |
| `DATABASE_SSL` | Render API | Set to `true` in production. Use `false` only for a local database without TLS. |
| `FIREBASE_PROJECT_ID` | Render API | Same Firebase project ID used by the frontend. |
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

After an account signs in once, the API creates its profile with the default `USER` role. Grant administrator access only from a trusted SQL console, using the Firebase UID of the intended account:

```sql
UPDATE user_profiles
SET role = 'ADMIN'
WHERE firebase_uid = '<FIREBASE_UID>';
```

Do not grant roles from frontend code. Existing Firebase Realtime Database profile/role records are not copied automatically; review and migrate any records you need before switching production traffic to the Neon API.

## Deployment

### Frontend on Vercel

1. Import this repository into Vercel and keep the project root at the repository root.
2. Use the Vite framework preset, `npm run build` as the build command, and `dist` as the output directory.
3. Add all `VITE_FIREBASE_*` values and `VITE_API_BASE_URL` in Vercel Project Settings. Set the API URL to `https://netclaks-api.onrender.com` after the Render service is created.
4. Deploy and note the exact production origin, for example `https://your-project.vercel.app`.

### API on Render and database on Neon

1. Create a Neon Postgres database. Copy both its pooled connection string and its direct connection string; keep `sslmode=require` enabled.
2. Create a Render Blueprint from `render.yaml`. It defines the Node API, the `/health` check, and the database migration command.
3. In Render, set `DATABASE_URL` to the Neon pooled connection string, `DIRECT_DATABASE_URL` to the direct connection string, `FIREBASE_PROJECT_ID`, and `CORS_ALLOWED_ORIGINS` to the exact Vercel origin. `DATABASE_SSL` is set to `true` in the Blueprint.
4. Set the Vercel variable `VITE_API_BASE_URL` to the Render service origin and redeploy the frontend.
5. Sign in once with the intended administrator account, then grant its role using the SQL shown above.

The Render Blueprint marks connection strings and project-specific values as `sync: false`; supply them in Render rather than committing values. The actual Render and Vercel URLs depend on the accounts and project names chosen during setup.

## Project structure

```text
src/                       React application and Firebase client auth
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

## Roadmap

- Replace sample vehicle and order data with authenticated API-backed records.
- Connect the contact form to a validated server endpoint.
- Add automated API and frontend tests.
- Add and maintain production screenshots and a short walkthrough GIF.
- Complete a credentialed deployment and publish the live Vercel and Render URLs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the local workflow, quality checks, and security expectations.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

## Contact

For bugs or project questions, open a GitHub issue in this repository.
