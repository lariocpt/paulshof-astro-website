# Example identity and theme

The starter uses neutral sample identity and simple geometric artwork. Replace
the examples when implementing a real website; they are not an existing client's brand.

## Change points

- `src/site.ts`: name, short name, description, locale, navigation, and shared labels.
- `src/styles/global.css`: semantic roles, font faces, spacing, and typography.
- `site.theme`: browser chrome and manifest colors, aligned with the CSS theme.
- `src/assets/brand/mark.svg`: editable geometric mark; `public/favicon.svg` is its
  fixed-path copy. Replace public icon PNGs and the Apple touch icon at the same time.
- `src/assets/example/site-preview.svg`: source illustration for the demo hero;
  the matching PNG is imported and transformed by Astro. Replace both together.
- `src/assets/og/default.svg`: editable source for the default 1200×630 social card;
  keep its PNG counterpart synchronized. Crawlers receive the PNG, not the source SVG.

## Themes and typography

Use background, surface, text, divider, accent text, accent fill, and foreground
tokens according to their purpose. Verify contrast in both themes; a brand hue
does not automatically work for body text. Keep literal values in the theme or
artwork definitions, not feature components. Shared primitives consume tokens.

The theme selector uses native radios with system/light/dark choices. The early
head script applies an explicit preference before first paint; omitting the
attribute lets the operating-system preference take effect through CSS.

Archivo is served from local WOFF2 files with its upstream OFL notice. Only the
Latin subset is preloaded; additional declared subsets load when needed. Preserve
language coverage when replacing a font. Root sizing follows browser settings;
text, layout spacing, and component dimensions use rem/em where appropriate.

Reveal effects are optional: without JavaScript or under reduced motion, content
is visible. Do not remove that fallback when changing motion or theme behavior.
