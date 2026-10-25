# Implementation handoff

The website implementation remains a separate phase. This pack establishes source
coverage, visual evidence, a proposed brand direction and component ownership; it does not
publish or replace the starter application.

1. Confirm the brand direction, legal business identity, booking destination and real
   contact form behaviour. Retain existing verified content and correct obvious grammar
   without inventing facts.
2. Map all sitemap routes into typed content/page compositions. Review obsolete or
   duplicate tour routes deliberately; preserve needed redirects and anchors.
3. Download the real site assets into the project, retain provenance, package licensed
   fonts, and use Astro Image/Picture with meaningful alt and dimensions.
4. Adapt shared Layout/SEO/site.ts and reusable components. Keep the single ClientRouter,
   static HTML navigation and existing build-wide hash CSP.
5. Generate missing descriptions/OG metadata from verified page content. Keep public
   origins and crawling/indexing policy explicit at build time.
6. Preserve bundle optimisation, precompression and cache headers. Test actual production
   output, keyboard access, menu states, forms, routes, image loading, reduced motion,
   themes, zoom and reflow. Run the repository's bun run verify.
7. Use image_screenshots against the local preview, then image_design_analysis for paired
   source/implementation review. Check computed contrast separately.

The local tools are now shared in machine-setup's images MCP: screenshot jobs, sequential
vision review, job progress/cancellation and contrast measurement. Generation remains on
the idle RTX 5080; analysis prefers RTX 3060 Ti, falling back to RTX 5080 when unavailable
or beyond the small-input limits. Image attachments in OpenCode use the same vision route
before text-model inference.
