# AI Workflow Rules

## Approach

Build incrementally against written specs on a **live, brownfield** site. The context files define
what exists, how it fits together, and the rules; `progress-tracker.md` defines where things stand.
Always implement against them — do not infer product behaviour, visual decisions or content from
memory or from other law-firm sites.

- Read `CLAUDE.md` and the six context files at the start of every session, in the listed order.
- Prefer changes inside `client/`. The engine (`vendor/cms-core/`) and the schema are protected.
- "Match the existing style" means: open the sibling component and `ui-context.md`, then copy the
  recipe.
- When code and these docs disagree, verify in code, then fix the doc in the same unit.

## Scoping Rules

- Work on one feature unit at a time: one page, one section, one block, or one hook.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.
- No drive-by fixes of documented drift (`code-standards.md`, `ui-context.md` → Known drift). If you
  notice new drift, add it to `progress-tracker.md` → Next Up and move on.
- No new dependencies unless the spec names them and says why. Use `pnpm add`; commit the lockfile
  change with the code.
- Do not reformat, re-order imports in, or "clean up" files you were not asked to change.

## When to Split Work

Split an implementation step if it combines:

- A visual change and a content-type change — type in `client/lib/cms/*PageTypes.ts`, admin editor
  in `client/components/admin/editors/`, public renderer: three boundaries.
- Anything in `client/` with anything in `vendor/cms-core/` or `supabase/schema.sql`.
- Changes to fetch / preload / SSG plumbing (`publicFetch.ts`, `publicLoaders.ts`, `preloadState.ts`,
  `entry-server.tsx`) with feature work.
- More than about three pages, or a shared component (`PageHero`, `Header`, `Footer`, `Layout`) with
  page-specific work.

If a change cannot be verified end to end in the browser and with `pnpm test` within a few minutes,
the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent copy, headlines, phone numbers, addresses, legal text, or images. They live in the
  CMS. Use the existing `default*Content` fallbacks or leave the section guarded-off when empty.
- Do not invent visual decisions. Unspecified spacing, colour, radius or type resolve to
  `ui-context.md`; if the token is missing there, add an Open Question — do not pick a hex value.
- Before editing a page's content structure, confirm its `page_type` and current shape
  (`architecture.md` → Content Model); if unclear, ask.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before
  continuing.

## Protected Files

Do not modify the following unless explicitly instructed in the current session:

- `vendor/cms-core/**` — the agency's shared CMS engine; local edits break template upgrades.
  Includes the production Netlify functions and the SSG script.
- `client/components/ui/**`, `client/hooks/use-mobile.tsx`, `client/hooks/use-toast.ts` —
  shadcn-generated primitives. If one is missing, copy it by hand from
  `vendor/cms-core/client/components/ui/`; never run the shadcn CLI.
- `supabase/schema.sql` — production schema; only for an explicitly requested migration, always with
  RLS policies.
- `netlify.toml`, `.github/workflows/qa-scan.yml`, `.builder/rules/*.mdc`, `.mise.toml`, `.npmrc` —
  deploy, CI and agent configuration owned by the agency.
- `.env` (local, ignored) and `.env.example` (committed) — never add secrets; never commit `.env`.
- The hidden `<form name="contact" netlify …>` block in `index.html` — Netlify Forms bot detection;
  removing it silently breaks form intake.
- `public/images/**` — client-supplied brand assets; add files, do not alter or delete existing ones.
- `pnpm-lock.yaml` — changes only through `pnpm add` / `pnpm remove`.
- `AGENTS.md`, `PLAYBOOK.md`, `SETUP.md` — upstream template docs; corrections go into `context/`,
  not into them.

## Live Production Rules

The dev environment reads the **production** Supabase project through the anon key in `.env`. There
is no development database yet.

- Never sign in to `/admin` from a local dev server unless the user asks for it in the current
  session; every save writes to the live database immediately.
- Never run `pnpm build:ssg`, and never call the `publish`, `search-replace`, `bulk-import`,
  `invite-user` or `delete-user` functions from local, unless asked. `pnpm dev`, `pnpm test`,
  `pnpm typecheck` and `pnpm build` are safe: they only read from the database.
- Never write `SUPABASE_SERVICE_ROLE_KEY` into `.env.example` or any committed file. If a task truly
  needs it locally, the user provides it, it goes into the ignored `.env` or the shell for that
  session only, and the session note records that it was used.
- Treat the database as read-only from this machine. If a task requires writes (new pages, template
  edits, settings), ask for a separate development Supabase project first (`SETUP.md` §2–5) and record
  the decision in `progress-tracker.md`.
- Git: work on a feature or docs branch, never directly on `main`; commit when a unit is verified;
  never push or open a pull request unless the user asks.

## Keeping Docs in Sync

Update the relevant context file in the same unit whenever implementation changes:

- System architecture, boundaries, data flow, environment variables, deploy → `architecture.md`.
- Content model (page types, shapes, blocks) → `architecture.md` → Content Model, and
  `project-overview.md` → Features.
- Storage model decisions → `architecture.md` → Storage Model.
- Code conventions or standards, resolved drift → `code-standards.md`.
- Tokens, recipes, component APIs, resolved visual drift → `ui-context.md`.
- Feature scope → `project-overview.md`.
- Always: `progress-tracker.md` (Completed / In Progress / Next Up / Session Notes).

## Specs

No `context/specs/` folder exists yet. When the first unit of work is defined:

1. Create `context/specs/00-build-plan.md` — a numbered list of units in build order (unit number,
   name, what it builds, dependencies).
2. Create one spec per unit, `context/specs/NN-<kebab-name>.md`, with exactly these sections:
   **Goal** (1–2 sentences), **Design** (reference `ui-context.md` tokens), **Implementation** (one
   sub-section per component or boundary), **Dependencies** (packages, with reason), **Verify when
   done** (checklist including the items below).
3. Work each unit with three prompts: implement ("Read `context/specs/NN-….md`. Mark it in progress
   in `progress-tracker.md`. Implement exactly as specified. Do not go beyond the scope of this
   unit."), correct ("The [element] does not match the spec. Expected … Current … Fix only this."),
   close ("Implementation is complete and verified. Mark unit NN complete in
   `progress-tracker.md`.").

## Before Moving to the Next Unit

1. The unit works end to end within its defined scope, in the browser at `http://localhost:8080`,
   at ≥ 1024px and < 1024px, with a clean console.
2. Exactly one phone number renders on any touched page; header, hero, footer and body agree.
3. No invariant in `architecture.md` was violated; `git status` shows no change under
   `vendor/cms-core/`.
4. `pnpm typecheck` exits 0.
5. `pnpm test` passes every file except `tools/qa/scan-site.spec.ts` (baseline in
   `progress-tracker.md`).
6. `pnpm build` passes.
7. `progress-tracker.md` reflects the completed work; any changed convention is reflected in its
   context file.
8. Only intended files changed (`git status --short`); no `dist/`, `tools/qa/urls.json` or `.env`
   in the diff.
