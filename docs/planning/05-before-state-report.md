# Before-state report

Saved-evidence review of the live site as captured 2026-10-26, plus the verified live
deltas of the same day. Evidence paths are relative to this file unless noted; `src/`
and `live-*.html` snapshots live under `/tmp/opencode/paulshof/`.

## 1. Scope, method and conditions

Saved evidence only; nothing here was re-captured except the live recheck listed below.

- Axe (WCAG 2.0/2.1 A/AA plus best practice) via web_accessibility, fresh headless
  Chromium, 400px, reduced motion, no interaction: `evidence/a11y-mobile-400.json`.
- Behavioural check via web_check (console, failed requests, menu, Tab stops, forms,
  links), same browser conditions: `evidence/web-check-mobile-400.json`.
- Performance via web_performance, quick mode, single run, 1440px, fresh page per run,
  100-request cap: `evidence/perf-quick-*.json` (5 files).
- 400px screenshots: `evidence/screens-400/` (5 pages).
- HTML snapshots: `src/{home,contact,rates,guestbook,things,map,bryanston,montecasino-bird}.html`
  (8 pages, saved 2026-10-26) and live fetches `live-{home,contact,map,767-2}-20261026.html`.
- Conditions: guest-book DOM and page height include the asynchronous Trustindex widget —
  widget-state-dependent (hydration provenance in [coverage-audit.md](coverage-audit.md),
  boundary recapture job `20261026-192633-9941d7e55f71`). Guest-book `load_ms` never
  fired in either perf run (load event pending on the widget). No form submission, no
  booking interaction, live site read-only GET/HEAD.

## 2. Verified business facts

Strings exactly as saved, with where they appear:

| Fact                      | Exact string                                                                                                                                                                     | Where                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Name (as it appears live) | "No 5 On Franschoek" in every `<title>` (8/8) and in `og:site_name`; home h1 "Welcome to No 5 on Franschoek"                                                                     | `<title>` of all 8 `src/` snapshots; `og:site_name` in `src/home.html`; h1 in `src/home.html` |
| Hosts                     | "Nicki and Mary are your hosts at No 5 on Franschoek"                                                                                                                            | `src/home.html` body; contact h2 "Mary or Nicki" (`src/contact.html`)                         |
| Phone                     | "+27 (0)11 803 6064" (18×)                                                                                                                                                       | header strip and footer, all `src/` snapshots                                                 |
| Cell                      | "Nicki Cell: +27 (0) 82 821 6669" (`src/contact.html`); "Call Nicki on 082 821 6669" (2×, `src/rates.html`)                                                                      | both formats appear live                                                                      |
| Email                     | "nicki.cottle@mweb.co.za" (footer, 16×); link text "Nicki.cottle@mweb.co.za" (2×)                                                                                                | footer and contact body, `src/` snapshots                                                     |
| Address                   | "5 Franschoek Lane, Paulshof, Sandton ,2191" — space before the comma (8× footers); body variant "5 Franschoek Lane, Paulshof, Sandton, Gauteng." (home, omits postal code 2191) | footer of all `src/` snapshots; "Where to Find Us" in `src/home.html`                         |
| Booking CTA               | "Book Online Here" → `https://www.nightsbridge.co.za/bridge/Search?bbid=11881` (8×; keyboard stop 1 on all 5 checked pages)                                                      | header of all `src/` snapshots; `web-check-mobile-400.json` keyboard stops                    |
| Rates                     | No numeric prices published; "Please see our special under the book online button."                                                                                              | `src/rates.html` body; rates h3                                                               |
| Footer identity           | "No 5 on Franschoek, Luxury Bed and Breakfast Sandton (C) 2018" (stale year, cf. 01 finding 6)                                                                                   | footer of all `src/` snapshots                                                                |

## 3. Prioritized defects

Ordered by impact. Evidence: JSON paths into the two evidence files or snapshot lines;
repro column names the tool that produced the row.

