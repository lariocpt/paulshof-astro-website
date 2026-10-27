# Implementation status

Working record for the `feat/implement-site` branch. Phases 0–1 were already
committed; Phases 2–5 are implemented, verified and committed here. The plan is
[IMPLEMENT.md](../../IMPLEMENT.md); scope and defects are
[04-implementation-handoff.md](04-implementation-handoff.md).

## Committed phases

| Phase                     | Commit    | What landed                                                                                                                                                     |
| ------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2 — Shared frame & routes | `e2226f5` | `site.ts` identity, SiteHeader/Footer, BookingCallToAction, PageHeader/Prose; real Home/Rates/Contact routes.                                                   |
| 3 — Components            | `10182f7` | PropertyHero, Feature/FeatureList, GalleryGrid/GallerySection, Attraction\*, GuestFeedback, LocationPanel, ContactPanel/ContactForm (demo contract), RatesList. |
| 4 — Home page             | `9b8d437` | Hero → grounds preview → verified prose → room preview → guest-quote teaser → LocationPanel → booking.                                                          |
| 5 — Content-light routes  | `028d80d` | `/gallery/`, `/guest-book/`, `/map/`; navigation to the six built routes; `public/_redirects`.                                                                  |

Routes built and verified: `/`, `/gallery/`, `/rates/`, `/guest-book/`, `/map/`,
`/contact-us/`, `/404.html`.

## Verification evidence (current tree)

- `bun run verify` green: 7 pages built, 23 tests, source/format/lint/`astro check`
  clean; the rendered-output gate confirms one h1/main/canonical/description,
  sequential headings, no duplicate ids, image `width`/`height`, and that every
  local link resolves against `dist`.
- `web_accessibility` @400 on all built routes: **0 violations, 0 incomplete** —
  including the contact form (defect 1, every field labelled) and the hero/gallery
  photography (defect 21, `img_missing_alt` 0).
- `web_check` @400: no console errors or failed requests; named links only; a CDP
  probe confirms the menu opens, Escape closes and refocuses the toggle (defect 6).
- `web_find_overflows`: no horizontal overflow 320–1440 on home, contact, gallery
  and the navigation breakpoint boundary (1279/1281).
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

## Remaining work

**Phase 6 — content migration (the bulk, data-limited).** The `/things-to-do/`
listing and 28 attraction post bodies are not in local evidence: only titles and
"Read more" survive in the captured `/things-to-do/` page, and full HTML was captured
for just 8 pages. Migrating faithfully needs read-only `GET`s of each live post plus
typed MDX with real meta descriptions (defects 14–17), then `/things-to-do/`
(AttractionList), the canonical `/virtual-tours/` (single h1, one iframe per video,
labels as external links — no embed), and the Soweto post re-slug so the `/hello-world/`
redirect resolves. Best done as small bounded tasks with fresh context.

**Phase 7 — regression.** Re-run the §4 acceptance tools against `bun run preview` on
the same conditions as the baseline and report any check not actually performed.

## Outstanding owner decisions (handoff §9)

1. Exact business-name spelling/casing (live uses "No 5 On Franschoek"; docs use
   "Franschhoek"). Kept as live for now.
2. Final disposition of `/767-2/` (redirected here), `/hello-world/`, `/v-tours/`,
   `/virtual-tours/`.
3. Whether to publish prices anywhere (currently none published; booking links out).
4. The `property-02.jpg` photo (caption with names + consent, or drop).
5. Launch-time `SITE_INDEXABLE` / `ROBOTSTXT` flip — both stay off until then.
6. Owner review of photography alt text (currently conservative, sequence-based).
