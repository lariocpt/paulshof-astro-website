# Paulshof → Astro implementation plan

Repo: `~/Projects/static-websites/paulshof-astro-website`. Branch off `main` →
`feat/implement-site`, one commit per phase, `bun run verify` green before each
commit. Source of truth for scope and defects:
[docs/planning/04-implementation-handoff.md](docs/planning/04-implementation-handoff.md).

## 0. Decisions locked (owner + handoff §9)

| Item             | Decision                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Business name    | **No 5 On Franschoek** (live spelling) in `<title>`, wordmark and footer                                    |
| Fonts            | Archivo (already licensed/packaged) for body/UI + **Fraunces** (OFL) display serif, subset to WOFF2 locally |
| Photography      | Download the live site's own property photos, host locally through `astro:assets`                           |
| Duplicate routes | `/767-2/`→`/guest-book/` 301; Soweto post re-slug + 301; one canonical tour page + 301                      |
| CTA / prices     | Keep "Book Online Here" → nightsbridge `?bbid=11881`; publish **no** prices                                 |
| Reviews          | No Trustindex; publish only HTML-verified quotes (they exist in the served HTML)                            |
| Maps             | No third-party request until user action (see §2)                                                           |
| Theme            | Single ivory theme; drop `ThemeToggle` + dark token blocks, keep the token structure                        |

Working defaults for the open items (change only on instruction): no third-party
frames (CSP untouched); tour canonical `/virtual-tours/` with `/v-tours/` 301;
Soweto post at `/soweto/`; rooms named `Room 1`–`Room 7` from the verified gallery
groups (tour-page colour names stay on the tour page only); curated gallery subset
covering all nine groups; footer omits the copyright year.

## 1. Ground rules the tooling will actually enforce

- `verify-source.mjs` rejects: literal `<img>` in `.astro`/`.mdx`; `Image`/`Picture`
  without `alt`; any hex colour in `.astro`/`.mdx`/`.ts`; `src="/x.jpg"` public paths
  outside `layouts/`; `px` in `font-size|padding*|margin*|gap`; Google Fonts URLs; a
  page without `<Layout`; missing `public/fonts/OFL.txt`.
- `verify-output.ts` rejects per page: ≠1 of `main`/`h1`/`title`/`canonical`/
  `description`; heading level jumps; duplicate ids; `style=` attributes; img without
  `width`/`height`; form control without `name` or without a matching `label[for]`; any
  local link/anchor that does not resolve in `dist`; canonical origin ≠ `SITE_URL`.
- CSP is build-wide and hash-based (`scripts/csp-head.mjs`, identical on every page): no
  `unsafe-inline`, no inline `style=`, no inline `<script type="module">`. Component
  `<style>` blocks and `is:inline` JSON-LD are fine — they get hashed. Fixed order:
  build → optimize-html → CSP → precompress.
- Stylelint adds `color-no-hex`, `color-named: never`, `function-disallowed-list`
  rgb/hsl/lch/oklch in `.astro`; breakpoints in `rem`, never `px`. `astro check` fails on
  hints; ESLint/Stylelint fail on warnings.
- The Tailwind skill does not apply; `html-forms`, `image-optimization`,
  `seo-metadata` and `local-fonts` snippets are React-flavoured — take the rules, never
  the code.

## 2. Two things that block a naive implementation

1. **CSP forbids all third-party frames.** No `frame-src` means `default-src 'self'`
   blocks the Google Maps embed and the YouTube tour embeds, even behind a click-to-load
   facade. Chosen path: **no embeds** — address + turn-by-turn directions + labelled
   "Open in Google Maps / Waze / Uber" links, tour videos as labelled external links.
   Defects 3 and 20 close for free and the protected CSP stays untouched. The alternative
   (adding `frame-src` to `scripts/csp-head.mjs`) is an explicit operator-policy change
   and is not taken.
2. **Attraction imagery is third-party** (BCC/JCC/Cedar Square/Montecasino logos).
   Attraction cards are text-only; property photography only.

## 3. Phase 0 — Asset pipeline (before any CSS)