| #   | Page                                       | Defect                                                                                                                                                                                                                                                                                     | Evidence (file → path/line)                                                                                                                                                                       | Impact   | Reproduce                                       | Fix direction                                                  |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------- | -------------------------------------------------------------- |
| 1   | /contact-us/                               | Contact Form 7 inputs have no label: `your-name`, `your-email`, `your-subject`, `your-message` (textarea), `captcha-82`; visible "Your Name (required)" etc. are plain `<p>` text, not associated; submit `<input value="Send Message">` (has value, but no `<label>` per check inventory) | `evidence/a11y-mobile-400.json` → `pages[contact-us].violations[id=label]` (5 nodes); `evidence/web-check-mobile-400.json` → `pages[contact-us].forms[0].inputs[]`; `src/contact.html` form block | critical | web_accessibility @400px                        | Associate real `<label for>` with each field                   |
| 2   | all 5 pages                                | Links without discernible text: `.art-logo-324671916` href="#", `.art-logo-393647988` href="http://www.accommodationpaulshof.co.za/" (http on an https page), `.art-menu-btn` href="#" (empty spans); logo img `alt=""`                                                                    | `a11y-mobile-400.json` → each `pages[*].violations[id=link-name]` (3 nodes/page); `web-check-mobile-400.json` → `pages[*].links.internal` and keyboard stops 2–4                                  | serious  | web_accessibility @400px; Tab 2–4               | Name every link; use one https home URL                        |
| 3   | /, /contact-us/                            | Google Maps embed `<iframe>` (600×450) has no title                                                                                                                                                                                                                                        | `a11y-mobile-400.json` → `pages[/].violations[id=frame-title]`, `pages[contact-us]` same                                                                                                          | serious  | web_accessibility @400px                        | `title` on the map iframe                                      |
| 4   | /guest-book/                               | Insufficient contrast (Trustindex widget): "Write a review" #000000 on #b60000 = 2.98:1; "Read more" #808080 on #ffffff = 3.94:1                                                                                                                                                           | `a11y-mobile-400.json` → `pages[guest-book].violations[id=color-contrast]` (2 nodes with fg/bg)                                                                                                   | serious  | web_accessibility @400px                        | Override widget colours or replace widget output               |
| 5   | /guest-book/                               | Horizontally scrollable region not focusable: `.ti-platform-tab-items` (Trustindex)                                                                                                                                                                                                        | `a11y-mobile-400.json` → `pages[guest-book].violations[id=scrollable-region-focusable]`                                                                                                           | serious  | web_accessibility @400px                        | Focusable tab strip or drop the scroll                         |
| 6   | all 5 pages                                | Mobile menu `a.art-menu-btn`: no aria-label; opens (Tab stops 1→8); Escape does not close (after_escape=8)                                                                                                                                                                                 | `web-check-mobile-400.json` → `pages[*].menu {element, aria_label:null, before:1, after_open:8, after_escape:8, opens:true, closes_on_escape:false}`                                              | serious  | web_check @400px                                | Real button, `aria-expanded`, Escape closes and restores focus |
| 7   | all 5 pages                                | `meta[name=viewport]` sets `user-scalable = no, maximum-scale = 1` (zoom disabled)                                                                                                                                                                                                         | `a11y-mobile-400.json` → each `pages[*].violations[id=meta-viewport]` (tag html quoted)                                                                                                           | moderate | web_accessibility @400px                        | Allow pinch zoom                                               |
| 8   | all 5 pages                                | No main landmark (document has no `<main>`)                                                                                                                                                                                                                                                | `a11y-mobile-400.json` → each `pages[*].violations[id=landmark-one-main]`                                                                                                                         | moderate | web_accessibility @400px                        | Single `<main>` in the layout                                  |
| 9   | all 5 pages                                | Content outside landmarks (`region`), node counts per page: / 4, /rates/ 2, /contact-us/ 3, /guest-book/ 10, /things-to-do/ 10                                                                                                                                                             | `a11y-mobile-400.json` → each `pages[*].violations[id=region]`                                                                                                                                    | moderate | web_accessibility @400px                        | Group rows into landmarked sections                            |
| 10  | /rates/                                    | Heading order invalid: `<h3>Please see our special under the book online button.</h3>` after the h1                                                                                                                                                                                        | `a11y-mobile-400.json` → `pages[rates].violations[id=heading-order]`                                                                                                                              | moderate | web_accessibility @400px                        | Sequential heading levels                                      |
| 11  | /things-to-do/                             | Heading order invalid: first grid item `<h4>Bryanston Country Club</h4>`                                                                                                                                                                                                                   | `a11y-mobile-400.json` → `pages[things-to-do].violations[id=heading-order]`                                                                                                                       | moderate | web_accessibility @400px                        | Article headings follow the page h1                            |
| 12  | /rates/ (theme file, site-wide)            | Favicon 404: `/wp-content/themes/TUXthemepaulshof9/favicon.ico` (404 request + console error)                                                                                                                                                                                              | `web-check-mobile-400.json` → `pages[rates].failed_requests[0] {status:404}` and `console_errors[0]`; live recheck 2026-10-26                                                                     | moderate | web_check @400px on /rates/; HEAD the icon path | Ship an icon at that path                                      |
| 13  | /montecasino-bird-gardens/                 | Broken link: "Back to top" → `../oldsite/things.php#top` → 404 (only occurrence in the 8 snapshots)                                                                                                                                                                                        | `src/montecasino-bird.html` line 235; live recheck 2026-10-26 (`/oldsite/things.php` → 404); link audit `~/.local/share/opencode/tool-output/tool_1763372660016gZmwA3S4PJbzU` (`broken[0]`)       | moderate | web_link_audit over articles; fetch the target  | Point at /things-to-do/ or drop the link                       |
| 14  | /contact-us/                               | Meta description literally `Mary&nbsp;or Nicki` (raw `&nbsp;` entity in the meta content)                                                                                                                                                                                                  | `src/contact.html` `<meta name="description">`; `web-check-mobile-400.json` → `pages[contact-us].meta.description` (normalized "Mary or Nicki")                                                   | low      | grep the meta tag                               | Write a real description                                       |
| 15  | /guest-book/                               | Meta description begins with a URL-encoded Trustindex shortcode blob `JTVCdHJ1c3RpbmRleCUyMGRhdGEtd2lkZ2V0LWlkJTNEOGJkOTA5YjM2NGVlMjMxNWMxNTY5ZDNhNzY1JTVEN…` (decodes to `%5Btrustindex data-widget-id=8bd909b364ee2315c1569d3a765%5D`) then review text                                  | `src/guestbook.html` `<meta name="description">`; `web-check-mobile-400.json` → `pages[guest-book].meta.description`                                                                              | low      | grep the meta tag                               | Strip shortcode; write a description                           |
| 16  | /bryanston-country-club/                   | Meta description truncated mid-sentence at "Founded in"                                                                                                                                                                                                                                    | `src/bryanston.html` `<meta name="description">` (ends "recreation. Founded in")                                                                                                                  | low      | grep the meta tag                               | Complete or trim the sentence                                  |
| 17  | /things-to-do/, /montecasino-bird-gardens/ | Meta descriptions only repeat the title ("Things To Do", "Montecasino Bird Gardens")                                                                                                                                                                                                       | `src/things.html`, `src/montecasino-bird.html` meta tags                                                                                                                                          | low      | grep the meta tags                              | Summaries from page content                                    |
| 18  | /767-2/                                    | Guest-testimonials page under an empty-slug artifact: title literally "- No 5 On Franschoek"; h1 "What Our Guests Say About no 5 on Franschoek" (identical to /guest-book/ h1); meta description is a review quote                                                                         | `/tmp/opencode/paulshof/live-767-2-20261026.html` (`<title>`, `<h1>`, meta); live recheck 2026-10-26                                                                                              | low      | fetch /767-2/                                   | Consolidate with /guest-book/ or rename slug                   |
| 19  | /hello-world/                              | WordPress default slug retained; content is a Soweto blog post (title "Soweto - No 5 On Franschoek", published 2010-11-09, author Stephan Uys)                                                                                                                                             | live recheck 2026-10-26                                                                                                                                                                           | low      | fetch /hello-world/                             | Re-slug or merge into the posts set                            |
| 20  | /v-tours/, /virtual-tours/                 | Near-duplicate tour routes: same 4 luxury rooms (Blue/Orange/Red/Black) and YouTube room-tour embeds on both; /virtual-tours/ additionally has a duplicated H1 and a repeated iframe (video `MezOJv68rHs` twice); no meta description on either                                            | live recheck 2026-10-26                                                                                                                                                                           | low      | fetch both routes                               | Keep one route; redirect the other                             |
| 21  | all 5 pages                                | Images missing `alt` (home 5/16, rates 5/14, contact 5/15, guest-book 15/448, things-to-do 5/42)                                                                                                                                                                                           | `web-check-mobile-400.json` → `pages[*].meta.img_missing_alt` / `img_total`                                                                                                                       | low      | web_check @400px                                | Add meaningful alt text                                        |
| 22  | 8 snapshot pages (shared footer)           | Stale copyright "(C) 2018" in the shared footer                                                                                                                                                                                                                                            | footer of `src/*.html` (e.g. `src/contact.html` tail); cf. `01-style-guide-and-critique.md` finding 6                                                                                             | low      | view source                                     | Current year/ownership policy                                  |

