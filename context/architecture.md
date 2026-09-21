# Architecture Context

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | React 18 + TypeScript (`client/App.tsx`) | SPA that also renders in Node for static generation |
| Build | Vite 7 — `vite.config.ts` (client + dev server), `vite.config.server.ts` (Node server bundle) | Bundling, HMR, alias resolution, `VITE_*` inlining |
| Routing | React Router 6 (`client/app/AppRoutes.tsx`) | Fixed routes with trailing slashes + CMS catch-all |
| Styling | Tailwind CSS 3 + shadcn/Radix primitives + `tailwindcss-animate` + `@tailwindcss/typography` | Utility classes, brand tokens, accessible primitives |
| Rich text | TipTap 3 (`client/components/admin/RichTextEditor.tsx`) | Admin-only editing of HTML fields |
| Data fetching | `client/lib/cms/publicFetch.ts` → `publicLoaders.ts` + per-page hooks with module caches | Public reads. TanStack Query is installed but not used by site hooks |
| Dev backend | Express 5 mounted inside Vite (`server/index.ts`, plugin in `vite.config.ts`) | Mirrors the production functions on the same port 8080 |
| Prod backend | Netlify Functions (`vendor/cms-core/netlify/functions/*.ts`) | API proxy, publish, users, import, QA, sitemaps |
| Database | Supabase Postgres with Row Level Security (`supabase/schema.sql`) | All content, settings, users, revisions |
| Auth | Supabase Auth, email + password | Admin sign-in; role from `cms_users` |
| File storage | Supabase Storage bucket `media` | Uploaded images / PDFs |
| Forms | Netlify Forms (POST to `/` with `form-name`) | Contact form intake |
| Tracking | WhatConverts DNI, GA4, Google Ads (scripts injected from Site Settings) | Attribution |
| Pre-render | `vendor/cms-core/scripts/ssg-generate.ts` + `client/entry-server.tsx` | Static HTML per published page and post |
| Tests | Vitest 3 (`*.spec.ts(x)`), Playwright 1.58 (`tools/qa/`) | Unit tests; site QA scanner |
| Tooling | pnpm 10.14.0, Node 22.x (`.mise.toml`), Prettier 3, no ESLint | Install, format, typecheck (`tsc`) |
| Hosting | Netlify (`netlify.toml`) | Build `npm run build:ssg`, publish `dist/spa`, headers, redirects |

## Path Aliases

Defined in `tsconfig.json` and `vite.config.ts`. The server build (`vite.config.server.ts`) maps `@`
differently on purpose (`PLAYBOOK.md` §1).

| Alias | Client build / typecheck | Server build | Use for |
| --- | --- | --- | --- |
| `@site/*` | `client/*` | — | Site code (pages, components, hooks, lib) |
| `@/*` | `vendor/cms-core/client/*` | `client/*` | CMS engine code (admin pages, `lib/supabase`, `lib/database.types`) |
| `@shared/*` | `vendor/cms-core/shared/*` | `shared/*` | Shared API types (unused by site code) |

## System Boundaries

Site code — edit within the rules in `code-standards.md`:

- `client/app/` — providers (`AppProviders.tsx`), router shell (scroll reset, trailing slash, global scripts, DNI manager), route table.
- `client/pages/` — one component per route. `DynamicPage.tsx` resolves CMS pages and the `/locations/` special case; `AdminRoutes.tsx` lazy-loads the admin.
- `client/components/layout/` — `Layout`, `Header`, `Footer`, `MobileNavSheet`, `NavDropdown`, `GlobalScripts`, `WcDniManager`.
- `client/components/shared/` — `PageHero`, `HeroContactActions`, `CmsFormRenderer`, `RichText`, `DynamicHeading`, `PhoneLink`, `CallBox`, `StatsGrid`, `ApproachSection`.
- `client/components/{home,about,practice,blog}/` — section components for the structured pages.
- `client/components/blocks/` + `client/components/BlockRenderer.tsx` — renderers for block-array pages.
- `client/components/admin/editors/` — structured-page editors mounted inside the engine's admin; `client/components/admin/importer/` — bulk-import wizard UI.
- `client/components/ui/` — the site's copy of the shadcn primitives (see `ui-context.md`).
- `client/hooks/` — `useXContent` hooks, one per structured page, plus `useCmsForm`.
- `client/lib/cms/` — content types with defaults (`*PageTypes.ts`), `publicLoaders.ts`, `publicFetch.ts`, `pageTemplateResolver.ts`, `formTracking.ts`, `formPreload.ts`, `routePreload.ts`.
- `client/lib/preloadState.ts`, `client/lib/pageDataInjection.ts` — SSG preload state; `client/lib/blocks.ts` — the site's block union.
- `client/lib/seo/`, `client/lib/importer/`, `client/lib/dniPhoneState.ts`, `client/lib/syncDniPhone.ts`, `client/lib/whatconvertsRefresh.ts`.
- `client/contexts/` — `SiteSettingsContext`, `DniPhoneContext`.
- `client/global.css`, `tailwind.config.ts`, `index.html` — theme tokens, fonts, hidden Netlify form.
- `server/` — dev-only Express: `/api/*`, one dev adapter per Netlify function, sitemaps (`server/lib/generateSitemap.ts`). Never deployed.
- `supabase/schema.sql` — the whole schema, RLS, storage bucket, seed rows.
- `public/images/{awards,backgrounds,logos,practice-areas,team}/`, `public/robots.txt`, `public/favicon.ico`.
- `tools/qa/` — Playwright scanner; `.github/workflows/qa-scan.yml` — manual CI run of it.