- Download the 106 gallery originals (`/wp-content/uploads/nextgen/<group>/…`) plus the
  home/room shots (`2010/11/DSC07*.jpg`, `NO-5-ON-FRANSCHOEK-2010-*.jpg`, `2026/07/IMG_*`)
  into `src/assets/property/{exterior-gardens,interior,room-1…room-7}/` with stable
  slugs. Groups/counts: Exterior & Gardens 34, Interior 10, R1 10, R2 8, R3 6, R4 15,
  R5 10, R6 7, R7 Poolside 6.
- Spike: confirm `astro:assets` transforms the imported set offline; fall back to typed
  TS manifests with explicit imports if `?metadata` globs do not resolve.
- Alt pass: batch local vision over the downloaded set → draft alt strings into
  `docs/content/photo-alt-drafts.md` for owner review. Group-level alt ships until a
  string is reviewed; nothing speculative becomes alt text.
- Fonts: subset Fraunces (OFL) to `public/fonts/fraunces-latin*.woff2`, ship its OFL
  notice beside Archivo's, preload only the latin subset.
- Brand mark: redraw `src/assets/brand/mark.svg` (no AI lettering); resync
  `public/favicon.svg`, `icon-192/512.png`, `apple-touch-icon.png`,
  `src/assets/og/default.{svg,png}` (1200×630).
- Acceptance: every asset resolves through an import; no `/public` image paths;
  `bun run build` succeeds with the image load.

## 4. Phase 1 — Tokens in CSS variables

`src/styles/global.css` only (hex is legal here, banned everywhere else).

- Repaint the role tokens to the measured brand: `--color-bg: #FAF6EF`,
  `--color-text: #282521`, burgundy `#7D252B` as accent, botanical `#445447` as a second
  accent pair; keep derived `surface`/`divider`/`hover`/`active` via `color-mix`.
- Delete the `prefers-color-scheme: dark` and `[data-theme]` blocks; one `theme-color`;
  keep `:root[data-js]` reveal gating (replace `theme-init.js` with a minimal head script
  that only sets `data-js`, so content is never hidden without JS).
- Type: `--font-heading: 'Fraunces', …serif`, `--font-sans: 'Archivo'`; add
  `--text-display-*` using bounded `clamp()`; keep the browser-relative root size.
- Shape: `--radius-sm|md` from `0` to `0.25rem`/`0.5rem`; keep `--border-width`,
  `--container-page` and the spacing scale.
- Acceptance: `bun run check && bun run lint:css` clean; no literal colour outside
  `global.css`; re-measure the shipped opaque pairs with `visual_contrast` rather than
  trusting the measured table.

## 5. Phase 2 — Layout and the main frame components

Touch `Layout.astro`, `Nav.astro`, `NavLinks.astro`, `Footer.astro`, `Seo.astro`,
`Section.astro`; rewrite `site.ts`.

- `site.ts`: real identity, `locale: 'en-ZA'`, real email, theme colours aligned to the
  tokens, `ui` labels (nav, CTA, form, footer) with contact strings byte-exact from
  handoff §2, and `navItems` = the seven real routes.
- `SiteNavigation`: opaque ivory header — compact wordmark, real links, one CTA; burger
  is a real `<button>` with `aria-label` + `aria-expanded`, Escape closes and refocuses
  the toggle, `aria-current="page"`, visible focus, init on `astro:page-load`, cleanup on
  `astro:before-swap`; readable at 320px and 200% text.
- `SiteFooter`: identity, `5 Franschoek Lane, Paulshof, Sandton, 2191`,
  `+27 (0)11 803 6064`, `nicki.cottle@mweb.co.za`, no stale "(C) 2018", no year.
- `PageIntro` (from `PageHeader`): eyebrow + one h1 + lead + optional breadcrumb.
- `BookingCallToAction`: one primary treatment, real https destination, no handler.
- Delete `ThemeToggle.astro` and the starter demo pages/collections/components.
- Acceptance (defects 2, 6, 7, 8, 12, 22): `web_check` @400 shows named links and
  `menu {opens: true, closes_on_escape: true, aria_label: set}` with focus restored;
  axe `link-name`/`meta-viewport`/`landmark-one-main` 0 nodes; no 404 favicon request.

## 6. Phase 3 — Remaining components

