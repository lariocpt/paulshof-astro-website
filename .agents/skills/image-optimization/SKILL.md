---
name: image-optimization
description: Add or review web images for responsive delivery, dimensions, formats, loading priority, and alternative text. Use for img, picture, Next.js Image, hero images, or image-related layout and loading performance.
license: MIT
---

# Image optimization

Inspect the actual assets, layout, framework version, and deployment support.
Optimize what users receive, not just an image filename or its CSS dimensions.

## Content and delivery

- Choose an appropriate format: modern compressed raster formats for photos,
  SVG for suitable vector artwork, and transparency/animation support when needed.
  Compare quality and bytes; converting every asset to one format is not a goal.
- Deliver image widths suited to rendered size and device pixel ratio. Use
  `srcset` and accurate `sizes` for responsive raster images, or the framework
  equivalent. `sizes` describes layout; it does not set the element's CSS width.
- Use `picture` for art direction or format alternatives when necessary.
- Reserve space using intrinsic width/height or an intentional aspect ratio.
  Keep responsive CSS proportional; cropping with `object-fit: cover` should
  preserve the subject and reflect the design's intent.
- Write alt text for the image's purpose in context. Use `alt=""` for purely
  decorative images, useful names for linked-image actions, and nearby longer
  explanations for complex diagrams. Do not repeat adjacent text unnecessarily.
- Keep meaningful content images in semantic markup rather than CSS backgrounds.
- Implement UI SVGs as stylable components that render inline markup. Fixed-path
  favicon, download, and social-preview consumers still require file assets.

## Loading

- Lazy-load below-the-fold images. Do not lazy-load the likely Largest Contentful
  Paint image; make that resource discoverable early.
- Use eager loading, high fetch priority, or preload only for genuinely critical
  images, following the framework's compatible options. Do not preload a gallery.
- Use asynchronous decoding for ordinary native images when appropriate.
  Placeholders should reserve space without adding disproportionately large data.
- Do not bypass an existing optimization pipeline unless it cannot serve the
  asset correctly. Image optimization must work in the actual deployment mode.

```html
<!-- Assumes these files exist and the image is below the fold. -->
<img
  src="/images/workshop-960.webp"
  srcset="/images/workshop-480.webp 480w, /images/workshop-960.webp 960w"
  sizes="(max-width: 48rem) calc(100vw - 2rem), 40rem"
  width="960" height="640"
  alt="Participants assembling a wooden chair at the workshop"
  loading="lazy" decoding="async"
  style="width: 100%; max-width: 40rem; height: auto"
/>
```

## Next.js integration

- Use `next/image` where its loader and deployment support optimization.
  Static imports infer intrinsic dimensions; remote sources need known
  dimensions or `fill` with a correctly positioned, sized parent.
- Supply accurate `sizes` for responsive images, especially `fill`. Restrict
  remote sources through precise `remotePatterns`; avoid broad wildcards.
- In Next.js 16+, `priority` is deprecated in favor of `preload`. Check current
  guidance: eager loading or `fetchPriority` may suit the case better. Do not
  combine `preload` with conflicting loading/priority options.
- SVGs generally do not need raster optimization. Do not enable unsafe SVG
  serving options or proxy arbitrary remote URLs merely to remove a warning.
- For static exports, use a supported custom loader or an intentional
  unoptimized/pre-generated strategy; do not assume the default server exists.

## Verify

- Inspect selected resources and transferred sizes at multiple viewport widths
  and pixel densities. Confirm space is reserved before the image loads.
- Check the critical image's request timing, secondary image lazy loading,
  alt text, crop, asset failures, and production remote-host configuration.

## Sources

- [HTML images and responsive selection](https://html.spec.whatwg.org/multipage/images.html)
- [Next.js Image API](https://nextjs.org/docs/app/api-reference/components/image)
- [WAI image alternatives](https://www.w3.org/WAI/tutorials/images/)
- [Optimizing LCP](https://web.dev/articles/optimize-lcp)