Engine code — read, do not edit (see `ai-workflow-rules.md` → Protected Files):

- `vendor/cms-core/client/` — admin pages (`pages/admin/*`), admin components (`BlockEditor`, `ImageUploader`, `MediaPickerDialog`, `RevisionPanel`, `URLChangeRedirectModal`, `AdminSidebar`), `lib/database.types.ts`, `lib/supabase.ts`, `hooks/useUserRole.ts`, `hooks/useSiteSettings.ts`.
- `vendor/cms-core/netlify/functions/` — the production API. `_shared.cjs` is legacy Builder.io code and is not imported anywhere.
- `vendor/cms-core/scripts/ssg-generate.ts` — the pre-render script.

Dead or legacy:

- `netlify/functions/api.ts` (repo root) — not the deployed functions dir (`netlify.toml` points at vendor); unused.
- `shared/api.ts`, `vendor/cms-core/server/index.ts` — template leftovers.
- `.builder/rules/*.mdc` — Builder.io agent rules (deploy via MCP; keep components small). Informational only.

## Runtime Data Flow

Development (`pnpm dev`, one port):

1. Vite serves `index.html` → `client/App.tsx`; the Express plugin mounts `server/index.ts` on the same port.
2. A page component calls its `useXContent()` hook → `client/lib/cms/publicLoaders.ts` → `publicFetch.ts`.
3. `fetchRestRows()` in the browser tries **direct Supabase REST** (`${VITE_SUPABASE_URL}/rest/v1/...` with the anon key) first and falls back to the same-origin proxy `/api/public-cms?resource=...`. During SSR/SSG it goes direct only and returns `[]` when unconfigured.
4. The proxy allow-lists resources with `PUBLIC_CMS_RESOURCE_PATTERN` (`server/index.ts`; production copy in `vendor/cms-core/netlify/functions/api.ts`) and forwards with the anon key. Anything else → 400; non-GET → 405.
5. Admin pages use `supabase-js` (`vendor/cms-core/client/lib/supabase.ts`) directly with the signed-in session; privileged actions call `/.netlify/functions/<name>`, which `server/index.ts` emulates by importing the function file and adapting the request.

Production (Netlify):

1. `npm run build:ssg` = `vite build` → `dist/spa`, then `tsx vendor/cms-core/scripts/ssg-generate.ts`.
2. The SSG script (service-role client) loads site settings, every published `pages` and `posts` row, renders each route through `client/entry-server.tsx`, and writes `dist/spa/<path>/index.html` (root → `index.html`, posts → `blog/<slug>/index.html`) with `<script>window.__CMS_PRELOADED_STATE__=…</script>` and Helmet head tags injected. Strictly sequential; exits 1 on any query error.
3. It also writes `dist/spa/_redirects` (sitemap and `/api/*` function routes, enabled CMS `redirects`, then `/* /index.html 200`) and `dist/spa/robots.txt` (`Disallow: /` when `site_noindex` is set). No `404.html` — unknown paths hit the SPA shell and `client/pages/DynamicPage.tsx` renders `NotFound`.
4. In the browser `client/App.tsx` hydrates only if `#root` already has children **and** a preloaded state exists; otherwise it renders fresh. Preloaded state is only reused when its `route.urlPath` matches the current path (`client/lib/preloadState.ts`), so client-side navigation never shows stale data.
5. Publish button → `publish` function → `NETLIFY_BUILD_HOOK_URL` → new build. Without that variable the button does nothing visible.

## Storage Model

