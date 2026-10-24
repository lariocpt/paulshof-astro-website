---
name: add-image
description: Add or replace this starter's content imagery and social cards using Astro assets, responsive delivery, and alternative text. Use for image imports, optimized variants, and artwork replacements.
---

# Image workflow

- Put content imagery in `src/assets/`, import the source, and use `Image` or
  `Picture` from `astro:assets` as appropriate. Fixed-path favicons and font assets
  belong in `public/`; do not move them merely to satisfy a generic asset rule.
- Set alt text for the image's role in its actual context; use `alt=""` for
  decoration. Keep dimensions/aspect ratio reserved and cropping intentional.
- Supply widths and accurate sizes when the rendered width varies. Never mark
  the critical hero image lazy; use ordinary lazy loading for secondary content.
- Use `Picture` for format fallbacks; art direction with distinct source crops
  requires deliberate picture/source composition, not just a list of formats.
- Keep source/derivative artwork synchronized as described in docs/brand.md.
  The default social image is an imported PNG. To override it, pass `image` and
  `imageAlt` through Layout; Seo builds its absolute URL and dimensions.
- Favor local SVG for appropriate vector marks and compare encoded size/quality
  for raster assets. Do not force every image into one format.
- Run `bun run verify` and inspect the actual selected resource, layout, and alt.
  Check both themes and slow loading, not merely whether the import builds.