Each with scoped `<style>`, tokens only, states default/hover/focus-visible/active/
disabled: `PropertyHero` (photo hero, `loading="eager" fetchpriority="high"`, opaque copy
surface), `FeatureCard`/`FeatureList`, `GallerySection` (one group shell + one image
shell, `widths` + `sizes`, stable anchor ids), `AttractionCard`/`AttractionArticle` +
`AttractionList` (text-only, `headingLevel` props), `GuestFeedback` (static verified
quotes, no stars/ratings/schema reviews), `LocationPanel` (address + turn-by-turn +
directions links, no embed), `ContactPanel` + `ContactForm` (starter demo contract, never
claims a send), `RatesList` (real rates structure, no invented numbers).

Acceptance (defects 1, 3, 4, 5, 21): axe `label`, `frame-title`, `color-contrast`,
`scrollable-region-focusable` 0 nodes; `img_missing_alt` 0 on the five core pages; every
emitted `<img>` has `width`/`height`.

## 7. Phase 4 — Home page

`src/pages/index.astro` composing existing components; copy in
`src/content/pages/*.mdx` (one entry per block, `description` as the meta source of
truth): hero → welcome/hosts → the property (features + photography) → where to find us →
gallery and guest-book teasers → booking CTA. Real body copy from the captured home page.
One h1; link to `/gallery/` and `/guest-book/` instead of cloning their headings.
Acceptance: single h1/main/canonical/description, no heading jumps,
`web_find_overflows` clean at 320/400/480/768/1024/1440.

## 8. Phase 5 — Page templates for repeated designs

`AttractionPage` for the posts; `GalleryPage` (groups as `h2` + anchors, never nine h1s);
`InfoPage` for rates/map/guest-book/contact/tours with a prose measure; `ThingList` shell
for `/things-to-do/`; `404.astro` (`noindex`, out of the sitemap). MDX selectors scoped
under the owning wrapper (`.x :global(p)`), never `is:global`.

## 9. Phase 6 — Content migration and the rest of the site

- `content.config.ts`: keep `pages` (repurposed); add `attractions` (`order`, `title`,
  `description`, `summary`, `category`), `reviews` (`order`, `title`, `source`), `rooms`
  (from gallery group labels only), `tours` (room name as stated + YouTube link).
  Explicit numeric `order`; quote numeric strings.
- Migrate the 28 posts and 10 pages as typed MDX from captured text; write real meta
  descriptions (defects 14–17) — no `&nbsp;`, no shortcode blobs, no title echoes, no
  truncation.
- Routes kept 1:1: `/`, `/gallery/`, `/rates/`, `/guest-book/`, `/map/`,
  `/things-to-do/`, `/contact-us/`, `/virtual-tours/` canonical, plus the flat post
  slugs. `public/_redirects`: `/767-2/→/guest-book/`, `/v-tours/→/virtual-tours/`,
  `/hello-world/→/soweto/`.
- Build-time env on the host only: `SITE_URL`, `SITE_INDEXABLE`, `ROBOTSTXT`. Defaults
  stay unindexed and blocked until launch; never deploy as a side effect.
- Acceptance (defects 10, 11, 13, 18, 19, 20): `web_link_audit` clean, one h1 per page,
  sequential headings, no duplicate-h1 route in the sitemap.

## 10. Phase 7 — Verification and regression capture

Run against `bun run preview`, same tools and conditions as the baseline:

1. `bun run verify`.
2. `web_accessibility` @400 on the same five core pages → 0 critical/serious, moderate
   as targeted by handoff §4; re-check the 148 axe _incomplete_ colour pairs as real
   measurements.
3. `web_check` @400 → menu Escape, named links, alt coverage, no 404 or console error.
   Never submit the form.
4. `web_performance` quick @1440 on the five pages vs handoff §3 (guest-book has no
   stable baseline — state that, do not claim a win).
5. `visual_screenshots` at the audit widths plus 320/360, then `visual_compare` /
   `design_analyse` source-vs-new; `visual_contrast` on every opaque pair shipped.
6. Starter gates: keyboard order, reflow at 320px + 200% text, reduced motion,
   JavaScript off, ClientRouter A→B→A + Back/Forward + direct nested loads + hash/query
   URLs, built CSP and `_headers`.

## 11. Deferred / owner input

Owner review of `docs/content/photo-alt-drafts.md`; whether to publish prices; the exact
tour-page room naming; whether the 2011 directions PDF is re-hosted or replaced by the
HTML directions; launch-time `SITE_INDEXABLE`/`ROBOTSTXT` flip.
