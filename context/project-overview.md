# Boggs, Cowan & Fargione LLC — Website and CMS

## Overview

The public marketing website for Boggs, Cowan & Fargione LLC, a Georgia trial law firm handling
personal injury (car, truck and motorcycle accidents, slip and fall, dog bites, workplace injuries,
medical malpractice, wrongful death) and family law (divorce, child custody), plus fraud and property
disputes. The site's job is to turn searchers into phone calls and consultation requests. It ships
with a private admin panel at `/admin` where firm staff and the agency edit every page, blog post,
image, menu item and phone number without a developer. The site was built by Constellation Marketing
on their reusable "Fusion Starter" CMS template, is **live in production on Netlify**, and stores all
content in a Supabase project. This repository is in maintenance and design-iteration mode, not
greenfield development.

## Goals

1. Convert visitors into calls and consultations: a phone CTA and a "Free Consultation" button are
   visible on every page (header, hero, footer), the phone number is swapped by WhatConverts call
   tracking, and every form submission carries 13 attribution fields (UTM, click IDs, landing page,
   referrer).
2. Rank for local legal searches: every published page is pre-rendered to static HTML at build time,
   carries per-page title / description / canonical / Open Graph / schema.org data, and is listed in
   generated sitemaps with trailing-slash canonical URLs.
3. Let non-developers own the content: everything a visitor reads or sees comes from the CMS, and an
   editor can change it and publish a rebuild from `/admin` alone.
4. Keep the shared engine upgradable: `vendor/cms-core/` stays byte-identical to the agency template
   so template improvements can be pulled in without conflicts.
5. Keep quality gates green: `pnpm typecheck`, `pnpm test` and the Playwright QA scanner pass on
   every change (baseline numbers in `progress-tracker.md`).

## Core User Flow

### Visitor (the flow that makes money)

1. Lands on a pre-rendered page from search (home, a practice-area page such as
   `/practice-areas/<slug>/`, or a city landing page such as `/madison-car-accident-lawyer/`).
2. Sees the sticky header with logo, navigation and phone number over a full-bleed hero with the
   firm's headline, the attorneys' photo, a phone card and a "Free Consultation" card.
3. Scrolls through alternating white / black sections: about, practice areas grid, why choose us,
   process, Google reviews, FAQ, contact.
4. Either taps a `tel:` link (WhatConverts has already replaced the number with a tracking number
   when its script is present) or fills in the contact form.