Not in the table (conditions, see §7): Google Maps embed and home hero `.mp4` show
`net::ERR_ABORTED` in headless capture (`web-check-mobile-400.json` failed_requests for /
and /contact-us/); GA collect requests abort likewise. Those are capture-side aborts,
not verified live defects.

## 4. Baseline performance

`web_performance` quick mode, single run, 1440px, fresh page, 100-request cap; from
`evidence/perf-quick-*.json`.

| Page           | TTFB ms | DCL ms | load ms              | idle ms | Requests  | Bytes     | DOM nodes |
| -------------- | ------- | ------ | -------------------- | ------- | --------- | --------- | --------- |
| /              | 752     | 1275   | 2733                 | 3212    | 74        | 2,590,253 | 430       |
| /rates/        | 724     | 1201   | 2606                 | 2843    | 63        | 1,420,659 | 368       |
| /contact-us/   | 801     | 1297   | 2733                 | 3124    | 67        | 1,910,577 | 392       |
| /guest-book/   | 787     | 1321   | — (load never fired) | 2744    | 100 (cap) | 3,002,525 | 1894      |
| /things-to-do/ | 849     | 1516   | 2856                 | 3040    | 100 (cap) | 2,814,874 | 802       |

- Requests/bytes for the two capped pages are undercounts at 100 requests.
- Flagged in-file: home `video-poster.jpg` 532 KB > 300 KB; guest-book "large DOM
  (1894 nodes)", 42 images missing width/height (CLS risk), 1 image > 300 KB
  (tripadvisor avatar 322 KB).
