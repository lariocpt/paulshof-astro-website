# Implementation handoff

Planning/design phase complete; implementation is a separate phase. This file is the
handoff: evidence index, baselines, defects to pass, design system spec, direction,
route plan, phases and open owner decisions. Every number is traceable to a file;
"05" = [05-before-state-report.md](05-before-state-report.md), "audit" =
[coverage-audit.md](coverage-audit.md).

## 1. Evidence index

Completed captures and saved evidence. Nothing was re-run for this file.

Repo, `docs/planning/`:

| Artifact                               | What it is                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `00-evidence.md`                       | Scope, capture method, widths, conditions                                                                           |
| `01-style-guide-and-critique.md`       | Computed-CSS observed system, grounded critique, proposed direction                                                 |
| `02-components.md`                     | Proposed component inventory and ownership                                                                          |
| `03-brand-guideline.md`                | Proposed brand guideline, colour tokens, measured contrast                                                          |
| `05-before-state-report.md`            | Verified business facts, defects, perf baseline, route inventory, conditions                                        |
| `coverage-audit.md`                    | Job inventory, tile reconciliation, boundary audit, sitemap recheck                                                 |
| `capture-manifest.json`                | 646-entry campaign manifest (658 image files)                                                                       |
| `vision-review.md`                     | Raw vision report of job `20261026-001905-4e61e931d150` (RTX 3060 Ti); machine-generated, editorial review required |
| `evidence/a11y-mobile-400.json`        | axe WCAG 2.0/2.1 A/AA, 5 pages @400px, reduced motion, no interaction                                               |
| `evidence/web-check-mobile-400.json`   | Behavioural check, 5 pages @400px (console, requests, menu, Tab, forms, links, meta)                                |
| `evidence/perf-quick-*.json` (5 files) | quick-mode perf, 1 run each, 1440px, 100-request cap                                                                |
| `evidence/screens-400/` (5 JPEGs)      | 400px screenshots of the 5 core pages                                                                               |
| `reference-images/`                    | `home-400.jpg`, `home-1440.jpg` (copied from capture jobs)                                                          |

Repo, `docs/designs/`:

| Artifact                                           | What it is                                                                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `homepage-concept.png`, `brand-system-concept.png` | qwen-image 1024×1024 concepts, one coherent direction; art direction only, lettering known-bad, not brand assets or amenity evidence |
| `prompts.json`                                     | Exact prompts and seeds (20261027, 20261028)                                                                                         |
| `generation-evidence.json`                         | Generation time, output paths, chat-restore evidence                                                                                 |
| `README.md`                                        | Provenance and usage limits for the concepts                                                                                         |