- **Database (Supabase Postgres)** — the single source of truth for content and configuration (`supabase/schema.sql`):
  - Content: `pages` (`page_id` int, `url_path` unique, `page_type`, `content` jsonb, `status`, SEO columns), `posts` (`slug` unique, `content` blocks and `body` HTML, `category_id`), `post_categories`, `templates` (default content per page type).
  - Settings singletons: `site_settings` (one row, `settings_key = 'global'`: branding, phone, navigation, footer, analytics, scripts, schema, favicon), `blog_sidebar_settings` (one row).
  - Media index: `media` (file name / path / public URL / size / mime / alt) for objects in the storage bucket.
  - Users: `cms_users` (`user_id` → `role`), joined to Supabase `auth.users`.
  - History: `page_revisions` (full-row snapshots written by the admin UI, not by triggers), `search_replace_audit` (per-field undo log).
  - Forms: `cms_forms` (`name` = Netlify form name, `fields` jsonb, success message, redirect URL).
  - Importer (admin-only): `import_mapping_presets`, `import_recipes`, `import_migration_sessions`, `import_jobs`, `import_job_items`.
  - View `site_settings_public` exposes an allow-list of `site_settings` columns (hides `updated_by`); the proxy reads the view.
  - Triggers only maintain `updated_at`. Redirect-on-URL-change and revision snapshots are application code (`URLChangeRedirectModal.tsx`, `RevisionPanel.tsx`).
- **File storage (Supabase bucket `media`)** — public, 50 MB limit, `image/jpeg|png|gif|webp|svg+xml` and `application/pdf`; anyone can read, `authenticated` can write. Uploaded through the admin Media Library, which compresses images first (`vendor/cms-core/client/lib/imageCompression.ts`).
- **Static assets (`public/images/`)** — brand assets shipped with the code: awards, backgrounds, logos, practice-area images, team photos. Referenced by CMS content as `/images/...` paths.
- **Browser storage** — `localStorage` `bcf:dni-phone:v1` (detected tracking number, 30-day TTL, hostname-stamped; `client/lib/dniPhoneState.ts`); `sessionStorage` `cms-form-landing-page` (first URL of the session for form attribution). Nothing else is persisted client-side.
- **No server-side cache.** Site hooks keep module-level caches for the lifetime of the page load only.

## Content Model

| `page_type` | Allowed in `pages`? | `content` shape | Rendered by |
| --- | --- | --- | --- |
| `standard` | yes | `ContentBlock[]` — except the four seeded rows `/`, `/about/`, `/contact/`, `/practice-areas/`, which store structured objects | `BlockRenderer` / dedicated route components |
| `landing` | yes | `ContentBlock[]` | `BlockRenderer` via `DynamicPage` |
| `practice` | yes | `{ hero, socialProof, contentSections, faq, headingTags? }` | `PracticePageView` |
| `areas-served` | yes | same structured shape as `practice` | `PracticePageView` |
| `post` | **no** (CHECK constraint) — `templates` only | blocks + `body` HTML, in the `posts` table | `BlogPost` |

- Structured content types and their defaults live in `client/lib/cms/*PageTypes.ts`: home `{hero, partnerLogos, about, practiceAreasIntro, practiceAreas, whyChooseUs, testimonials, process, googleReviews, faq, contact}`; about `{hero, story, team, approach, values, stats, whyChooseUs, cta}` (team members carry a `category` of attorney / paralegal / staff, grouped by `groupTeamMembers`); contact `{hero, form}`; practice-areas overview `{hero, grid, whyChoose, approach, cta}`; practice detail `{hero, socialProof, contentSections, faq}`; all with optional `headingTags`.
- `/locations/` is not a page type. `client/pages/DynamicPage.tsx` special-cases that path and renders `LocationsPage` with `{hero, locationsArea, locationsMap, whyChooseUs, contact}`.
- Shape detection is duck-typed: `client/lib/cms/pageTemplateResolver.ts` returns `practice` for `practice` / `areas-served` or when the content has practice keys; `isRenderablePageContent` accepts `null`, a block array, or any plain object. A mis-shaped practice page silently renders defaults; it does not throw.
- Block union: the engine's `vendor/cms-core/client/lib/database.types.ts` defines 10 block types; the site extends it in `client/lib/blocks.ts`, and `client/components/BlockRenderer.tsx` renders 14 (`locations-area`, `locations-map`, `why-choose-us`, `contact-form` are site-only). Unknown types fall back to `LegacyBlock`; a non-array object falls through to `StructuredPagePreview`.
- URL paths: lowercase, hyphenated, leading and trailing slash (`vendor/cms-core/client/pages/admin/pageUrlPath.ts`); duplicates get `-2`, `-3`. Post slugs are stored with a trailing slash and normalised on read.

