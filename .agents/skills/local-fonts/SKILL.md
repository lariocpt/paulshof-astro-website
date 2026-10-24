---
name: local-fonts
description: Add, change, or optimize self-hosted web fonts and their CSS or Next.js integration. Use for font assets, font-family tokens, loading, fallbacks, weights, and subsets; not typography sizing.
license: MIT
---

# Local fonts

Use locally stored assets for custom web fonts. Preserve an intentional system
font stack when a custom family is unnecessary. Inspect existing assets,
licenses, language support, and font-family tokens before adding files.

## Asset and delivery rules

- Commit or package custom font files with the application so normal builds
  and runtime rendering do not depend on a third-party font service.
- Check redistribution and subsetting rights; retain required license notices.
  Do not assume that a font downloadable from a website may be redistributed.
- Prefer WOFF2 for supported web targets. Include only used weights/styles and
  needed scripts, while retaining coverage for actual content and user names.
- Use a variable font when its required axes and size are beneficial; do not
  ship both static and variable copies without a reason.
- Declare the real weight/style range. Do not mark a regular-only asset as
  supporting every weight or rely on synthetic bold/italic for brand typography.
- Choose a deliberate display strategy, usually `swap` for readable fallback
  text or `optional` when avoiding a late font swap is more important.
- Use a suitable fallback stack and metric adjustment where useful to reduce
  layout shift. Check non-Latin text and missing-glyph fallback explicitly.
- Preload only files critical to the initial route. Preloading every weight
  competes with other important resources.

## Framework integration

- In Next.js, use `next/font/local` with existing local assets. Keep definitions
  centralized where appropriate and apply its generated class or CSS variable
  to the intended subtree.
- `next/font/google` self-hosts at runtime but downloads during the build; it
  does not meet this collection's local-asset build convention.
- When exposing the generated variable through Tailwind, also apply the
  corresponding family utility. Defining a token alone does not apply a font.
- Outside Next.js, use `@font-face` with local URLs and accurate descriptors.
  Reuse the app's font token instead of repeating family strings in components.

```css
/* Assumes this asset exists and its license permits redistribution. */
@font-face {
  font-family: "Brand Sans";
  src: url("/fonts/brand-sans-latin-regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-body: "Brand Sans", system-ui, sans-serif;
}

body {
  font-family: var(--font-body);
}
```

## Verify

- Inspect computed and actually rendered fonts, not merely a CSS declaration.
- Check asset responses, applied weights/styles, language coverage, and layout
  shifts while loading. Slow or block font requests and confirm text stays usable.
- Confirm no external font-service requests occur during build or runtime.
  Run the existing build without font-service access when feasible.
- Keep font sizing and spacing in relative units; do not add a pixel root
  font size as part of installing a font.

## Sources

- [Next.js font API](https://nextjs.org/docs/app/api-reference/components/font)
- [CSS font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [CSS font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