Job artifact root `~/.local/share/lario-images/jobs/` (screenshot + analysis jobs on
mini-mobile; paths in the audit's `captures.json`/`request.json` are authoritative):

| Job                            | Kind        | Captures  | Notes                                                                                                 |
| ------------------------------ | ----------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `20261026-000817-f9dc5d5746c3` | screenshots | 2         | Initial probe: home @400/1440 (superseded by campaign)                                                |
| `20261026-001547-f48f85eae877` | screenshots | 256       | Campaign batch 1                                                                                      |
| `20261026-001547-5897b9a63194` | screenshots | 48        | Campaign batch 2                                                                                      |
| `20261026-002046-06181c68bd43` | screenshots | 252       | Campaign batch 3                                                                                      |
| `20261026-002046-011ce253eb86` | screenshots | 90        | Campaign batch 4                                                                                      |
| `20261026-002802-8cbfa9e89525` | screenshots | 5         | Tiled recapture: gallery @400/479/480/576/1920                                                        |
| `20261026-002802-eafa8a81803b` | screenshots | 6         | Tiled recapture: things-to-do @400/479/480/576/600/767                                                |
| `20261026-012253-0fef28777414` | screenshots | 192       | Supplemental: 32 URLs @481/575/601/769/783/1000                                                       |
| `20261026-012436-247b60a63538` | screenshots | 36        | Supplemental: remaining 6 URLs, same widths                                                           |
| `20261026-192633-9941d7e55f71` | screenshots | 18        | Boundary recapture: guest-book/, 767-2/, virtual-tours/ @319/320/321/639/640/641, `reload_each_width` |
| `20261026-001732-787e3a1e5006` | analysis    | 2 images  | Vision of the initial-probe pair (home @400/1440)                                                     |
| `20261026-001905-4e61e931d150` | analysis    | 12 images | Vision of 6 pages @400/1440; saved as `vision-review.md`                                              |
| `20261026-034541-319502a1eeba` | analysis    | 10 images | Vision of 5 pages @400/1440; colour claims contaminated (see §2)                                      |

Excluded (Beast Code localhost `192.168.10.243:4321`, never Paulshof; in the same job
root, do not cite): `20261026-062136-82aca1831568`, `20261026-085216-3fc3315a46e4`,
`20261026-085216-e7262dc543f6`.

Temporary, not in the repo (named in 05 §1, re-fetch if needed): `src/{home,contact,
rates,guestbook,things,map,bryanston,montecasino-bird}.html` (8 snapshots),
`live-{home,contact,map,767-2}-20261026.html`, `sitemap-recheck-20261026.json`, all
under `/tmp/opencode/paulshof/`. The link-audit output is a tool-output file, path
cited in 05 defect 13.

## 2. Coverage and limitations

Full audit: [coverage-audit.md](coverage-audit.md). Summary, all figures from the audit:

- **874 unique page/width combinations** across **23 widths**; zero failed captures;
  tile reconciliation exact (646 primaries + 12 continuation tiles = 658 files).
- Saved CSS metadata exposes 16 width thresholds; **literal B−1/B/B+1 gaps exist** and
  are listed in the audit, not claimed covered: single-pixel probes still uncaptured
  478, 577, 599, 766, 781, 978, 981, 990, 993, 998, 1198, 1201. 981 is the only literal
  direction gap with a plausible layout effect (max-width direction of 980).
- The 320/640 groups were captured on the 3 affected pages (job
  `20261026-192633-9941d7e55f71`); height jumps there correlate with Trustindex widget
  hydration, not layout. No site layout switch is demonstrated at 320 or 640.
- Guest-book DOM/height/request counts are widget-state-dependent; both perf runs never
  fired `load`. Use neither guest-book run as a stable baseline (05 §4).
- 5 core pages have a11y + behavioural evidence; the other 30 sitemap URLs are
  screenshot-only — a11y/keyboard state untested (05 §7).
- The 9 homepage boundary comparisons and the contact/rates OCR runs were **attempted,
  not saved as artifacts**; their exact-text-verification purpose was instead satisfied
  by direct HTML verification (the 8 `src/` snapshots + 4 `live-*.html` fetches). Do not
  re-run OCR.
- Headless `ERR_ABORTED` entries (Google Maps embed, home hero `.mp4`, GA collect) are
  capture-side aborts, not verified live defects (05 §7).

## 3. Baselines for before/after comparison

Performance (05 §4; `web_performance` quick mode, 1 run, 1440px, 100-request cap;
`evidence/perf-quick-*.json`):

| Page           | TTFB ms | DCL ms | load ms              | idle ms | Requests  | Bytes     | DOM nodes |
| -------------- | ------- | ------ | -------------------- | ------- | --------- | --------- | --------- |
| /              | 752     | 1275   | 2733                 | 3212    | 74        | 2,590,253 | 430       |
| /rates/        | 724     | 1201   | 2606                 | 2843    | 63        | 1,420,659 | 368       |
| /contact-us/   | 801     | 1297   | 2733                 | 3124    | 67        | 1,910,577 | 392       |
| /guest-book/   | 787     | 1321   | — (load never fired) | 2744    | 100 (cap) | 3,002,525 | 1894      |
| /things-to-do/ | 849     | 1516   | 2856                 | 3040    | 100 (cap) | 2,814,874 | 802       |

Caveats: the two capped rows undercount requests/bytes; the 1440px numbers do not
describe mobile load; guest-book is widget-state-dependent (a second isolated run,
TTFB 820 / DCL 1491 / 84 req / ~2,584 KB / DOM 1751, exists in the session rollout
jsonl cited in 05 §4 — keep both, treat neither as stable). In-file flags: home
`video-poster.jpg` 532 KB; guest-book large DOM, 42 images missing width/height, one
322 KB tripadvisor avatar.

Accessibility (axe @400px, 5 pages; `evidence/a11y-mobile-400.json`; per-page node
counts): **66 violation nodes** — / 10, /rates/ 8, /contact-us/ 14, /guest-book/ 18,
/things-to-do/ 16. By impact: critical 5 (form labels, /contact-us/), serious 20
(link-name 15, frame-title 2, color-contrast 2, scrollable-region-focusable 1),
moderate 41 (region 29, meta-viewport 5, landmark-one-main 5, heading-order 2).
Axe _incomplete_ (indeterminate, not violations): color-contrast 148, frame-tested 2,
video-caption 1. Behavioural baseline (`evidence/web-check-mobile-400.json`): mobile
menu `opens: true, closes_on_escape: false, aria_label: null` on all 5 pages; images
missing alt: home 5/16, rates 5/14, contact 5/15, guest-book 15/448, things-to-do 5/42.

## 4. Prioritized, reproducible defects

Kept in 05 §3 severity order. "Fix" is the acceptance test the implementation must
pass on the same tool and conditions (web_accessibility / web_check @400px, fresh
headless Chromium, no interaction; snapshot greps noted).

1. critical — /contact-us/: form inputs `your-name`, `your-email`, `your-subject`,
   `your-message`, `captcha-82` have no associated label (visible "Your Name (required)"
   is plain `<p>` text). Evidence: `a11y-mobile-400.json` → contact-us `violations[id=label]`
   (5 nodes); `web-check-mobile-400.json` → forms[0].inputs; `src/contact.html`. Pass:
   axe `label` rule 0 nodes; every field programmatically named (§3 baseline: critical 5 → 0).
2. serious — all 5 pages: unnamed links `.art-logo-*` (href="#"), logo link on http on
   an https page, `.art-menu-btn` href="#" with empty spans, logo img `alt=""`.
   Evidence: `a11y-mobile-400.json` → each page `violations[id=link-name]` (3 nodes/page);
   `web-check-mobile-400.json` links + Tab stops 2–4. Pass: `link-name` 0 nodes; one
   https home URL; menu control has an accessible name.
3. serious — /, /contact-us/: Google Maps iframe (600×450) has no title. Evidence:
   `violations[id=frame-title]`. Pass: `frame-title` 0 nodes; map iframe titled.
4. serious — /guest-book/: Trustindex contrast — "Write a review" #000000 on #b60000
   = 2.98:1, "Read more" #808080 on #ffffff = 3.94:1. Evidence:
   `violations[id=color-contrast]` (2 nodes with fg/bg). Pass: 0 `color-contrast` nodes
   (override widget colours or replace the widget).
5. serious — /guest-book/: horizontally scrollable `.ti-platform-tab-items` not
   focusable. Evidence: `violations[id=scrollable-region-focusable]`. Pass: 0 nodes
   (focusable tab strip or no scroll).
6. serious — all 5 pages: mobile menu has no aria-label; Tab 1→8 opens; Escape does not
   close (`after_escape: 8`). Evidence: `web-check-mobile-400.json` → per-page `menu`.
   Pass: real button with `aria-expanded`, Escape closes and restores focus
   (`after_escape` back to 1).
7. moderate — all 5 pages: `meta[name=viewport]` sets `user-scalable=no,
maximum-scale=1`. Evidence: `violations[id=meta-viewport]`. Pass: pinch zoom allowed,
   rule 0 nodes.
8. moderate — all 5 pages: no `<main>` landmark. Evidence:
   `violations[id=landmark-one-main]`. Pass: single `<main>` per document.
9. moderate — content outside landmarks; node counts / 4, /rates/ 2, /contact-us/ 3,
   /guest-book/ 10, /things-to-do/ 10. Evidence: `violations[id=region]` (29 nodes
   total). Pass: `region` 0 nodes on the 5 pages.
10. moderate — /rates/: heading order invalid (h3 after h1). Evidence:
    `violations[id=heading-order]`. Pass: sequential heading levels, rule 0 nodes.
11. moderate — /things-to-do/: first grid item `<h4>` breaks order. Evidence: same rule.
    Pass: 0 nodes.
12. moderate — site-wide: favicon 404 `/wp-content/themes/TUXthemepaulshof9/favicon.ico`
    (404 request + console error). Evidence: `web-check-mobile-400.json` → rates
    `failed_requests[0]`, `console_errors[0]`; live recheck 2026-10-26. Pass: 404 request
    and console error gone (ship an icon at that path or drop the reference).
13. moderate — /montecasino-bird-gardens/: "Back to top" → `../oldsite/things.php#top`
    → 404 (only occurrence in the 8 snapshots). Evidence: `src/montecasino-bird.html`
    line 235; live recheck; link-audit `broken[0]` (path in 05 defect 13). Pass: link
    audit clean; points at /things-to-do/ or is dropped.
14. low — /contact-us/: meta description literally `Mary&nbsp;or Nicki` (raw entity).
    Evidence: `src/contact.html` meta tag. Pass: grep shows no `&nbsp;` in the meta.
15. low — /guest-book/: meta description begins with a URL-encoded Trustindex shortcode
    blob. Evidence: `src/guestbook.html` meta tag. Pass: blob stripped; real description.
16. low — /bryanston-country-club/: meta description truncated mid-sentence at
    "Founded in". Evidence: `src/bryanston.html` meta tag. Pass: sentence complete or
    trimmed.
17. low — /things-to-do/, /montecasino-bird-gardens/: meta descriptions only repeat the
    title. Evidence: `src/things.html`, `src/montecasino-bird.html`. Pass: real
    summaries from page content.
18. low — /767-2/: testimonials page under an empty-slug artifact; title literally
    "- No 5 On Franschoek"; h1 identical to /guest-book/ h1. Evidence:
    `live-767-2-20261026.html`; live recheck. Pass: disposition per §7 (owner decision);
    after disposition, no duplicate-h1 page remains in the sitemap.
19. low — /hello-world/: WordPress default slug retained; content is a Soweto post
    (published 2010-11-09, author Stephan Uys). Evidence: live recheck. Pass:
    disposition per §7; if kept, the slug no longer reads as a WordPress artifact.
20. low — /v-tours/, /virtual-tours/: near-duplicate tour routes (same 4 rooms, same
    YouTube embeds); /virtual-tours/ adds a duplicated H1 and a repeated iframe (video
    `MezOJv68rHs` twice); no meta description on either. Evidence: live recheck. Pass:
    one canonical tour page, single H1, one iframe per video, meta description present,
    other route redirects (301) or 410s — owner decision §7/§9.
21. low — all 5 pages: images missing `alt` (5/16, 5/14, 5/15, 15/448, 5/42). Evidence:
    `web-check-mobile-400.json` → `meta.img_missing_alt`. Pass: `img_missing_alt` 0 on
    the 5 pages (meaningful alt; empty alt only for decorative images).
22. low — all 8 snapshot pages (shared footer): stale copyright "(C) 2018". Evidence:
    `src/*.html` footer tail; 01 finding 6. Pass: no stale 2018 in built output;
    year/ownership follows the §9.1 identity decision.

Not defects (capture conditions): see §2 and 05 §7.

## 5. Design system spec

### Colour tokens (measured; do not re-measure)

Opaque sRGB pairs, calculated by `image_contrast` (03 §Colour); ratios valid only for
the opaque pairs, not translucent surfaces or photography:

| Role                                         | Foreground / background | Ratio    | WCAG |
| -------------------------------------------- | ----------------------- | -------- | ---- |
| Body text on background                      | #282521 / #FAF6EF       | 14.158:1 | AAA  |
| Brand heading / link on background           | #7D252B / #FAF6EF       | 8.977:1  | AAA  |
| Primary button (on-accent / accent)          | #FFFFFF / #7D252B       | 9.671:1  | AAA  |
| Botanical heading / link on background       | #445447 / #FAF6EF       | 7.483:1  | AAA  |
| Secondary filled button (on-accent / accent) | #FFFFFF / #445447       | 8.062:1  | AAA  |
| Legacy reference only (not a token)          | #9E0000 / #FFFFFF       | 8.558:1  | AAA  |

Token roles: background, surface, text, accent-text, accent-fill, on-accent (03).
Borders and non-text controls need their own applicable contrast checks. Underline text
links; do not rely on colour alone; focus indicators visible on every surface. The
legacy red is not inherently a contrast problem (01 §Accessibility evidence and
limits) — the measured pair shows why; still, the direction moves to burgundy.

### Typography

Observed truth (computed CSS, 01 §Observed visual system): most text declares
**Century Gothic** with **Arial / Helvetica / sans-serif** fallbacks; some headings
declare **Georgia / Times / serif**. A declared family is not proof the font is
installed or actually selected on the capture machine. Vision-inferred font names
(034541 report's "Georgia display" and similar) are **non-canonical** — that job's
brief fed it the proposed tokens, so its colour/font "observations" parrot the brief;
treat all its colour claims as unusable (its layout/typography observations remain
usable). Implementation: locally packaged, licensed fonts (serif display + sans body
per 03); pick after approval; the concepts do not prove font availability.

### Spacing and rhythm

rem/em with the browser-relative root size; body around 1rem; generous line-height;
moderate prose measure; a predictable spacing scale and small stable borders; card
image ratios kept consistent; single-column mobile cards (03 §Type and spacing,
§Components and layout). Source breakpoints are regression targets, not a mandate to
copy the old layout.

### Imagery policy

Real, locally hosted property photographs only. Generated imagery is banned from
production (concepts are art direction; their lettering is known-bad and their
interiors are not evidence of real facilities). `astro:assets` imports, reserved
dimensions, meaningful alt (03 §Asset rules; 02 PropertyHero/FeatureCard rows).

### Component state inventory

From [02-components.md](02-components.md) (proposed responsibilities, not built
components): Layout (ClientRouter + CSP contracts), SiteHeader, SiteNavigation (labelled
menu button; focus + Escape behaviour), BookingCallToAction (one primary treatment; no
fabricated handler), PageIntro (one h1), PropertyHero (opaque copy surface, reduced
motion), FeatureCard, GallerySection (no duplicated markup), AttractionCard /
AttractionArticle (one list + one article shell), GuestFeedback (verified reviews or
external link only — never synthesize testimonials or ratings), LocationPanel (works
without the embed), ContactPanel (demo submission disabled until a real handler),
SiteFooter. States to verify per component in implementation: default, hover/focus,
active, disabled, and the menu open/closed pair (§6, phase 4).

## 6. Design direction and tradeoffs

One direction, chosen and documented in 01 §Proposed direction and 03: retain the warm
burgundy identity, pair it with ivory (#FAF6EF) and restrained botanical green
(#445447), calm editorial hierarchy; a stable frame for property photography and opaque
surfaces for text; business content and booking intent preserved.

Kept: business name and verified contact content (05 §2), the burgundy accent
(legacy #9E0000 8.558:1 was already AA), the booking CTA as the primary action, the
editorial article set. Changed: oversized masthead → compact wordmark; white nav bar
over translucent grey panels → opaque ivory surfaces; gradient red buttons → flat
burgundy primary (#FFFFFF on #7D252B, 9.671:1); circular image links and heavy
gradients → a single card system; Contact Form 7 → typed content + a demo-disabled
form until a real handler exists. Dropped: page-builder plugin rules, Trustindex
widget as a layout dependency (replace or override), stale footer identity.

Explicit tradeoffs: ivory + burgundy + green is a palette, not a measured system —
implementation must verify every state and surface, not assume the five measured pairs
cover it. Serif display is a proposal until licensed fonts are packaged; if font
licensing fails, the sans fallback stack is acceptable. Editorial hierarchy trades
decorative richness for scanability and reflow safety. No second alternative was
generated because the 01 critique and 03 guideline converged on one direction from the
observed system (retain burgundy, fix surfaces/hierarchy), the two concepts in
`docs/designs/` are one coherent exploration of it, and a full second direction would
duplicate cost without a decision it could change; the open items in §9 are business
decisions, not style alternatives.

## 7. Route and content plan

38 sitemap URLs (recheck 2026-10-26, identical to the campaign manifest; audit
§Sitemap recheck). Pages (10): /, /gallery/, /rates/, /guest-book/, /map/,
/things-to-do/, /contact-us/, /767-2/, /virtual-tours/, /v-tours/. Posts (28):
/the-sterkfontein-caves/, /maropeng-cradle-of-human-kind/, /johannesburg-country-club/,
/bryanston-country-club/, /cedar-square/, /prison-break-market/, /pineslopes-boulevard/,
/montecasino/, /design-quarter/, /orexi-greek-street-food/,
/extreme-adventures-in-johannesburg/, /carnivores-restaurant/, /hello-world/,
/the-rhino-and-lion-park/, /the-johannesburg-zoo/, /pilansberg-nature-reserve/,
/sun-city/, /gold-reef-city/, /johannesburg-botanical-gardens/, /hartbeespoort-dam/,
/montecasino-bird-gardens/, /nelson-mandela-square/, /rosebank-mall/, /sandton-city/,
/the-sandton-convention-centre/, /gallagher-convention-centre/, /moyo/,
/yamato-japanese-restaurant/.

Default recommendation: all 28 posts and the 6 clean pages migrate as typed content
(MDX collections); attraction posts keep one list item + one article shell (02). The
four duplicate/test routes:

| Route           | Finding (05 §6)                                                                              | Recommended action                                                                                                              | Status                                                            |
| --------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| /767-2/         | Testimonials page; empty-slug title artifact; h1 identical to /guest-book/                   | Consolidate into /guest-book/; 301 /767-2/ → /guest-book/                                                                       | Recommended; final disposition is owner decision §9.2             |
| /hello-world/   | WordPress-default slug retained; content is the Soweto post (2010-11-09, author Stephan Uys) | If the post stays, re-slug to a Soweto slug and 301 the old URL; a 301 target exists only if the owner confirms a canonical URL | Owner decision §9.2                                               |
| /v-tours/       | Near-duplicate of /virtual-tours/ (same 4 rooms, same embeds); no meta description           | One canonical tour page; the other 301s to it                                                                                   | Merge direction recommended; canonical URL is owner decision §9.5 |
| /virtual-tours/ | Same; plus duplicated H1 and repeated iframe (video `MezOJv68rHs` twice)                     | Canonical candidate (clean content once H1/iframe are de-duplicated); or merge into /v-tours/ and 301 the reverse               | Owner decision §9.5                                               |

Redirects must preserve needed anchors; robots.txt/indexing policy stays
build-time-controlled (starter AGENTS.md). Nothing here invents content: review quotes,
tour room names and post text are as captured (05 §6, live recheck 2026-10-26).

## 8. Implementation phases, dependencies, acceptance, verification

Phases are ordered by dependency; each lists what must pass before the next starts.

1. **Decisions and content** — owner decisions §9 recorded; real property photos
   collected with provenance; verified business facts locked from 05 §2 (name spelling
   pending §9.1). Acceptance: no invented prices, amenities, reviews or identity
   anywhere; every contact string matches 05 §2 exactly.
2. **Design system tokens and components** — CSS tokens from §5, the 02 component
   inventory with states (§5 inventory), typed MDX collections + `site.ts`.
   Acceptance: all colour consumed from tokens; no hardcoded hex in component CSS.
3. **Routes and content migration** — 38 URLs per §7; redirects/anchors preserved;
   meta descriptions from real content (defects 14–17). Acceptance: link audit clean
   (defect 13), every page one h1 with valid order (defects 10–11), `region`/
   `landmark-one-main`/`meta-viewport` 0 nodes (defects 7–9).
4. **Verification** — re-run the **same** a11y + perf checks against the built local
   preview and compare against the §3 baselines: `web_accessibility` @400px on at
   least the same 5 core pages (goal: 0 critical/serious nodes; moderate as targeted
   by §4), `web_check` @400px (menu Escape closes, named links, alt coverage, no 404
   favicon request), `web_performance` quick @1440px on the 5 pages (compare TTFB/
   DCL/load/idle/requests/bytes/DOM against the §3 table; the before-state is a live
   WordPress site, so treat absolute wins as expected, regressions as failures).
   Plus the starter's own gates: `bun run verify`, production build/output checks,
   keyboard/theme/reflow, reduced motion, 320px + zoom + enlarged text, client
   routing A→B→A/Back/Forward, CSP and header checks (AGENTS.md).
5. **Regression capture** — screenshot jobs on the local preview at the 23 audit
   widths, then paired design analysis source-vs-implementation; contrast measured
   separately on opaque pairs (not assumed from §5).

Hard rules across all phases: **no form submission testing** (the demo form must
never POST or leak fields — verify by inspection and by cancelling submission in its
handler; never exercise a real submit), no booking interaction, live site read-only,
no generated imagery in production, no deploy as a side effect of page edits.

## 9. Owner decisions (only genuinely missing business decisions)

1. Business-name spelling: live says "No 5 On Franschoek" (no h) in every title/og
   tag and body h1 (05 §2, 8/8 snapshots); the planning docs say "Franschhoek" (with
   h). "Paulshof" is a location, not an approved rebrand. Which exact legal name,
   spelling and casing goes in `<title>`, wordmark and footer?
2. Disposition of the four duplicate/test routes — /767-2/ (consolidate into
   /guest-book/?), /hello-world/ (keep the Soweto post under a new slug, or drop it?),
   /v-tours/ and /virtual-tours/ (which content survives, per §7).
3. Booking CTA: label and destination. Live CTA is "Book Online Here" →
   nightsbridge `Search?bbid=11881` (05 §2, 8×). Keep that external destination, or
   a new one?
4. Whether to publish prices: live rates page publishes none ("Please see our special
   under the book online button." — 05 §2). Publish rates on the new site, keep the
   external link, or both?
5. Canonical tour page URL: /v-tours/ or /virtual-tours/ (the other 301s to it).

## 10. Incomplete checks

- Single-pixel probes never captured: 478, 577, 599, 766, 781, 978, 981, 990, 993,
  998, 1198, 1201 (audit §Remaining gaps). 981 is the only literal direction gap with
  a plausible layout effect. Full B−1/B/B+1 coverage is not claimed.
- A11y/keyboard state of the 30 non-core sitemap URLs untested (screenshots only;
  05 §7).
- Axe _incomplete_ results (§3 baseline counts) are indeterminate by construction —
  re-check in phase 4, not violations to be quoted.
- Guest-book perf/DOM: widget-state-dependent; no stable baseline exists (05 §4).
- The 034541 colour claims remain unusable (§2) — any future citation of that report
  must be limited to layout/typography observations.
