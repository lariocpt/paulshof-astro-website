# Screenshot coverage audit — before-state evidence

Durable audit of all saved screenshot-job artifacts for the old
https://www.accommodationpaulshof.co.za . Read from disk only (job
`captures.json` manifests, `request.json`, image files). Companion to
[capture-manifest.json](capture-manifest.json) (the original 646-entry
campaign manifest).

Job artifact root: `~/.local/share/lario-images/jobs/` on cachyos-mini-mobile.

## Job inventory

| Job                            | Kind            | Captures | Notes                                                                                       |
| ------------------------------ | --------------- | -------- | ------------------------------------------------------------------------------------------- |
| `20261026-000817-f9dc5d5746c3` | screenshots     | 2        | Initial probe: home @ 400, 1440 (superseded by campaign)                                    |
| `20261026-001547-f48f85eae877` | screenshots     | 256      | Campaign batch 1                                                                            |
| `20261026-001547-5897b9a63194` | screenshots     | 48       | Campaign batch 2                                                                            |
| `20261026-002046-06181c68bd43` | screenshots     | 252      | Campaign batch 3                                                                            |
| `20261026-002046-011ce253eb86` | screenshots     | 90       | Campaign batch 4                                                                            |
| `20261026-002802-8cbfa9e89525` | screenshots     | 5        | Tiled recapture: gallery @ 400/479/480/576/1920                                             |
| `20261026-002802-eafa8a81803b` | screenshots     | 6        | Tiled recapture: things-to-do @ 400/479/480/576/600/767                                     |
| `20261026-012253-0fef28777414` | screenshots     | 192      | Supplemental: 32 URLs @ 481/575/601/769/783/1000                                            |
| `20261026-012436-247b60a63538` | screenshots     | 36       | Supplemental: remaining 6 URLs @ same widths                                                |
| `20261026-192633-9941d7e55f71` | screenshots     | 18       | Boundary recapture: 3 pages @ 319/320/321/639/640/641 (this audit)                          |
| `20261026-034541-319502a1eeba` | design analysis | —        | Vision review of 5 pages @ 400/1440 (see `docs/designs/`, `01-style-guide-and-critique.md`) |

Excluded (different site, Beast Code localhost at `192.168.10.243:4321`,
never Paulshof): `20261026-062136-82aca1831568`,
`20261026-085216-3fc3315a46e4`, `20261026-085216-e7262dc543f6`.

## Tile reconciliation (original campaign)

- Manifest: **646** unique page/width captures, header `image_files: 658`.
- 11 manifest entries carry a `tiles` list (primary + continuation),
  referencing 23 files total; 11 of those references are the primaries
  already counted in the 646, so **658 = 646 primaries + 12 continuation
  tiles**. Reconciled exactly.
- The 11 tiled combinations were recaptured with tiling because their
  first pass exceeded the 12,000px image cap:
  - `gallery/` @ 400, 479, 480, 576, 1920
  - `things-to-do/` @ 400, 479, 480, 576, 600, 767
- Recapture jobs `20261026-002802-*` hold 23 image files (11 primaries +
  12 tiles); all present on disk, zero missing.
- Batches 1–4 also contain earlier (untiled, >12,000px) captures of the
  same 11 pairs (overlap 3 + 3 + 0 + 5 = 11). Those superseded captures
  are not referenced by the manifest.

## Supplemental widths (228 captures)

- 192 + 36 = **228** captures covering all 38 URLs @ 481/575/601/769/783/1000.
- Zero missing files, zero non-`ok` status, zero `truncated`, zero
  `horizontal_overflow`.
- Five captures exceed the 12,000px cap and carry continuation tiles
  (verified on disk, exact geometry):

| Page         | Width | page_height | Tiles                       |
| ------------ | ----- | ----------- | --------------------------- |
| gallery      | 481   | 13132       | y=0 h=12000, y=12000 h=1132 |
| gallery      | 575   | 13036       | y=0 h=12000, y=12000 h=1036 |
| things-to-do | 481   | 17063       | y=0 h=12000, y=12000 h=5063 |
| things-to-do | 575   | 19650       | y=0 h=12000, y=12000 h=7650 |
| things-to-do | 601   | 20366       | y=0 h=12000, y=12000 h=8366 |

- A page taller than the 1000px viewport does not require tiles; full-page
  capture continues to the 12,000px cap.
- All 228 supplemental captures had page_height > 1000 (min 1177);
  dimension checks against page heights showed zero coverage mismatches.

## Combined coverage

- **874 unique page/width combinations** across 23 widths:
  400, 479, 480, 481, 575, 576, 600, 601, 767, 768, 769, 782, 783, 979, 980,
  991, 992, 999, 1000, 1199, 1200, 1440, 1920.
- This counts unique combinations only; historical job entry totals include
  the 11 recaptured pairs and must not be conflated.
