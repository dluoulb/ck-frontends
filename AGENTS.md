# CK Frontends repository instructions

## Purpose and layout

CK Frontends is the Next.js frontend monorepo for Credit Key portals and shared UI.

- `apps/` contains application-specific components, hooks, and utilities.
- `pages/` contains Next.js routes; `shared/` contains reusable components, contexts,
  hooks, libraries, actions, and records.
- `__tests__/` contains Jest tests; `public/` contains static assets.
- `middleware.ts`, `next.config.js`, `globals.css`, and `types/` hold cross-cutting
  routing, framework, styling, and type configuration.
- `ARCHITECTURE.md` records detailed design and decisions; `graphify-out/` is a
  generated code/dependency graph and is not hand-edited.

## Local setup and runtime

Use the Node version in `.nvmrc`, then run `npm install`. The supported local route
uses Docker Compose so SuperTokens cookies work across the portal domains:

1. Start the shared `ck-ecosystem` services (`./ck-eco.sh up`) for the external
   `ck-eco-net`, DNS, and Traefik.
2. Start the related backend/auth Compose projects required by the workflow.
3. From this repository run `docker compose up` (or `docker compose up -d`).

Compose serves the Next.js development container on port 3000 and routes the local
portal subdomains through Traefik. Keep credentials and environment secrets in local
environment files; never commit them.

## Commands and completion

Before handing off a change, run the relevant checks, normally all of:

```bash
npm test
npm run lint:ci
npm run format:check
npm run build
```

Use `npm run dev` only for a direct non-Docker development server. A change is ready
when tests, lint, formatting, and build checks pass, documentation is updated when
behavior or architecture changes, and the diff contains no secrets or unrelated files.

## Implementation invariants

- Use Next.js pages/routes and TypeScript (`.ts`/`.tsx`) consistent with existing
  modules. Use the exact path aliases defined in `tsconfig.json`: `@components/*`
  → `shared/components/*`, `@contexts/*` → `shared/contexts/*`, `@hooks/*` →
  `shared/hooks/*`, `@lib/*` → `shared/lib/*`, `@records/*` →
  `shared/lib/records/*`, `@apps/reports/*` → `apps/reports/*`,
  `@apps/borrower/*` → `apps/borrower/*`, `@pages/reports/*` →
  `pages/reports/*`, and `@pages/borrower/*` → `pages/borrower/*`.
- Build functional React components with typed props and hooks. Use React Query
  for API calls and handle loading, error, and success states with user-friendly
  notifications. Use `classnames` for conditional classes.
- Keep tests in `__tests__/` using Jest and React Testing Library; mirror source
  paths, group with `describe`, use `test` (not `it`), use `waitFor` for async
  behavior, and use `customRender` from `@lib/testing/test-utils` where suitable.
- Prefer semantic HTML, accessible names, keyboard interactions, and appropriate
  ARIA attributes for interactive controls.
- Tailwind CSS is v4 with CSS-first theme tokens in `globals.css` and the
  `@tailwindcss/postcss` plugin. Use existing theme tokens and utility classes.
- Middleware performs host/subdomain routing and access redirects. Preserve full
  return URLs when changing authentication redirects.
- SuperTokens provides the shared SSO session across frontend domains. Preserve its
  client initialization, cookie/access-token handling, and protected-route behavior;
  do not bypass authentication except through existing, explicitly configured local
  or deployment environment behavior.
- Do not modify `shared/components/Scripts.tsx`; it contains third-party analytics
  scripts. Never commit secrets or API keys; use environment variables, sanitize
  untrusted input, and follow OWASP security practices.
- Do not commit `package-lock.json` unless `package.json` also changes; use plain
  `npm install` for intentional dependency updates.

## Documentation and Graphify

Start with [README.md](README.md) for setup and usage, and consult
[ARCHITECTURE.md](ARCHITECTURE.md) for system detail. Use the official
[Next.js documentation](https://nextjs.org/docs), [TypeScript documentation](https://www.typescriptlang.org/docs/),
[Tailwind documentation](https://tailwindcss.com/docs), and
[SuperTokens documentation](https://supertokens.com/docs) as needed.

For unfamiliar codebase or dependency work, query the committed `graphify-out/`
artifacts first, then verify findings against source. The scheduled/manual
`.github/workflows/graphify-refresh.yml` workflow maintains those artifacts; rerun
the configured Graphify refresh when a versioned graph artifact must change, and
include the generated update deliberately.

Keep this file as the concise canonical repository guidance. Put detailed design
explanations in `ARCHITECTURE.md`, not here.

When architecture, dependencies, structure, auth, routing, state, data flow, or
deployment changes, update `ARCHITECTURE.md`, its Last Updated date, and relevant
architectural decisions. Verify tests, lint, formatting, and build before handoff.
