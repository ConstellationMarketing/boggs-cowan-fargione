# UI Context

## Theme

Single light theme with black "brand" sections. White content sections (`bg-white`) alternate with
black ones (`bg-brand-dark` / `bg-black`); text is black on white and white on black; the only accent
is the firm's green (`#2C8F34`) used for eyebrows, icons, dividers and CTAs, with navy as a secondary
CTA tone. Serif display headings (Playfair Display) over a clean sans body (Inter). The header is
transparent over the hero and turns near-black on scroll.

There is **no dark mode**. `client/global.css` contains a `.dark` block, but it is the untouched
shadcn slate default, nothing ever adds the `dark` class, and its tokens contradict the brand. Never
add `dark:` utilities or a theme toggle.

## Colors

shadcn semantic tokens — CSS custom properties in `client/global.css` `:root` (bare HSL triplets),
mapped to Tailwind classes in `tailwind.config.ts`:

| Role | CSS variable | HSL | ≈ Hex | Tailwind |
| --- | --- | --- | --- | --- |
| Page background | `--background` | `0 0% 100%` | `#FFFFFF` | `bg-background` |
| Text | `--foreground` | `0 0% 0%` | `#000000` | `text-foreground` |
| Card / popover surface | `--card`, `--popover` | `0 0% 100%` | `#FFFFFF` | `bg-card`, `bg-popover` |
| Primary (buttons) | `--primary` | `0 0% 0%` | `#000000` | `bg-primary` (black button) |
| Secondary = brand green | `--secondary` | `125 53% 37%` | `#2C8F34` | `bg-secondary` |
| Accent = brand green | `--accent` | `125 53% 37%` | `#2C8F34` | `text-accent`, `bg-accent` |
| Muted surface / text | `--muted`, `--muted-foreground` | `0 0% 96.1%`, `0 0% 45%` | `#F5F5F5`, `#737373` | `bg-muted`, `text-muted-foreground` |
| Border / input | `--border`, `--input` | `0 0% 90%` | `#E6E6E6` | `border-border`, `border-input` |
| Focus ring | `--ring` | `0 0% 0%` | `#000000` | `ring-ring` |
| Destructive | `--destructive` | `0 84.2% 60.2%` | `#EF4444` | `bg-destructive` |
| Radius | `--radius` | `0` | — | see Border Radius |
| Sidebar (admin only) | `--sidebar-*` | shadcn defaults | — | `bg-sidebar…` |

Brand tokens — literal values under `theme.extend.colors` in `tailwind.config.ts`:

| Token | Value | Use |
| --- | --- | --- |
| `brand-dark` | `rgb(0, 0, 0)` | Page / section background for dark sections (`Layout` root, hero, footer) |
| `brand-card` | `rgb(0, 0, 0)` | Card surface inside dark sections (partner-logo strip) |
| `brand-border` | `rgb(230, 230, 230)` | Hairline borders on light and dark cards |
| `brand-accent` | `rgb(44, 143, 52)` = `#2C8F34` | Green CTAs, eyebrows, icons, footer divider, loader |
| `brand-accent-dark` | `rgb(44, 143, 52)` | Intentionally identical ("only one green"); used as hover, visually a no-op |
| `brand-navy` | `#1F3A5F` | Navy CTA tone |
| `brand-navy-dark` | `#182F4D` | Navy CTA hover |

Rules: tokens only — no raw hex / rgb in `className` or `style`. Text on dark uses `text-white`,
`text-white/85` (body), `text-white/60` (tertiary); text on light uses `text-black`, `text-black/80`.
The one sanctioned inline colour is the hero scrim gradient (see Imagery).

## Typography

| Role | Font | Weights loaded | Tailwind class | Where |
| --- | --- | --- | --- | --- |
| Headings, hero headline | Playfair Display | 600 | `font-playfair` | `h2` / `h3` / `h4`, hero `<p>` headline (44 usages) |
| Body, nav, buttons, labels, phone numbers | Inter | 400 / 600 / 700 / 800 | `font-inter` (also `font-sans`) | everything else (123 usages) |
| Code (admin only) | system mono | — | `font-mono` | importer / editors |

Fonts load from Google Fonts in `index.html` (non-blocking `media="print"` swap with a `<noscript>`
fallback). There are **no** `body` or heading font rules in `client/global.css` `@layer base`; the
font is set per element with a class, so every heading needs `font-playfair` explicitly.

Recipes — copy exactly:

