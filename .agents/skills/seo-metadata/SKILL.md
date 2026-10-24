---
name: seo-metadata
description: Create or review page metadata for search and social previews, including titles, descriptions, canonical URLs, indexing directives, and Open Graph tags. Use for document head or framework metadata changes.
license: MIT
---

# SEO metadata

Inspect the router, rendering model, public origin configuration, and current
metadata ownership. Make metadata accurate for the actual public page; do not
invent company details, production domains, or promises about search ranking.

## Page and social metadata

- Give indexable pages descriptive titles and concise, relevant descriptions.
  Use shared title templates without duplicating the site name on every layer.
- Generate canonical URLs from the known public origin and the intended route.
  Preserve meaningful URL distinctions; remove tracking parameters where
  appropriate, not every query parameter indiscriminately.
- Supply relevant Open Graph title, description, type, URL, and image metadata.
  Use absolute public image URLs, descriptive image alt text, and correct
  dimensions. Add the appropriate social card fields for the platforms in use.
- Ensure preview images are fetchable by crawlers without login. Do not use
  private user content or an authenticated image URL as a public social preview.
- Set the document language, encoding, and responsive viewport through the
  framework's supported mechanism. Do not duplicate defaults it already emits
  or disable user zoom through viewport settings.
- Preserve intentional indexing rules. Authenticated pages, internal search,
  and staging sites may need different rules from public content. Robots
  directives are not access control, and robots.txt blocking can prevent a
  crawler from seeing a page's `noindex` directive.
- Add robots.txt, sitemaps, localized alternates, or structured data when the
  requested page/site work calls for them, not automatically for every component.
  Sitemap URLs should represent canonical indexable content.

## Framework ownership

- In the Next.js App Router, use static `metadata` or `generateMetadata` for
  the route, plus supported file conventions for icons and social images.
  Inspect the installed version's metadata and viewport APIs.
- Configure `metadataBase` from a known deployment origin where relative
  metadata URLs need resolution. Do not commit an illustrative origin as real.
- Account for nested metadata merging: a route-specific Open Graph object may
  replace inherited fields rather than deeply merging them.
- In other frameworks use their head/metadata integration. Avoid competing
  manual head tags and framework-generated equivalents.
- Ensure essential metadata appears in crawler-visible output using the
  framework's supported rendering or streaming behavior; do not rely only on
  client effects that run after mount.

```ts
// Parent layout supplies metadataBase; the public image file already exists.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility guide",
  description: "Practical guidance for accessible web interfaces.",
  alternates: { canonical: "/guides/accessibility" },
  openGraph: {
    title: "Accessibility guide",
    description: "Practical guidance for accessible web interfaces.",
    type: "article",
    url: "/guides/accessibility",
    images: [{ url: "/og/accessibility.png", alt: "Accessibility guide" }],
  },
};
```

When inheriting a shared image instead, explicitly preserve it if overriding
`openGraph` would otherwise discard it.

## Verify

- Inspect resolved metadata for representative static and dynamic routes,
  including inherited fields, absolute URLs, and duplicate tags.
- Verify crawler-visible output and social image HTTP responses on the intended
  environment. Check indexing directives before publishing a public route.

## Sources

- [Next.js metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Open Graph protocol](https://ogp.me/)
- [Google robots metadata](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
