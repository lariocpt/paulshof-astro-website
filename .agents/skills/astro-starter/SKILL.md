---
name: astro-starter
description: Apply the static Astro starter practices for page/content ownership, native token CSS, client routing, CSP and compatible verification. Use when building or maintaining a website derived from the shared starter.
license: MIT
---

# Astro starter practices

Read the consuming project's README and AGENTS.md first. Preserve its identity,
public origin, deployment boundaries, package manager and actual Astro/Vite versions.
These are conventions for starter-derived websites, not rules for all Astro apps.

## Ownership

- Routes compose the shared Layout. The layout owns the document, navigation,
  footer and one main landmark. Keep SEO generation in its shared component.
- Editorial copy lives in typed Markdown/MDX collections, including page
  descriptions. Shared identity and labels use the site's configuration module.
  Sort repeated collections by explicit order rather than filename.
- Reuse templates for repeated fragments; use props/slots for variation and do
  not add wrappers simply to extract a component.
- Use native CSS and semantic custom properties. Globals own tokens, local fonts,
  the reset and genuine shared primitives; component CSS belongs in scoped style
  blocks. Scope MDX selectors beneath their owning content wrapper.
- Import content imagery through astro:assets. Reserve dimensions and provide
  alt text. Fixed-path fonts/icons stay public; font licenses travel with assets.

## Navigation, content and security

- Keep real static route URLs and one ClientRouter in participating layouts.
  Do not add an SPA catch-all or SSR adapter for client navigation.
- Processed scripts run once. Initialize controls on astro:page-load and clean
  listeners, observers and timers on astro:before-swap. Prepare the incoming
  theme before swap. Persist UI only deliberately; navigation must stay current.
- Preserve the starter's custom build-wide hash CSP integration. The installed
  framework's built-in CSP must not be enabled alongside it when ClientRouter
  is unsupported. Keep processed modules external with assetsInlineLimit: 0.
- Finish HTML/inline-code/CSS optimization before final CSP hashes, and compress
  afterward. Do not weaken enforcement with unsafe-inline, unsafe-eval, data:
  scripts or reusable nonces. Netlify frame-ancestors needs an HTTP header.
- Static content and navigation remain usable without JavaScript. Respect
  reduced motion, unique IDs, headings, visible focus and keyboard behavior.
- The starter contact form remains a demo until a real handler is explicitly
  implemented. It opts out of router interception with data-astro-reload and
  cancels submission itself; do not POST or leak fields into a URL.
- Default robots.txt to Disallow: /. Only the exact build-time
  ROBOTSTXT=ENABLED value allows crawling; indexing metadata remains independent.
- Build public origins from configuration; sample identities remain unindexed.
  Do not copy a previous project's claims, contacts or infrastructure.

## Quality gates

Use Bun and bun.lock. Preserve the TypeScript 7 compiler and TypeScript 6 API
compatibility aliases while Astro/ESLint need both. Pre-commit checks source
conventions, Astro/TypeScript, ESLint, Stylelint and Prettier without bypasses.
Use the Astro Prettier plugin, postcss-html for Astro styles, and a final
eslint-config-prettier preset; linters own correctness, Prettier owns formatting.

Run the full project verification including production output/CSP checks and
compressed-byte round-trips. Check 320px and enlarged text; light/dark/system;
A→B→A, Back/Forward, direct nested loads, hash/query URLs, fresh metadata,
repeated controls, theme continuity and no-JavaScript navigation. Test the
built policy; development success does not prove production compatibility.
Do not deploy or change hosting as a side effect of site implementation.

## Sources

- [Astro layouts](https://docs.astro.build/en/basics/layouts/)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro client navigation](https://docs.astro.build/en/guides/view-transitions/)
- [Astro configuration](https://docs.astro.build/en/reference/configuration-reference/)
