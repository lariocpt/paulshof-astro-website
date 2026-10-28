# Implementation status

Working record for the `feat/implement-site` branch. Phases 0–1 were already
committed; Phases 2–7 are implemented, verified and committed here. The plan is
[IMPLEMENT.md](../../IMPLEMENT.md); scope and defects are
[04-implementation-handoff.md](04-implementation-handoff.md).

## Committed phases

| Phase                     | Commit    | What landed                                                                                                                                                     |
| ------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2 — Shared frame & routes | `e2226f5` | `site.ts` identity, SiteHeader/Footer, BookingCallToAction, PageHeader/Prose; real Home/Rates/Contact routes.                                                   |
| 3 — Components            | `10182f7` | PropertyHero, Feature/FeatureList, GalleryGrid/GallerySection, Attraction\*, GuestFeedback, LocationPanel, ContactPanel/ContactForm (demo contract), RatesList. |
| 4 — Home page             | `9b8d437` | Hero → grounds preview → verified prose → room preview → guest-quote teaser → LocationPanel → booking.                                                          |
| 5 — Content-light routes  | `028d80d` | `/gallery/`, `/guest-book/`, `/map/`; navigation to the six built routes; `public/_redirects`.                                                                  |
| 6 — Attraction content    | `06e5afa` | `attractions` collection (28 posts, read-only fetch of each live post), `/things-to-do/` listing, `/[slug]/` article route, `/soweto/` re-slug.                 |

Routes built and verified: `/`, `/gallery/`, `/rates/`, `/guest-book/`, `/map/`,
`/things-to-do/`, `/contact-us/`, `/404.html`, plus the 28 attraction posts at their
previous slugs (the Soweto post at `/soweto/`).

## Verification evidence (current tree)

- `bun run verify` green: 36 pages built, 23 tests, source/format/lint/`astro check`
  clean; the rendered-output gate confirms one h1/main/canonical/description,
  sequential headings, no duplicate ids, image `width`/`height`, and that every
  local link resolves against `dist`.
- `web_accessibility` @400 on all built routes: **0 violations, 0 incomplete** —
  including the contact form (defect 1, every field labelled) and the hero/gallery
  photography (defect 21, `img_missing_alt` 0). Re-run @400 on `/things-to-do/` and
  four attraction posts: 0 violations, 0 incomplete.
- `web_check` @400: no console errors or failed requests; named links only; a CDP
  probe confirms the menu opens, Escape closes and refocuses the toggle (defect 6).
- `web_find_overflows`: no horizontal overflow 320–1440 on home, contact, gallery,
  `/things-to-do/` and the navigation breakpoint boundary (1279/1281). With the nav
  now carrying seven routes, home was re-checked at 1280/1366/1440 — the seven links
  fit inside the 1160 container, so the collapse breakpoint was left unchanged.
- Opaque colour pairs re-measured with `visual_contrast`: ink/ivory 14.2, burgundy/
  ivory 8.98, white/burgundy 9.67, botanical/ivory 7.48, muted 5.87 (all AA, most AAA).
- Visual MCP reviews were run on screenshots; their "overlap"/"clipped" findings were
  each checked against computed geometry and dismissed as false positives (the element
  was fully sized with no overflow, or simply below the capture fold).

## Known artifacts (not defects)

- `web_link_audit` strips trailing slashes and fetches `/gallery` etc.; `astro preview`
  serves only the canonical `/gallery/`. The built HTML and the rendered-output gate
  use trailing slashes throughout and resolve; Netlify redirects the bare form.
- The old form is a labelled **demo**: no handler exists, so it cancels submission and
  never sends or leaks fields. A real handler is a separate, explicit decision.
- `property-02.jpg` (four people, unidentifiable from evidence) stays excluded from
  publication pending owner confirmation.
- The attraction articles are the property's own published text, copied verbatim from
  each live post. Obvious misspellings in that text (e.g. "approxmiately" in the Rhino
  & Lion reserve blurb) are left as the property wrote them, and any third-party phone
  line inside a body is kept as published. No attraction imagery or logos were carried
  over, and no facts, prices or opening hours were added.

## §4 acceptance re-run (Phase 7)

Run against `bun run preview` (`:4322`), fresh headless Chromium @400, the same
conditions as the §4 "Pass" tests. Result per defect:

- **1, 2, 3, 4, 5, 7, 8, 9, 10, 11** — `web_accessibility` @400 across 11 routes
  (core pages + `/things-to-do/` + three posts + 404): **0 violations, 0 incomplete**,
  so `label`, `link-name`, `frame-title`, `color-contrast`, `scrollable-region-focusable`,
  `meta-viewport`, `landmark-one-main`, `region` and `heading-order` are all clean.
  (No `frame-title` node exists because there is no iframe; the Trustindex widget of
  defect 4/5 was replaced with static quotes.)
- **6** — menu is a real `button[aria-expanded]` that closes on Escape; the header now
  also closes the sheet when resizing up past the breakpoint (see the fix below), so the
  toggle behaves identically after a resize and after a load.
- **12, 13** — `web_check` shows no failed requests and no console errors on any page
  (no favicon 404); built output contains no `wp-content`/`TUXtheme` reference and no
  `things.php`/`oldsite`/"Back to top" link.
- **14, 15, 16, 17** — `web_extract_meta` on `/contact-us/`, `/guest-book/`,
  `/bryanston-country-club/`, `/things-to-do/` and `/montecasino-bird-gardens/`: every
  description is real prose with no `&nbsp;`, no shortcode blob, no mid-sentence cut and
  no title echo.
- **18, 19** — sitemap contains `/soweto/` and none of `/hello-world/`, `/767-2/`,
  `/v-tours/`, `/virtual-tours/`; no duplicate-h1 testimonials page is built.
- **21** — `img_missing_alt` 0 everywhere (gallery's 106 images all carry alt).
- **22** — no `2018` (or any year/copyright line) in rendered HTML; the only `2018` is
  inside the bundled SIL OFL text for the Fraunces font, and the footer carries no
  copyright line pending the §9.1 identity decision.
- **20 — not performed against the build**: `/v-tours/` and `/virtual-tours/` are
  intentionally unbuilt (owner §9.5), so there is no near-duplicate tour page to test;
  this acceptance applies once the owner settles the canonical tour route and video links.

**Defect found during Phase 7 and fixed** (`81c8a44`): opening the mobile menu, resizing
up past the breakpoint and back left the sheet open, so the next tap closed a panel that
looked shut — the menu read as dead until a manual refresh. The header now closes the
sheet on crossing into the desktop width. Reproduced and re-verified with a CDP probe that
drives the wide→narrow→open→wide→narrow→tap sequence.

**Not a §4 acceptance test and therefore not re-run here:** the §2 performance numbers
were observational, not pass/fail criteria; and link integrity is taken from the
rendered-output gate (every internal link resolves against `dist`), not `web_link_audit`,
whose trailing-slash behaviour is a known artifact.

## Remaining work

**Phase 6 — done except the tour pages.** The 28 attraction posts are migrated as the
`attractions` collection (read-only fetch of each live post), `/things-to-do/` lists
them in the published order, and each post renders at its previous slug (the Soweto
post at `/soweto/`, so the `/hello-world/` redirect now resolves). Held: the tour
routes `/virtual-tours/` and `/v-tours/` — their canonical form is an owner decision
(§9.5) and the page needs a video-link decision first (the CSP carries no `frame-src`,
so any video would be a labelled external link, not an embed), so both routes and their
redirect stay unbuilt until that is settled.

**Phase 7 — done.** The §4 acceptance tools were re-run against the preview above:
every defect's "Pass" condition holds except defect 20, which is not applicable while the
tour routes stay unbuilt. One resize-state defect surfaced and was fixed (`81c8a44`).
Nothing in the site's scope remains unbuilt; only the tour routes and the owner
decisions in §9 below are open.

## Outstanding owner decisions (handoff §9)

1. Exact business-name spelling/casing (live uses "No 5 On Franschoek"; docs use
   "Franschhoek"). Kept as live for now.
2. Final disposition of `/hello-world/` (now `/soweto/`, redirect resolves) and
   `/767-2/` (redirects to `/guest-book/`, resolves). Still open: the canonical tour
   route between `/v-tours/` and `/virtual-tours/`, which is held with that page (§9.5).
3. Whether to publish prices anywhere (currently none published; booking links out).
4. The `property-02.jpg` photo (caption with names + consent, or drop).
5. Launch-time `SITE_INDEXABLE` / `ROBOTSTXT` flip — both stay off until then.
6. Owner review of photography alt text (currently conservative, sequence-based).