- Widths not captured anywhere: 319, 320, 321, 478, 577, 599, 639, 640,
  641, 766, 781, 978, 981, 990, 993, 998, 1198, 1201 — until the boundary
  recapture below (192633) covered the 320/640 groups on the affected pages.

## Boundary analysis (literal B−1 / B / B+1)

Saved CSS metadata exposes these width thresholds (union over 8 campaign
jobs): 320, 479, 480, 576, 600, 640, 767, 768, 782, 979, 980, 991, 992,
999, 1199, 1200.

Literal probes before the boundary recapture (✓ = captured):

| B    | B−1 | B   | B+1 |
| ---- | --- | --- | --- |
| 320  | ✗   | ✗   | ✗   |
| 479  | ✗   | ✓   | ✓   |
| 480  | ✓   | ✓   | ✓   |
| 576  | ✓   | ✓   | ✗   |
| 600  | ✗   | ✓   | ✓   |
| 640  | ✗   | ✗   | ✗   |
| 767  | ✗   | ✓   | ✓   |
| 768  | ✓   | ✓   | ✓   |
| 782  | ✗   | ✓   | ✓   |
| 979  | ✗   | ✓   | ✓   |
| 980  | ✓   | ✓   | ✗   |
| 991  | ✗   | ✓   | ✓   |
| 992  | ✓   | ✓   | ✗   |
| 999  | ✗   | ✓   | ✓   |
| 1199 | ✗   | ✓   | ✓   |
| 1200 | ✓   | ✓   | ✗   |

18 literal probes were missing. Only B=480 and B=768 were fully covered.

### Boundary recapture (job `20261026-192633-9941d7e55f71`)

The `(max-width: 320px)` and `(max-width: 640px)` queries appear in the
saved per-page metadata **only on 3 pages**: `guest-book/`, `767-2/`,
`virtual-tours/`. Source located in
`wp-content/plugins/ts-visual-composer-extend/css/ts-visual-composer-extend-front.min.css`
(loaded by exactly those 3 pages; not on home/rates, which explains the
per-page metadata split). The queries hide small decorative elements
only:

- `@media (max-width:320px)` → `.ts-background-video-holder{display:none}`
- `@media (max-width:640px)` → typed-title `:before/:after` + `.typed-cursor` hidden

They are page-builder plugin rules, not theme layout breakpoints (the
theme breakpoints are the remaining 14 values).

Recaptured all 3 pages @ 319/320/321/639/640/641, `reload_each_width`,
full page, height 1000: **18/18 ok**, 0 missing files, 0 truncated,
0 horizontal_overflow.

page_height results:

| Page          | 319  | 320  | 321  | 639  | 640  | 641  |
| ------------- | ---- | ---- | ---- | ---- | ---- | ---- |
| guest-book    | 2707 | 3604 | 2681 | 2388 | 3261 | 3261 |
| 767-2         | 5043 | 5256 | 5234 | 4232 | 4232 | 4232 |
| virtual-tours | 2688 | 2663 | 2663 | 2616 | 2617 | 2618 |

Findings:

- **No site layout switch is demonstrated at 320 or 640.** The guest-book
  height jumps (319→320: +897px, 639→640: +873px) correlate exactly with
  Trustindex widget hydration state, not the width: at w=320 and w=640 the
  capture shows ~1565 `"Trustindex Poppins"` font nodes (fully hydrated
  review cards); at 319/321/639 only ~136 (widget shell). Same-page heights
  with the same hydration state differ by ≤25px.
- `767-2` and `virtual-tours` are stable across both boundaries (≤23px
  variance).
- Condition recorded: guest-book heights include the asynchronous widget;
  treat page_height at these widths as widget-state-dependent.

### Remaining gaps (deliberate, not claimed covered)

- Single-pixel probes still uncaptured: 478, 577, 599, 766, 781, 978, 981,
  990, 993, 998, 1198, 1201.
- Every theme breakpoint (the 14 non-plugin values) has at least one
  verified adjacent pair, except the max-width direction of `980`, which
  needs 981. That is the only literal direction gap with a plausible
  layout effect; 320/640 are captured on the 3 affected pages and
  attributed to the page-builder plugin rules above.
- Full B−1/B/B+1 coverage is **not** claimed.

## Sitemap recheck (2026-10-26)

- `sitemap.xml` index → `page-sitemap.xml` (10 loc, 3 image:loc excluded) +
  `post-sitemap.xml` (28 loc, 32 image:loc excluded) = **38 URLs**.
- Set is identical to the campaign manifest's 38 URLs (no additions, no
  removals since the original capture).
- Raw fetch saved: `/tmp/opencode/paulshof/sitemap-recheck-20261026.json`
  (temporary; the set equivalence with the manifest is the durable finding).
