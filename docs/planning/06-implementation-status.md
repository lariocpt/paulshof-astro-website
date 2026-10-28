# Implementation status

Working record for the `feat/implement-site` branch. Phases 0–1 were already
committed; Phases 2–6 are implemented, verified and committed here. The plan is
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

## Remaining work

**Phase 6 — done except the tour pages.** The 28 attraction posts are migrated as the
`attractions` collection (read-only fetch of each live post), `/things-to-do/` lists
them in the published order, and each post renders at its previous slug (the Soweto
post at `/soweto/`, so the `/hello-world/` redirect now resolves). Held: the tour
routes `/virtual-tours/` and `/v-tours/` — their canonical form is an owner decision
(§9.5) and the page needs a video-link decision first (the CSP carries no `frame-src`,
so any video would be a labelled external link, not an embed), so both routes and their
redirect stay unbuilt until that is settled.

**Phase 7 — regression.** Re-run the §4 acceptance tools against `bun run preview` on
the same conditions as the baseline and report any check not actually performed.

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