## Auth and Access Model

- **Sign-in**: `/admin/login` uses `supabase.auth.signInWithPassword`; "Forgot password" uses `resetPasswordForEmail` with redirect to `/admin/reset-password`. New editors are invited by an admin through the `invite-user` function (Supabase `auth.admin`), which also inserts the `cms_users` row.
- **Roles**: `cms_users.role ∈ {admin, editor}`, default `editor`. `vendor/cms-core/client/hooks/useUserRole.ts` reads it once per session and caches by user id. A signed-in user with **no** `cms_users` row gets `role = null` without an error: admin-only navigation disappears, but the session is still `authenticated`.
- **Row Level Security** (enabled on every table):
  - Anonymous (anon key): read published `pages` and `posts`; read *all* rows of `templates`, `site_settings`, `media`, `post_categories`, `blog_sidebar_settings`, `cms_forms`, and enabled `redirects`. The public site depends on these policies.
  - Any `authenticated` user: insert / update / delete on every content table (`pages`, `posts`, `post_categories`, `templates`, `redirects`, `site_settings`, `media`, `page_revisions`, `cms_forms`, `search_replace_audit`; update on `blog_sidebar_settings`).
  - `is_cms_admin()` (SECURITY DEFINER) required for: writes to `cms_users`, all access to the five `import_*` tables.
- **Netlify functions**: `invite-user`, `delete-user`, `bulk-import`, `bulk-import-fetch`, `ai-migration-assist` verify the bearer JWT **and** require `cms_users.role = 'admin'`. `publish`, `search-replace`, `trigger-qa` verify the JWT only. `qa-list-runs`, `qa-get-latest-run`, `qa-run-status`, `qa-report`, `sitemap*`, `api` accept anonymous callers. Functions use the service-role key server-side; the browser never receives it.
- **Admin UI gating**: `AdminSidebar.tsx` hides Redirects, Search & Replace, QA Scans, Bulk Import, Templates and Users from editors; the routes in `client/pages/AdminRoutes.tsx` have no role guard of their own.

Enforcement reality — documented posture, do not change unprompted; raise with the agency if it matters:

- The admin / editor distinction is enforced in the sidebar and in five functions, not in RLS. Every authenticated account, including one with no `cms_users` row, can write all content tables through `supabase-js`.
- `publish`, `search-replace` and `trigger-qa` accept any valid Supabase JWT.
- Admin-only admin pages are reachable by URL for editors; their privileged actions still fail server-side where a function checks the role.

## Environments and Variables

| Variable | Public? | Read by | Purpose |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | yes (inlined into the bundle) | browser, SSG, functions, dev server | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | yes | same | Anonymous read access; also the browser auth client |
| `SUPABASE_SERVICE_ROLE_KEY` | **secret** | SSG script, Netlify functions only | Bypasses RLS; never in the browser |
| `SITE_URL` / `VITE_SITE_URL` | yes | SSG and sitemaps / `Seo` canonical fallback | Production origin, no trailing slash |
| `ALLOWED_ORIGIN` | yes | functions, dev server CORS | Restricts CORS; unset = permissive |
| `NETLIFY_BUILD_HOOK_URL` | treat as secret | `publish` function | Publish button → rebuild |
| `GITHUB_QA_TOKEN`, `GITHUB_REPOSITORY` | secret | `trigger-qa`, `qa-*` functions | Dispatch / read the QA workflow |
| `OPENAI_API_KEY` | secret | `ai-migration-assist` | Optional importer assist |
| `VITE_QA_BASE_URL` | yes | `tools/qa` | Scan target (default `http://localhost:8080`) |
| `URL` | — | Netlify-provided | Site origin inside functions |
| `PING_MESSAGE` | yes | `/api/ping` | Template leftover |
| `ADMIN_PASSWORD` | — | `_shared.cjs` (dead code) | Legacy; do not set |

- `.env` is **local-only and git-ignored** since 2026-09-22 (commit `4179d07`; before that it was committed). `.env.example` is the committed template — public placeholders only. Vite inlines every `VITE_*` value into the public JavaScript, so a `VITE_` prefix means "visible to every visitor".
- The local `.env` points at the **production** Supabase project (URL + anon key) plus `SITE_URL=http://localhost:8080`. There is no separate development database.
- Netlify holds the production values in Site Settings → Environment variables; Builder.io projects hold their own copy (`SETUP.md` §5).

## Build and Deploy