- Prior isolated guest-book run (clean-cache re-run, same method, 2026-10-26):
  TTFB 820, DCL 1491, load — (never fired), idle 2449, 84 requests, ~2,584 KB, DOM
  1751 — differs from the baseline row because the Trustindex widget hydrated to a
  different state (1751 vs 1894 nodes). Conditions: both runs widget-state-dependent;
  keep both, use neither as a stable baseline. Evidence:
  `~/.codex/sessions/2026/10/26/rollout-2026-10-26T06-49-44-01a1768b-0509-7b53-a12e-2a6a9dd92e6e.jsonl`
  (isolated re-run tool result; the batch run's byte counts were skewed by shared HTTP
  cache, which is why the isolated re-run exists).

## 5. Coverage and limitations

Screenshot coverage: 874 page/width combinations across 23 widths, zero failed
captures, tile reconciliation exact. Full audit, the 319/320/321/639/640/641 boundary
recapture and the remaining single-pixel gaps (478, 577, 599, 766, 781, 978, 981, 990,
993, 998, 1198, 1201; 981 the only literal direction gap with a plausible layout effect):
[coverage-audit.md](coverage-audit.md). This report adds no new capture claims.

## 6. Route and content inventory

38 sitemap URLs (recheck 2026-10-26, identical to the campaign manifest set; raw fetch
`/tmp/opencode/paulshof/sitemap-recheck-20261026.json`).

