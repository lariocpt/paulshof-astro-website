---
name: add-page
description: Add or change routes in this Astro starter using its shared layout, content, metadata, navigation, and verification practices. Use for a new page or route-level composition.
---

# Page workflow

- Inspect an existing route and `src/content.config.ts` before adding a page.
- Create the route in `src/pages/` and a typed `pages` MDX entry with its heading,
  metadata description, and prose. Use `getEntry` and fail clearly if required
  content is missing.
- Compose `Layout` and `PageHeader`; do not reproduce the document/head. Pass
  `entry.data.description` and the intended title. Inner pages can pass breadcrumbs.
- Reuse collection components. Use heading level 2 for lists directly below a
  page h1, and 3 when below a section h2. Ensure the final page has one h1 and main.
- Update `navItems` in `src/site.ts` only when the page belongs in primary navigation.
  Explicitly unlisted pages need not become menu entries.
- Keep component-specific styles scoped. Page-only layout CSS can stay with its
  route; repeated structure and styling belong in a reusable component.
- Add accurate structured data only when the real content supports it. Do not
  add fictional people, organizations, testimonials, or outcomes from a sample.
- Confirm the generated sitemap includes the new public route. Keep 404 unindexed.
- Run `bun run verify`, then test keyboard navigation, theme modes, and narrow
  layouts. Read README.md before changing public origin or indexing configuration.
