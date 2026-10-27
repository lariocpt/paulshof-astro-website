# Identity and theme

The brand is **No 5 On Franschoek**, a bed and breakfast in Paulshof, Sandton.
"Paulshof" is the suburb, not a rebrand, and the domain name is not the business name.
Spelling, phone numbers, the email and the address are the property's own strings and are
reproduced exactly as published; changing them is an owner decision, not a copy edit.

## Change points

- `src/site.ts`: name, short name, description, locale, navigation and shared labels.
  Contact strings live here once, and components read them.
- `src/styles/global.css`: colour roles, font faces, spacing and typography.
- `site.theme`: browser chrome and manifest colours, kept aligned with the CSS roles.
- `src/assets/brand/mark.svg`: the editable vector mark; `public/favicon.svg` is its
  fixed-path copy. Public icon PNGs and the Apple touch icon change at the same time.
- `src/assets/og/default.svg`: source for the 1200×630 social card, with its PNG kept in
  step. Crawlers receive the PNG, not the source SVG.
- `src/data/photography.ts` and `docs/content/photo-provenance.csv`: the property photo
  archive, its groups and its limits.

## Colour roles

Literal colours exist only in `global.css`. Components consume roles:

| Role                               | Purpose                                    |
| ---------------------------------- | ------------------------------------------ |
| `--color-bg` / `--color-surface`   | Ivory page, warmer panel                   |
| `--color-text` / `--color-divider` | Ink, hairlines                             |
| `--color-accent-ink`               | Headings and links on ivory                |
| `--color-accent-fill` + `-on-fill` | Primary booking action                     |
| `--color-secondary-ink` / `-fill`  | Botanical support: secondary outline, meta |
| `--color-hover` / `--color-active` | Interaction states derived from ink        |

Measured opaque pairs (normal text unless noted): ink on ivory 14.158:1, burgundy on
ivory 8.977:1, white on burgundy 9.671:1, botanical on ivory 7.483:1, white on
botanical 8.062:1. A ratio measured for one pair says nothing about another surface:
translucency, photography, a hover state and a border each need their own check.
Hover and active states move darker, never lighter, for that reason.

Text links are underlined rather than carried by colour alone, and the focus indicator
is checked on every surface it can appear on, including on a filled button.

## One theme

There is no light/dark switch. The ivory-and-burgundy palette is the identity, and a
second theme would double every contrast decision without helping a guest do anything.
Everything still resolves through role tokens, so a second set would mean adding values
in `global.css` rather than finding literals in components. `head-init.js` still runs
early, because the scroll-reveal rules hide content until the observer runs: without
`data-js` — no JavaScript, or a script that failed — all content is simply visible.
That fallback must not be removed.

## Type and rhythm

Fraunces carries display, Archivo carries body and UI. Both are locally hosted from
`public/fonts` with their OFL notices; only the latin subset of each is preloaded, and
language coverage must survive any future substitution. The root size stays
browser-relative (`font-size: 100%`), and text, spacing and component dimensions use
rem/em so enlarged text and zoom reflow instead of clipping. Display sizes are bounded
`clamp()` values: never below what a 320px screen needs, never wide enough to push a
long word out of the viewport. Prose keeps a bounded measure so a line stays readable
at every width.
