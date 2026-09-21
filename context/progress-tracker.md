# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Live in production on Netlify. Maintenance and UI / design iteration — not greenfield.
- Local development environment set up 2026-09-21; six-file context system added 2026-09-22 on
  branch `docs/six-file-context`.

## Current Goal

- UI / design tweaks. Specific units are still to be defined with the user; the first one becomes
  `context/specs/01-<name>.md` (see `ai-workflow-rules.md` → Specs).

## Completed

- 2026-09-21 — Local setup: repo cloned, `pnpm install`, Supabase URL + anon key added to `.env`,
  `pnpm dev` verified at http://localhost:8080 showing live content, typecheck clean.
- 2026-09-22 — Upstream (PR #1, `fix/UI-updations-with-docs`, merged into `main` as `38fa303`):
  stopped tracking `.env` and added it to `.gitignore` (`4179d07`); About page team grouped into
  attorneys / paralegals / office staff with per-member `category`, `groupTeamMembers`, and a new
  `client/lib/cms/aboutPageTypes.spec.ts` (`5982202`); more space above later team groups
  (`10018c1`).
- 2026-09-22 — Six-file context system: `CLAUDE.md` + `context/` written from a verified read of the
  code; `AGENTS.md`, `PLAYBOOK.md`, `SETUP.md` left untouched.
- Shipped by the agency before hand-over (Aug 2026, from `git log`): 50 / 50 hero split on all
  side-image pages, About page attorney images at natural proportions, footer "By Appointment Only",
  experience badge on the About image, footer dropdowns opening upward, LOCATIONS page + editor +
  blocks.

## In Progress

- None.

## Next Up

- UI / design tweaks — awaiting the list of pages and changes from the user. Each becomes one spec.
- Optional low-risk drift fixes (pick only when asked; each is its own unit):
  - `font-outfit`: 10 usages in 6 files with no font behind them. Decide: load Outfit in
    `index.html` + `tailwind.config.ts`, or replace with `font-inter`.
  - `components.json` `tailwind.css` points at the non-existent `client/index.css`
    (real file `client/global.css`); aliases point at the vendor tree.
  - 27 relative `../../../../vendor/cms-core/...` imports in `client/components/admin/importer/*`
    and `client/pages/AdminRoutes.tsx` → `@/...`.
  - `cn` imported from `@/lib/utils` in `Header.tsx` and `MobileNavSheet.tsx` → `@site/lib/utils`.
  - `npx update-browserslist-db@latest` (Vite warns the data is 13 months old).

## Open Questions

- Which UI / design tweaks, on which pages, and is there a design reference (Figma, screenshots)?
- Create a separate development Supabase project so `/admin` can be used locally without touching
  production? (`SETUP.md` §2–5 describes the steps.)
- Should the documented enforcement gaps (admin / editor not enforced in RLS; `publish`,
  `search-replace`, `trigger-qa` accept any JWT; admin routes unguarded) be raised with Constellation
  Marketing? Documented posture only — not a task.
- Node: the project pins 22.x (`.mise.toml`); this machine runs 26 and prints an engine warning on
  every pnpm command. Install 22 via a version manager, or accept the warning?
- Is `NETLIFY_BUILD_HOOK_URL` ever needed locally? (Probably not — publishing from local is out of
  scope by the live-production rules.)

## Architecture Decisions

- 2026-09-22 — `context/` is the source of truth for AI sessions; `AGENTS.md`, `PLAYBOOK.md`,
  `SETUP.md` stay untouched as upstream template docs and are overridden where they conflict.
- 2026-09-22 — Six core context files only; `context/specs/` is created with the first unit of work.
- 2026-09-22 — The developer machine treats the production database as read-only: no `/admin`
  sign-in, no `build:ssg`, no publish from local, unless explicitly asked.
- 2026-09-22 — `SUPABASE_SERVICE_ROLE_KEY` is never written to a committed file; `.env` is ignored
  (upstream decision `4179d07`) and `.env.example` holds placeholders only.
- 2026-09-22 — `vendor/cms-core/**` is protected; changes needed there are raised with the agency.
- Branch workflow observed in the repo: feature branches (`fix/...`, `docs/...`) → pull request →
  merged into `main` by a teammate. Nothing is committed directly on `main`.

## Session Notes

- Start: `pnpm dev` → http://localhost:8080 (Vite + Express on one port). The engine-version warning
  from pnpm is harmless.
- Baseline gates (2026-09-22): `pnpm typecheck` exits 0; `pnpm test` → 19 files, 18 pass, 242 tests
  pass; the single failing file `tools/qa/scan-site.spec.ts` is the Playwright spec Vitest collects
  by mistake (needs `urls.json`) — expected, not a regression.
- `.env` (ignored) holds `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` for the **production**
  project plus `SITE_URL` / `VITE_SITE_URL` / `VITE_QA_BASE_URL = http://localhost:8080`. No
  service-role key on this machine.
- If pages render with placeholder text and a black hero, the CMS proxy is returning 500 — check the
  two Supabase values in `.env` and restart `pnpm dev` (the server reads `.env` only at startup).
- Admin is at http://localhost:8080/admin — do **not** sign in from local (live database).
- `.claude/settings.local.json` exists locally for the desktop app; it is ignored by git.
