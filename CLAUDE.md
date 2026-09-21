# Boggs, Cowan & Fargione LLC — website

Marketing website + built-in CMS admin (`/admin`) for a Georgia trial law firm (personal injury and
family law). Built by Constellation Marketing on their "Fusion Starter" template: React 18 + Vite 7 +
Tailwind 3 with site code in `client/`, a shared CMS engine in `vendor/cms-core/` (do not edit),
Supabase (Postgres + Auth + Storage) holding ALL content, and Netlify (SSG build + functions) for hosting.
Package manager: pnpm 10.14 (Node 22.x). Dev server: `pnpm dev` → http://localhost:8080.

## Application Building Context

Read the following files in order before implementing
or making any architectural decision:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/architecture.md` — system structure, boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography, and component conventions
4. `context/code-standards.md` — implementation rules and conventions
5. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the
context files, update the relevant file before continuing.

## Non-negotiables

Details and reasons are in `context/architecture.md` → Invariants.

- Local development reads the **live production database**. Never sign in to `/admin` locally,
  never run `pnpm build:ssg`, and never call the publish / search-replace / bulk-import functions
  unless the user explicitly asks for that in the current session.
- `.env` is local-only and git-ignored (since 2026-09-22). Public `VITE_*` values only; never put
  `SUPABASE_SERVICE_ROLE_KEY` or any other secret in `.env.example`, in a `VITE_*` variable, or in
  any committed file.
- `vendor/cms-core/**` is the agency's shared engine used across many sites. Do not modify it
  without explicit instruction; if a task seems to require it, stop and ask.

## Upstream docs

`AGENTS.md`, `PLAYBOOK.md`, and `SETUP.md` come from the template and are partly stale. Where they
disagree with `context/`, `context/` wins. Known disagreements:

- `@` alias resolves to `vendor/cms-core/client` (AGENTS.md says `client`; `@site` is the site alias).
- Page types include `areas-served` (PLAYBOOK §7 omits it).
- Admin navigation also has Forms, QA Scans and Bulk Import (PLAYBOOK §10 omits them).
