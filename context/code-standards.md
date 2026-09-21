# Code Standards

Convention = what new code must do. **Known drift** = what exists today and disagrees; do not copy it,
and do not fix it unless the unit says so (log it in `progress-tracker.md` instead).

## General

- Keep components and files small; split a page into section components in the same folder rather
  than growing one file (`.builder/rules/organize-ui.mdc`; see how `client/pages/AboutUs.tsx`
  composes `AboutSection`, `TeamMemberCard`, `ApproachSection`, `CallBox`).
- Fix root causes; do not layer a workaround on a symptom.
- One concern per component, hook or module: content typing in `client/lib/cms`, fetching in hooks,
  rendering in components.
- Before writing something new, open the sibling that already does it (another block, another page
  hook) and follow its shape exactly.
- No visitor-facing literal strings, image URLs or phone numbers in JSX. They come from CMS content;
  defaults live in `client/lib/cms/*PageTypes.ts`. Exceptions: `aria-label`s, loading / empty states,
  admin UI text.
- Do not add dependencies without saying why; use `pnpm add`, never `npm install` (`packageManager`
  pin, `pnpm-lock.yaml`).

## TypeScript

- The compiler is lenient (`tsconfig.json`: `strict`, `noImplicitAny`, `strictNullChecks` all
  `false`). Write code that would pass strict mode anyway: no `any`, handle `null` / `undefined`
  explicitly.
- No `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck`. `client/` has zero today; keep it that way.
- Props: `interface <ComponentName>Props { … }` declared directly above the component
  (`LayoutProps`, `PageHeroProps`, `MobileNavSheetProps`).
- `import type { … }` for type-only imports.
- Treat CMS JSON as `unknown` at the boundary: a key-presence guard plus a `merge<X>WithDefaults`
  normaliser (pattern in `client/lib/cms/publicLoaders.ts` and `client/hooks/useAboutContent.ts`).
  Never cast CMS content straight to a type.
- Closed sets are union literals (`"green" | "navy"`, `"draft" | "published"`), not `string`.

## Imports and Aliases

- `@site/…` for anything under `client/`; `@/…` for anything under `vendor/cms-core/client/`;
  `./…` inside the same folder. `@shared` exists but site code does not use it.
- Import order: `@site` components → third-party (`lucide-react`, `react-router-dom`) → `@site`
  hooks / contexts / lib → types.
- `cn` comes from `@site/lib/utils` in site code (it also exports `normalizeSlug`).
- Never cross the site ↔ engine boundary with a relative path.
- **Known drift**: 27 relative `../../../../vendor/cms-core/...` imports in
  `client/components/admin/importer/*` and `client/pages/AdminRoutes.tsx`;
  `client/components/layout/Header.tsx` and `MobileNavSheet.tsx` import `cn` from `@/lib/utils`;
  the engine imports `@site/…` in 26 places. Leave them unless asked.

## React + Vite

Public page component — canonical example `client/pages/AboutUs.tsx`; thin variant
`client/pages/PracticeAreaPage.tsx`, which delegates to `PracticePageView`:

1. Default-exported function named after the file, no props.
2. Call the page's `useXContent()` hook(s):
   `const { content, meta, title, publishedAt, updatedAt, isLoading } = useAboutContent();`
3. Early return while loading, always inside `<Layout>`:
   ```tsx
   <Layout>
     <div className="flex items-center justify-center min-h-[60vh]">
       <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
     </div>
   </Layout>
   ```
4. Optional `notFound` early return, also inside `<Layout>`.
5. Compute derived values after the guards, never inline in JSX.
6. Return `<Layout>` → `<Seo title meta pageContent publishedTime updatedTime />` →
   `<PageHero content={content.hero} headingTag={content.headingTags?.["hero.h1Title"]} compactDesktop />`
   → section components fed `content.<slice>`, each wrapped in a truthiness guard so empty CMS
   sections disappear.
7. Heading levels are CMS-controlled: pass `headingTag={content.headingTags?.["<section>.heading"]}`
   and render through `DynamicHeading`.

Content hook — canonical example `client/hooks/useAboutContent.ts`:

1. Export `interface Use<X>ContentResult { content, meta, title, publishedAt, updatedAt, isLoading, error }`.
2. Module-level cache variables plus an exported `clear<X>ContentCache()`.
3. Initial state from `consumePageData("/<route>/")` (SSG preload, `client/lib/pageDataInjection.ts`)
   → module cache → defaults; `isLoading` starts `false` when either exists.
4. One `useEffect(() => { … }, [])` with an `isMounted` flag: preload → cache →
   `await load<X>PageDocument()` from `publicLoaders.ts` → write cache → `setState`.
5. `catch`: `console.error("[use<X>Content] Error:", err)` and fall back to defaults;
   `finally`: clear `isLoading`.
6. No TanStack Query in site hooks (installed, unused) — follow the cache pattern for consistency.

Other rules:

- `<Layout>` and `<Seo>` on every public page. Admin routes stay lazy-loaded (`AppRoutes.tsx`).
- Code runs in Node during SSG (`client/entry-server.tsx`): guard `window`, `document`,
  `localStorage` behind `typeof window !== "undefined"` and never touch them at module scope.
- `suppressHydrationWarning` only on nodes whose text is swapped by DNI (phone numbers).
- Cross-page state goes in `client/contexts/`; no new global stores.
- Site settings via `useSiteSettings()` / `useGlobalPhone()` from
  `client/contexts/SiteSettingsContext.tsx`; the phone via `useDniPhone()`; never read
  `site_settings` directly in a component.
- Rich HTML from the CMS renders through `RichText` only.
- Images: `alt`, explicit `width` / `height`, `loading="lazy"` below the fold.

## Styling

- Tailwind utilities only; `cn()` for conditional classes. No CSS modules, no styled-components, no
  new global CSS except tokens in `client/global.css`.
- Colours: brand tokens `bg-brand-dark`, `bg-brand-card`, `border-brand-border`, `bg-brand-accent`,
  `text-brand-accent`, `hover:bg-brand-accent-dark`, `bg-brand-navy`, `bg-brand-navy-dark`, and shadcn
  semantic tokens (`bg-background`, `text-foreground`, `text-accent`, `text-muted-foreground`). No raw
  hex / rgb in `className` or `style`. Sanctioned exception: the hero scrim gradient in
  `client/components/shared/PageHero.tsx`.
- Fonts: `font-playfair` for headings, `font-inter` for everything else. **Never `font-outfit`** — the
  class has no definition in `tailwind.config.ts` and the font is not loaded (**known drift**: 10
  usages in 6 files, including `client/pages/AboutUs.tsx`; they render in Inter).
- Radius: `rounded-xl` for CTAs, cards, media; `rounded-full` for pills, dots, circular buttons.
  `rounded-sm` / `rounded-md` / `rounded-lg` are square because `--radius` is `0`.
- Containers: `max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]` for sections. Section rhythm
  is arbitrary pixel values with an `md:` step-up (`py-[40px] md:py-[72px]`, `py-[48px] md:py-[80px]`);
  alternate `bg-white` and `bg-brand-dark`.
- Breakpoints: `lg` (1024px) switches desktop / mobile layout everywhere; `md` is for size step-ups
  only.
- No `dark:` utilities. No Tailwind `container` class. No `!important`.
- Full token reference and recipes: `ui-context.md`.

## API Routes

- Production API = `vendor/cms-core/netlify/functions/*.ts` (protected). Development mirror =
  `server/index.ts`: `/api/*` handlers plus one dev adapter per function that imports the function
  file and adapts request / response.
- If a task needs a new or changed function, it touches the engine — stop and ask. If approved, add
  both the function and its dev adapter in the same unit.
- The public proxy `/api/public-cms` is GET-only and allow-listed by `PUBLIC_CMS_RESOURCE_PATTERN`;
  extend the regex only for resources that are safe for anonymous reads (`server/index.ts` also
  allows `cms_forms`; the vendor copy does not).
- Functions verify the caller with `supabase.auth.getUser(token)` from the `Authorization: Bearer`
  header; admin-only ones additionally read `cms_users.role`. Return `{ error: string }` JSON with
  the right status: 400 invalid input, 401 no / invalid token, 403 wrong role, 405 wrong method.