- Section heading: `font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px]`
  plus `text-black` on white or `text-white` on dark. Used in `client/pages/AboutUs.tsx`,
  `client/components/home/PracticeAreasSection.tsx`, `client/components/home/FaqSection.tsx`, most
  blocks.
- Alternate heading: `font-playfair text-[34px] leading-[1.08] md:text-[52px]`
  (`client/components/home/ProcessSection.tsx`, `AboutSection.tsx`, `AwardsSection.tsx`).
- Hero headline: `font-playfair font-light leading-[1.2] text-white text-[clamp(2.5rem,7vw,68.8px)]`;
  compact pages `text-[clamp(2rem,5vw,50px)]` (`client/components/shared/PageHero.tsx`). Highlighted
  words wrap in `<span className="text-brand-accent">`.
- Eyebrow / section label: `text-[18px] md:text-[20px] font-medium tracking-wider uppercase text-accent`
  — write it with `font-inter` (the originals use the dead `font-outfit`, see Known Visual Drift).
- Nav link: `font-inter text-[16px] text-white hover:opacity-80 transition-opacity`.
- Body on dark: `text-white/85`, `max-w-[720px]`; CTA text `font-inter text-[16px] md:text-[18px] font-medium`.
- Sizes are explicit pixels (`text-[16px]`), not the Tailwind scale; line heights are explicit too.
- Rich HTML from the CMS: `RichText` with `[&_h2]:font-playfair [&_h3]:font-playfair` child
  selectors (`client/components/blocks/ContentSectionBlock.tsx`).

## Border Radius

`--radius` is `0`, so shadcn's `rounded-lg` / `rounded-md` / `rounded-sm` all compute to **0px**
(square). Only literal Tailwind values round anything.

| Context | Class | Notes |
| --- | --- | --- |
| CTAs, cards, card media, icon chips, form submit | `rounded-xl` (12px) | The site radius — 45 usages in marketing components |
| Pills, badges, timeline dots, circular icon buttons, carousel arrows | `rounded-full` | e.g. footer "Visit Our Office" chip, `h-9 w-9` icon buttons |
| Footer location band / map iframe | `rounded-[28px]` / `rounded-[24px]` | One-off, `client/components/layout/Footer.tsx` only |
| shadcn primitives (`Button`, `Input`, `Dialog`, `Sheet`) | `rounded-md` / `rounded-lg` | Render square on this site — intentional |
| Mobile nav footer trigger | `rounded-none` | Explicitly square |

New UI: `rounded-xl` for anything card- or button-like, `rounded-full` for anything circular. Do not
introduce `rounded-2xl` or new arbitrary radii.

## Spacing and Containers

- Page wrapper (`client/components/layout/Layout.tsx`): `min-h-screen flex flex-col bg-brand-dark` →
  `<Header />` → `<main className="flex-1">` → `<Footer />`. No gutter at this level; every section
  supplies its own.
- Section container: `max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]` (14 usages, the
  default). Variants: `… lg:w-[80%]` (About CTA, a few blocks), `… md:w-[90%]` only, or
  `max-w-[2560px] mx-auto w-[95%]` for hero content. Inner clamps where needed: `max-w-[1080px]`,
  `max-w-[1200px]`, `max-w-[1600px]`.
- Header (`client/components/layout/Header.tsx`): full-bleed, `px-4 sm:px-5 md:px-6 lg:px-[30px]`,
  no max-width.
- Footer (`client/components/layout/Footer.tsx`):
  `mx-auto flex w-[92%] max-w-[1200px] flex-col items-center text-center`.
- Section vertical rhythm — arbitrary px with an `md:` step-up: `py-[40px] md:py-[72px]`,
  `py-[48px] md:py-[80px]`, `py-[40px] md:py-[60px]`; heading-to-content gaps `mb-[20px] md:mb-[30px]`;
  group gaps `mt-[70px] md:mt-[110px]`.
- Grids: `flex flex-wrap justify-center gap-6 md:gap-8` with
  `w-full md:w-[calc(50%-16px)] lg:w-[calc((100%-64px)/3)]` cards (team), or
  `grid grid-cols-1 sm:grid-cols-2 gap-3` (hero CTAs).
- Breakpoints: `lg` (1024px) is the desktop / mobile switch (`hidden lg:flex` nav, `lg:hidden` sheet
  trigger, `lg:flex-row` hero). `md` (768px) only steps sizes up. The Tailwind `container` utility is
  configured but **unused** — do not start using it.
- Hero heights: `min-h-[80vh]`, `-mt-[10rem]` so it sits under the transparent header,
  `pt-[12.5rem] md:pt-[13.5rem]`; `compactDesktop` adds `lg:min-h-[700px] lg:pt-[234px] lg:pb-[100px]`.

