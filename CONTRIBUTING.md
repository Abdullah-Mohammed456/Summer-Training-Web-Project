# Contributing

Thank you for contributing to NetClaks.

## Development workflow

1. Create a focused branch from the current default branch.
2. Use Node.js 24.x and npm, then run `npm ci`.
3. Copy `.env.example` to `.env` and configure Firebase and database values locally. Never commit `.env` files.
4. Run the frontend and API in separate terminals with `npm run dev` and `npm run dev:api`.
5. Before opening a pull request, run:

   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

6. Explain the user-visible behavior, configuration changes, and any database migration in the pull request.

## Code expectations

- Keep TypeScript strict. Prefer explicit domain types and runtime validation over `any` or type suppression.
- Validate all untrusted API input with Zod and use parameterized SQL queries.
- Keep authorization checks on the server. Frontend route guards are for navigation only.
- Do not place private credentials in source files, browser environment variables, screenshots, or pull request output.
- Preserve accessible labels, keyboard focus, semantic HTML, responsive behavior, and reduced-motion support.
- Keep changes focused and update the README when scripts, environment variables, architecture, or deployment steps change.

## Database changes

- Add a reviewed, numbered SQL migration under `server/migrations/`.
- Do not edit an already-applied migration; create a new migration instead.
- Use `DIRECT_DATABASE_URL` for migrations and `DATABASE_URL` for application connections.
- Never include real connection strings, user data, or credentials in migration files.

## Issues and pull requests

Use GitHub issues for bugs and feature proposals. Pull requests should include a concise summary, verification results, and screenshots only when a visual change is intentionally requested.
