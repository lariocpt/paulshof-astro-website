# Property photography: source, limits and review state

Everything here is the property's own material, fetched read-only from the previous
site on 2026-10-27. No generated imagery is used anywhere in the build, and no
third-party logo or review-widget image was carried over.

## What is in the repo

| Path                                | What it is                                                  |
| ----------------------------------- | ----------------------------------------------------------- |
| `src/assets/property/<group>/*.jpg` | 110 frames, imported through `astro:assets`                 |
| `docs/content/photo-provenance.csv` | slug → source path on the old host, plus width/height/bytes |
| `src/data/photography.ts`           | typed access: groups, covers, hero, held-back list          |

Group labels and order follow the previous gallery's own headings: Exterior & Gardens,
Interior (which is where the kitchen frames were shown), Room 1 — Self Catering,
Room 2 — Self Catering, Room 3, Room 4 — Self Catering, Room 5, Room 6,
Room 7 — Poolside Room.

## Dropped on purpose

- Seven thumbnails too small to use (107×160, 120×160, 200×202) — listed in the
  provenance run log, not in the repo.
- All theme artwork (`wp-content/themes/TUXthemepaulshof9/images/logo-*.png`) — replaced
  by a real vector mark.
- Third-party attraction logos (Bryanston, JCC, Cedar Square, Montecasino and similar) —
  attraction entries are text-only.
- Trustindex and TripAdvisor imagery, and the review widget itself.
- `5-on-Franschoek-Hero.mp4` was not downloaded: the opening frame is a still, and the
  archive's two wide stills carry it without the weight.

## The resolution limit (this constrains every layout)

Only two frames exceed 1000 px: `property-03.jpg` (2560×1920, a bedroom) and
`property-02.jpg` (2560×1920, held back, see below). The remaining 108 frames are
600–999 px, mostly 800×600 or 450×600 portraits.

Therefore:

- Images are never upscaled. A full-bleed 2× hero cannot be served from this archive, so
  the hero is built at real widths (640/1280/1920) from `property-03.jpg` and nothing else.
- Cards, gallery tiles and section images request widths at or below each frame's own
  width; `astro:assets` will not invent pixels.
- Any future full-width poster needs a new, genuinely large photograph from the owner.

## Held back from publication

`property-02.jpg` shows four people posing on the lawn. The site's copy names two hosts,
so the image cannot be captioned from the evidence, and publishing identifiable people is
the owner's call. It stays in `src/assets/property/property/` but is excluded by the
`held` set in `src/data/photography.ts`, so no page can render it. It needs one of:
a confirmed caption naming who appears, consent to publish, or deletion.

## Alt text state

Alt text is the weakest verified part of this migration and is deliberately conservative:

1. Every `Image` carries an explicit `alt`; decorative uses carry `alt=""`.
2. Until a string is reviewed here, alt text states only what the group heading and the
   sequence imply (for example "Garden and grounds, frame 4 of 34"). Nothing speculative
   — no claim about what a room contains, how many beds it has, or who appears.
3. The review table below is where owner-checked descriptions go. A row is only copied
   into the site once the owner has confirmed it.

| Slug                      | Draft (unverified) | Owner confirmed |
| ------------------------- | ------------------ | --------------- |
| `property-03.jpg`         | —                  | ☐               |
| `exterior-gardens-01.jpg` | —                  | ☐               |
| `interior-01.jpg`         | —                  | ☐               |

(Machine vision produced a caption for `property-03.jpg` reading "a neatly made bed with
red and white linens, white nightstands and a vanity". It is recorded here as an
unverified draft, not as fact: the caption was produced by a model looking at the frame,
and colour or furnishing errors would become false statements on a booking site.)

## Fonts

`public/fonts/` ships Archivo (existing, OFL) and the Fraunces latin, latin-ext and
vietnamese subsets (`fraunces-*.woff2`), with `FRAUNCES-OFL.txt` beside the existing
`OFL.txt`. Only the latin subset of each family is preloaded. Both are locally hosted;
no font origin is contacted at runtime.