## Component Library

shadcn/ui (Radix primitives + Tailwind) with `cn()` from `clsx` + `tailwind-merge`.

- The site's copy lives in `client/components/ui/` (48 kebab-case files); the engine's copy in
  `vendor/cms-core/client/components/ui/` serves the admin. They differ only in `button.tsx` (site
  uses `rounded-lg`; both render square). New site code imports primitives from
  `@site/components/ui/*`. **Known drift**: `MobileNavSheet` imports `Button` and `Sheet` from
  `@/components/ui/*` (the vendor copy) — equivalent markup, leave it.
- **Do not run `npx shadcn add`.** `components.json` points `tailwind.css` at `client/index.css`
  (does not exist; the real file is `client/global.css`) and all aliases at `@/` = the vendor tree, so
  the CLI would write into `vendor/cms-core/`. Copy a primitive file from the vendor `ui/` folder by
  hand instead.
- `Button` (`client/components/ui/button.tsx`): variants `default` (black), `secondary` (green),
  `outline`, `ghost`, `destructive`, `link`; sizes `default h-10 px-4`, `sm h-9 px-3`, `lg h-11 px-8`,
  `icon h-10 w-10`. Used in admin UI and `MobileNavSheet` (ghost icon trigger). Marketing CTAs do
  **not** use `Button`.
- Marketing CTA recipe — anchors / divs with a `"green" | "navy"` tone prop (`ctaTone` on `PageHero`
  and `HeroContactActions`; `buttonTone` on `AboutSection`, `ContactUsSection`, `PracticeAreasGrid`,
  `CmsFormRenderer`; the site value is `homepageButtonTone = "green"` in `client/pages/Index.tsx`):
  - green: `inline-flex min-h-[46px] items-center justify-center rounded-xl bg-brand-accent px-6 font-inter text-[16px] font-medium text-white transition-colors duration-300 hover:bg-brand-accent-dark`
    (`client/components/home/PracticeAreasGrid.tsx`); large variant
    `min-h-[56px] px-6 md:px-8 text-[16px] md:text-[18px]`.
  - navy: same with `bg-brand-navy hover:bg-brand-navy-dark`.
  - form submit (`client/components/shared/CmsFormRenderer.tsx`, `getSubmitButtonClassName`):
    `h-[56px] w-full rounded-xl border border-brand-accent bg-brand-accent text-[18px] font-medium text-white …`.
- `PageHero` (`client/components/shared/PageHero.tsx`) — the one hero for every page. Props:
  `content: SharedHeroContent`, `headingTag`, `underHeader` (default `true`; pulls the hero under the
  transparent header), `ctaTone` (default `"green"`), `compactDesktop` (**use on every page except
  the homepage**), `hideMobileImage`, `compactMobile`, `awardLogos`. Layout at `lg`: 50 / 50
  two-column (`lg:w-[48.5%]` text + side-image column, `lg:gap-[3%]`); text-only heroes widen to
  `lg:w-[65.667%]`. Renders `HeroContactActions` (phone card + "Free Consultation" card in a
  `grid-cols-1 sm:grid-cols-2 gap-3`). Blocks pass `underHeader={false}`.
- `Header`: sticky, `z-50`, transparent → `bg-black/95 py-2` after 50px scroll; logo
  `<img className="brightness-0 invert …">` (white via filter); desktop nav `hidden lg:flex` with
  `NavDropdown` for children; phone `PhoneLink` with `<Phone strokeWidth={1.5} />`;
  `MobileNavSheet variant="header"` below `lg`.
- `Footer`: single centred column — logo, tagline (`RichText`), phone, description, optional
  address / map band, nav (sheet below `lg`), `h-px w-[80%] bg-brand-accent` divider, disclaimer,
  legal links, copyright with a `{year}` token.
- `MobileNavSheet`: Radix `Sheet` from the right, `bg-black text-white border-white/10`, three levels
  stepping `text-[20px]` → `text-[17px]` → `text-[15px]` and `text-white` → `text-white/80` →
  `text-white/60`, chevrons `rotate-180` when open.
- Shared bits: `Loader2` (`h-8 w-8 animate-spin text-brand-accent`, centred in `min-h-[60vh]`),
  `RichText` (CMS HTML), `DynamicHeading` (CMS-chosen tag), `PhoneLink` (`tel:` + DNI-safe), `CallBox`
  (icon + title + subtitle card, `variant="dark"`), `StatsGrid`, `TeamMemberCard`, `PracticeAreaCard`.