5. The form posts to Netlify Forms with the honeypot and tracking fields; after a 2 s delay for
   analytics the visitor is redirected to `/thank-you/` (or shown the form's success message).

### Editor (the flow that keeps content current)

1. Signs in at `/admin/login` with a Supabase email + password account.
2. Opens Pages (or Posts, Forms, Media, Site Settings) and edits either a block list or a
   structured editor (home, about, contact, practice areas, practice detail, locations).
3. Saves — the change is written straight to the Supabase database and a revision snapshot is kept.
4. Clicks Publish — a Netlify build hook triggers `pnpm build:ssg`, which re-renders every published
   page to static HTML; the change is live when the build finishes.

## Features

### Public site

- Fixed routes (`client/app/AppRoutes.tsx`): `/`, `/about/`, `/practice-areas/`,
  `/practice-areas/:slug/`, `/contact/`, `/blog/`, `/blog/:slug/`, `/admin/*`, and a catch-all that
  resolves any other path against the CMS `pages` table (`client/pages/DynamicPage.tsx`).
- `/locations/` is a hard-coded special case inside the catch-all that renders the locations layout
  (`client/pages/LocationsPage.tsx`).
- CMS-driven pages: city landing pages, privacy policy, terms of service, thank-you, and any page an
  editor creates.
- Fourteen content blocks (`client/components/BlockRenderer.tsx`): hero, heading, content-section,
  cta, team-members, testimonials, contact-section, map, practice-areas-grid, recent-posts,
  locations-area, locations-map, why-choose-us, contact-form.
- Structured page templates with dedicated React sections: home, about (team grouped into
  attorneys / paralegals / office staff), contact, practice-areas overview, practice-area detail
  (hero, social proof, content sections, FAQ), locations.
- Blog: category filter, post cards, post page with sidebar (attorney image, award images).
- Header / footer navigation with three-level dropdowns; sheet navigation below 1024px.

### CMS admin (`/admin` — engine in `vendor/cms-core/`, site editors in `client/components/admin/`)

- Dashboard, Pages (create / edit / revisions / URL-change redirects), Posts and categories, Forms
  builder, Media library with image compression, Site Settings (branding, phone, navigation, footer,
  analytics, head / footer scripts, schema), Templates, Redirects, Search & Replace with audit and
  rollback, Users (invite / delete, roles `admin` and `editor`), QA Scans (triggers a GitHub Actions
  run and shows results), Bulk Import wizard for migrating content from another site with optional
  AI-assisted field mapping.

### Conversion and tracking

- WhatConverts Dynamic Number Insertion: re-scan after client-side navigation, propagate the tracking
  number to every phone occurrence, persist it for 30 days (`client/lib/whatconvertsRefresh.ts`,
  `client/lib/syncDniPhone.ts`, `client/contexts/DniPhoneContext.tsx`).
- Netlify Forms with honeypot and 13 hidden attribution fields (`client/lib/cms/formTracking.ts`).
- GA4 measurement ID, Google Ads ID / conversion label, arbitrary head and footer scripts — all set
  in Site Settings, injected by `client/components/layout/GlobalScripts.tsx`.

### SEO and delivery

- `Seo` component per page (`client/components/Seo.tsx`): title, description, canonical, OG, noindex,
  schema.org JSON-LD.
- Static-site generation of every published page and post with preloaded state for hydration
  (`vendor/cms-core/scripts/ssg-generate.ts`, `client/entry-server.tsx`).
- Generated `_redirects` (CMS redirects + SPA fallback), `robots.txt`, three sitemaps.
- Trailing-slash URL convention enforced client-side (`client/components/TrailingSlashEnforcer.tsx`)
  and in sitemaps.

### Quality

- Vitest unit tests co-located with source; `pnpm typecheck`; Prettier.
- Playwright QA scanner (`tools/qa/`) checking HTTP status, SEO tags, exactly one `<h1>`, alt text,
  broken links, phone consistency, console errors and spelling on every published URL, on desktop
  and mobile viewports.

## Scope

### In Scope

- Everything under `client/` (pages, components, hooks, content types, site-specific admin editors).
- `server/` dev adapters, `tools/qa/`, `public/images/` additions, these context docs.
- `supabase/schema.sql` **only when a migration is explicitly requested**.
- Visual and layout changes, new blocks and structured sections, new CMS field types for this site.

### Out of Scope

- Modifying `vendor/cms-core/` (the agency's shared engine) — raise it with the agency instead.
- Dark mode or a theme switcher.
- Visitor accounts, payments, client portals, live chat, internationalisation.
- Replacing Supabase, Netlify, Netlify Forms, WhatConverts or the Builder.io tooling.
- Changing the security posture (RLS policies, function authentication) without agency sign-off.
- Writing marketing copy, legal text, or choosing images — content lives in the CMS and is the
  firm's / agency's responsibility, not the codebase's.

## Success Criteria

1. `pnpm typecheck` exits 0.
2. `pnpm test` passes every file except the pre-existing collection error in
   `tools/qa/scan-site.spec.ts` (baseline counts in `progress-tracker.md`).
3. `pnpm build` (client + server bundles) exits 0.
4. Every published page renders identically when hydrated from SSG output and when loaded cold in the
   SPA at `http://localhost:8080`.
5. Exactly one phone number is visible on any page at any time.
6. No browser console errors on `/`, `/about/`, `/practice-areas/`, `/contact/`, `/blog/` at ≥ 1024px
   and < 1024px.
7. An editor can change and publish content from `/admin` without a developer.