Pages (10): /, /gallery/, /rates/, /guest-book/, /map/, /things-to-do/, /contact-us/,
/767-2/, /virtual-tours/, /v-tours/.

Posts (28): /the-sterkfontein-caves/, /maropeng-cradle-of-human-kind/,
/johannesburg-country-club/, /bryanston-country-club/, /cedar-square/,
/prison-break-market/, /pineslopes-boulevard/, /montecasino/, /design-quarter/,
/orexi-greek-street-food/, /extreme-adventures-in-johannesburg/,
/carnivores-restaurant/, /hello-world/, /the-rhino-and-lion-park/,
/the-johannesburg-zoo/, /pilansberg-nature-reserve/, /sun-city/, /gold-reef-city/,
/johannesburg-botanical-gardens/, /hartbeespoort-dam/, /montecasino-bird-gardens/,
/nelson-mandela-square/, /rosebank-mall/, /sandton-city/,
/the-sandton-convention-centre/, /gallagher-convention-centre/, /moyo/,
/yamato-japanese-restaurant/.

Disposition facts for the four duplicate/test routes (live recheck 2026-10-26):

| Route           | Disposition                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /767-2/         | Guest-testimonials page; title literally "- No 5 On Franschoek" (empty slug artifact); h1 "What Our Guests Say About no 5 on Franschoek"; meta description is a review quote |
| /hello-world/   | WordPress-default slug retained after content was replaced; a Soweto blog post (title "Soweto - No 5 On Franschoek", published 2010-11-09, author Stephan Uys)               |
| /v-tours/       | One of two near-identical tour pages: same 4 luxury rooms (Blue/Orange/Red/Black) and YouTube room-tour embeds; no meta description                                          |
| /virtual-tours/ | Duplicate of /v-tours/; additionally a duplicated H1 and a repeated iframe (video `MezOJv68rHs` twice); no meta description                                                  |

## 7. Conditions, limits and not-reproducible items

- "No 5 on Franschhoek" as the business name is an **unresolved owner decision**, not a
  verified correction. Live, the name appears as "No 5 On Franschoek" (no h in
  "Franschoek") in every title/og tag and in body h1s; the planning docs use
  "Franschhoek" (with h). "Paulshof" is a location, not an approved rebrand.
- The reported "Franschoek Cl" vs "Lane" address conflict is **not reproducible**: 0
  hits on live home/contact/map (live recheck 2026-10-26). All pages consistently say
  "5 Franschoek Lane, Paulshof, Sandton". Only real address discrepancies: body text
  omits postal code 2191 (`src/home.html` "Where to Find Us"), and the footer prints
  "Sandton ,2191" (space before the comma, 8× footers).
- Guest-book heights/DOM/requests are widget-state-dependent (Trustindex hydration;
  provenance in coverage-audit.md boundary section). Guest-book `load_ms` is missing in
  both perf runs.
- Headless capture aborts, not verified live defects: Google Maps embed
  (`ERR_ABORTED` on / and /contact-us/), home hero `5-on-Franschoek-Hero.mp4`, and GA
  collect requests (`web-check-mobile-400.json` failed_requests). Map embeds can render
  blank in automation (cf. `01-style-guide-and-critique.md` finding 5).
- Not re-verified per handoff (cited as "live recheck 2026-10-26"): favicon 404,
  /oldsite/things.php 404, http→https and /gallery/ 301s, and the four route
  dispositions in §6.
- Performance is single-run, capped at 100 requests, one viewport (1440px); the
  1440px numbers do not describe mobile load, and the two capped rows undercount
  requests/bytes.
- This report covers the 5 core pages for a11y/behaviour and the 8 snapshot pages for
  content; the remaining 30 sitemap URLs were covered by screenshots only (plus the
  link audit and sitemap recheck) — their a11y/keyboard state is untested.