- Toasts: `sonner` + shadcn `Toaster`, both mounted in `client/app/AppProviders.tsx`.
- Carousel: `embla-carousel-react` (testimonials, badges). Accordion: Radix (FAQ).

## Layout Patterns

- Page = transparent `Header` over a full-bleed black hero → alternating white / black full-width
  sections, each with its own container → black `Footer`.
- Hero = left text column (eyebrow → Playfair headline → `RichText` intro → CTA pair → optional award
  tiles) + right image column at `lg`; below `lg` the image stacks under the text (or is hidden with
  `hideMobileImage`). The background photo sits behind a left-to-right black scrim.
- Structured pages compose named sections in a fixed order (see each `client/pages/*.tsx`); every
  section is guarded by a truthiness check so empty CMS data removes it.
- Block pages render `BlockRenderer` over `pages.content` in order.
- Cards: white or black surface, `border border-brand-border` (light) or `border-white/10` (dark),
  `rounded-xl`, icon chip top-left, heading + copy, optional link.
- Contact section = `CmsFormRenderer` (left) + `CallBox` / phone card (right) at `md:flex-row`.
- FAQ = Radix accordion; testimonials = Embla carousel with `rounded-full` arrows; process = vertical
  timeline with `rounded-full h-3.5 w-3.5` dots.
- Blog: hero → category filter → `BlogPostCard` grid; post page → hero → prose + `BlogSidebar`
  (attorney image, award images).
- Admin (engine): `AdminLayout` with `AdminSidebar`; site editors render inside it.

## Icons

- `lucide-react` only (site: 83 files; engine: 37). No other icon set is installed — do not add one.
- Sizes: `h-4 w-4` inline / default (109 usages), `h-5 w-5` in buttons and chips, `h-6 w-6` /
  `h-7 w-7` header and footer phone, `h-8 w-8` loader. Write `h-N w-N` (that order).
- Decorative icons pass `strokeWidth={1.5}`.
- `client/global.css` forces `fill: none; stroke: currentColor` on lucide SVGs — icons take their
  colour from `text-*` classes (`text-accent`, `text-white`).

## Imagery

- CMS images come from the Supabase `media` bucket as absolute public URLs, or from
  `public/images/<category>/` for shipped brand assets (`awards/`, `backgrounds/`, `logos/`,
  `practice-areas/`, `team/`). Always `alt` (from CMS `imageAlt`), explicit `width` / `height`,
  `loading="lazy"` below the fold.
- Logo: always rendered white on dark via `brightness-0 invert`; header widths
  `w-[210px] … xl:w-[380px]` (unscrolled) → `w-[175px] … xl:w-[280px]` (scrolled); footer
  `w-[320px] md:w-[420px]`.
- Hero background scrim (the only inline colour allowed):
  `linear-gradient(90deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.60) 100%), url(<image>)`;
  optional credit `text-[10px] text-white/35` bottom-right.
- Side / attorney images: `object-contain object-bottom`, `max-h-[320px] sm:max-h-[420px]` on
  mobile; natural proportions on the About page.
- Award tiles: `h-[64px] w-[96px] rounded-xl bg-white p-2`.
- Missing team photos fall back to a generated SVG placeholder (`createBlankAvatar` in
  `client/pages/AboutUs.tsx`).

## Known Visual Drift

Exists in the code today. Do not copy into new work; do not fix unless a unit asks for it.

- `font-outfit` — 10 usages in 6 files (`client/components/shared/PageHero.tsx`,
  `client/components/shared/ApproachSection.tsx`,
  `client/components/practice/PracticeAreasOverviewGrid.tsx`, `client/pages/AboutUs.tsx`,
  `client/pages/PracticeAreaPage.tsx`, `client/pages/NotFound.tsx`) — has no entry in
  `tailwind.config.ts` and Outfit is not loaded, so it silently renders Inter. Decision pending: load
  Outfit or replace with `font-inter` (`progress-tracker.md`).
- `brand-accent-dark` equals `brand-accent`, so `hover:bg-brand-accent-dark` produces no hover change.
- shadcn primitives render square (`--radius: 0`) while site cards use `rounded-xl` — accepted.
- Icon size classes appear in both orders (`h-8 w-8` dominant; `w-8 h-8` in a few hero / header files).
- The `.dark` token block is unbranded and unused.
- Tailwind `container` is configured (`center`, `padding: 2rem`, `2xl: 1400px`) and never used.