- `pnpm dev` — Vite + Express on http://localhost:8080.
- `pnpm build` — `vite build` (→ `dist/spa`) then `vite build --config vite.config.server.ts` (→ `dist/server/node-build.mjs`, run with `pnpm start` on port 3000). Not what Netlify runs.
- `pnpm build:ssg` — what Netlify runs: client build, then the SSG script. Needs all three Supabase variables.
- `netlify.toml`: publish `dist/spa`, functions `vendor/cms-core/netlify/functions`, esbuild bundler with `express` external; forced redirects `/sitemap*.xml` and `/api/*` → functions, then `/* → /index.html`; security headers including a CSP that allows `https:` scripts / frames so CMS-injected trackers work; long-cache headers for hashed assets, `must-revalidate` for HTML.
- `pnpm qa` — prefetch published URLs from the CMS into `tools/qa/urls.json`, then Playwright desktop + mobile scan; `qa-scan.yml` runs the same on demand from GitHub Actions or from the admin QA page.
- `dist/`, `tools/qa/urls.json`, `tools/qa/reports/`, `tools/qa/screenshots/` are generated and ignored; never commit them.

## Invariants

1. **Secrets never reach the browser or the repo.** No secret in a `VITE_*` variable, in `.env.example`, or in any committed file; `SUPABASE_SERVICE_ROLE_KEY` lives in Netlify's environment and, when a task truly needs it locally, only in the ignored `.env` or the shell for that session. Why: `vite.config.ts` inlines `VITE_*` into public JS. Enforced by `.gitignore` and review.
2. **`vendor/cms-core/**` is not modified without explicit instruction.** Why: it is the agency's shared engine; local edits block template upgrades (`PLAYBOOK.md` §15).
3. **Visitor-facing copy, images, phone numbers and navigation come from the CMS.** Code holds structure and fallbacks (`client/lib/cms/*PageTypes.ts` `default*Content`) only. Why: editors must be able to change anything without a deploy.
4. **Public pages never import `@supabase/supabase-js`.** They read through `client/lib/cms/publicFetch.ts` / `publicLoaders.ts` with the anon key; only admin and importer code uses the client. Why: keeps the public bundle small and the read path SSR-safe.
5. **A page's `content` shape matches its `page_type`** (`practice` / `areas-served` → structured object; `standard` / `landing` → `ContentBlock[]`, except the four seeded structured routes). Never mix. Why: the admin editor and `pageTemplateResolver.ts` pick the editor / renderer from the shape (`PLAYBOOK.md` pitfall 5).
6. **Every URL path is lowercase, hyphenated, and ends with `/`** (root excepted). Why: `TrailingSlashEnforcer.tsx`, `pageUrlPath.ts`, sitemaps and canonicals all assume it; a mismatch creates duplicate URLs for search engines.
7. **Every public page renders both hydrated from `window.__CMS_PRELOADED_STATE__` and cold in the SPA.** New page code is SSR-safe: no `window` / `document` at module scope or during render without a guard. Why: SSG renders in Node (`client/entry-server.tsx`); hydration mismatches surface as console errors.
8. **The site is single-theme.** No `dark:` utilities, no theme toggle; the `.dark` block in `client/global.css` is inert. Why: the brand is fixed black / white / green; the dark tokens are unbranded shadcn defaults.
9. **Exactly one phone number is visible at a time.** The WhatConverts tracking number wins when present and different from the canonical; otherwise the CMS number. Why: call attribution and the QA scanner's phone-consistency check (`client/contexts/DniPhoneContext.tsx`, `client/lib/syncDniPhone.ts`).
10. **The `site_settings` row `global` and the `blog_sidebar_settings` row must exist.** Why: the app crashes without them (`PLAYBOOK.md` pitfalls 1–2). Never delete or rename them.
11. **Build outputs are never hand-edited or committed** — `dist/**` (including the generated `_redirects` and `robots.txt` there), `tools/qa/urls.json`, reports, screenshots. Why: all are regenerated by `ssg-generate.ts` or `pnpm qa`. `public/robots.txt` is the source fallback and is fine to edit.
12. **Production functions and dev adapters stay in lock-step.** Every function in `vendor/cms-core/netlify/functions/` has a matching dev route in `server/index.ts`, and vice-versa. Why: dev must behave like prod for admin flows.
13. **No schema change without updating `supabase/schema.sql` including RLS policies**, and `page_type = 'post'` is never inserted into `pages`. Why: the SQL file is the only record of the production schema; the CHECK constraint rejects `post`.
14. **From a developer machine the production database is read-only.** No `/admin` sign-in, no `pnpm build:ssg`, no publish / search-replace / bulk-import calls, unless the user explicitly asks in the current session. Why: there is no development database; every authenticated write lands on the live site.