- CORS is controlled by `ALLOWED_ORIGIN` (fallback `URL`, else `*`).
- `SUPABASE_SERVICE_ROLE_KEY` is used only inside function / SSG code.

## Data and Storage

- Page content belongs in `pages.content` in the shape for its `page_type` (`architecture.md` →
  Content Model); blog posts in `posts`; global text / settings in `site_settings`; form definitions
  in `cms_forms`.
- Images go through the admin Media Library into the `media` bucket. Static brand assets shipped with
  the code live in `public/images/<category>/`.
- URL paths: `/lowercase-hyphenated/` with a trailing slash. Redirects are rows in `redirects`, not
  entries in `netlify.toml`.
- New tables or columns: edit `supabase/schema.sql` (table, indexes, RLS enable + policies, seed row
  if singleton) only when the task explicitly asks for a migration. Never insert `page_type = 'post'`
  into `pages`.
- Never delete the `site_settings` `global` row or the `blog_sidebar_settings` row.
- Browser storage is limited to the two existing keys (`bcf:dni-phone:v1`,
  `cms-form-landing-page`); wrap every read / write in try / catch.

## Testing

- Vitest 3, `pnpm test` (`vitest --run`). No `vitest.config`; aliases come from `vite.config.ts`.
- Test files are `*.spec.ts` / `*.spec.tsx`, co-located with the source
  (`client/lib/utils.spec.ts`, `client/components/Seo.spec.tsx`). Never `*.test.*`, never a
  `__tests__` folder.
- DOM tests opt in per file with `// @vitest-environment jsdom` on line 1. No `@testing-library`;
  render with `renderToString` (`react-dom/server`) or `createRoot` + `act`. Mock with
  `vi.hoisted()` + `vi.mock()`.
- Always `import { describe, it, expect, vi } from "vitest"` explicitly; no globals.
- Known and accepted: `tools/qa/scan-site.spec.ts` is a Playwright spec that Vitest also collects
  and fails on (missing `urls.json`). Every other file must pass. Run Playwright only via `pnpm qa`.
- Add or update a spec when you change logic in `client/lib/**`; UI-only changes need a manual check
  in the browser at both breakpoints.

## Formatting

- Prettier 3 with `.prettierrc` (`tabWidth: 2`, spaces, `trailingComma: "all"`; otherwise defaults:
  80 columns, double quotes, semicolons). `pnpm format.fix` formats the repo — format only the files
  you touched.
- No ESLint in this repo; `pnpm typecheck` (`tsc` with `noEmit`) is the static gate.
- Commit messages: one short imperative sentence describing the visible change (matches `git log`);
  optional body explaining why.

## File Organization

- `client/app/` — `AppRoot.tsx`, `AppProviders.tsx`, `AppRouterShell.tsx`, `AppRoutes.tsx`.
- `client/pages/` — route components, PascalCase; `client/pages/admin/` for site-specific admin pages.
- `client/components/{layout,shared,home,about,practice,blog,blocks}/` — PascalCase `.tsx`, default
  export, one component per file; helpers beside them as camelCase `.ts` (`dniReveal.ts`,
  `richTextLink.ts`).
- `client/components/ui/` — shadcn primitives, kebab-case; never added via the shadcn CLI (see
  `ui-context.md`).
- `client/components/admin/editors/` — `<Page>Editor.tsx` plus `EditorShared.tsx`;
  `client/components/admin/importer/` — `Step*.tsx` wizard steps and panels.
- `client/hooks/` — `use<X>Content.ts`, named export, one per structured page. (`use-mobile.tsx`,
  `use-toast.ts` are shadcn-generated; leave the names.)
- `client/lib/cms/` — `<page>PageTypes.ts` (types + defaults + normalisers), `publicLoaders.ts`,
  `publicFetch.ts`, `pageTemplateResolver.ts`, `formTracking.ts`, `pageMeta.ts`, `sharedHero.ts`.
- `client/lib/seo/`, `client/lib/importer/`, `client/lib/*.ts` — camelCase, named exports, spec
  beside each.
- `client/contexts/` — `<Name>Context.tsx` exporting a provider and hooks.
- `public/images/{awards,backgrounds,logos,practice-areas,team}/` — static assets by category.
- `context/` — these docs; `context/specs/` — unit specs (created with the first unit).
