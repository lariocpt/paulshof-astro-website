---
name: astro-static-build
description: Optimize Astro production builds with measured HTML, JavaScript and CSS minification, tree shaking, selective CSS inlining, precompression and CSP-safe transform ordering. Use when tuning static build output or delivery size.
license: MIT
---

# Astro static build optimization

Inspect the installed Astro/Vite versions, rendering mode, routing, CSP and host
before changing build settings. Measure a production baseline: raw and compressed
HTML/JS/CSS bytes, initial stylesheet requests, shared resources across routes,
and build duration. Optimize the actual site rather than enabling every toggle.
Keep existing content, browser support, deployment targets and package manager.

## Bundling and minification

- Vite production builds already minify JavaScript, split chunks and tree shake.
  Verify defaults in installed types/docs before adding explicit settings.
  Vite 7 uses esbuild; Vite 8 uses Oxc and Rolldown. Do not copy Vite 8-only
  `rolldownOptions` or `minify: 'oxc'` into Vite 7 projects.
- Preserve side-effect detection. Blanket `moduleSideEffects: false` or an
  unqualified package-wide `sideEffects: false` can discard CSS imports and
  initialization. Avoid forced vendor chunks without measured reuse benefits.
- Use the project's CSS minifier (for example Lightning CSS), CSS code splitting,
  and Tailwind's existing content detection. Do not bolt on PurgeCSS without
  proving it retains MDX, theme, state and dynamically constructed classes.
- Keep source maps out of published output unless debugging requires them.
  Avoid dropping console/error paths or targeting `esnext` solely for size.
- Astro's `compressHTML` does not minify every inline script or remove all HTML
  comments. If those are material, use a maintained HTML parser/minifier with
  conservative whitespace handling. Preserve inline word spacing, pre/textarea
  bytes, quoted attributes, JSON-LD, hydration and navigation data attributes.
  Minify executable inline code only when CSP hashes can be generated afterward.

## CSS delivery

- Cache larger shared sheets externally; inline small route-local sheets only
  when avoiding their requests is worth repeating their bytes on navigation.
  Astro's `build.inlineStylesheets: 'auto'` uses Vite's inline threshold (normally
  4096 bytes). `always` also repeats global styles; it is not a universal optimum.
- `assetsInlineLimit` affects Astro's processed scripts as well as CSS. If client
  routing/CSP requires `assetsInlineLimit: 0`, keep it and selectively inline small
  CSS in a separate build step before hashing. Do not re-enable inline modules
  just to inline CSS: ClientRouter can generate a blocked `data:` module sentinel.
- Preserve media conditions, ordering, relevant attributes and URL resolution.
  Leave sheets with relative `url()` or `@import` external unless URLs are
  correctly rebased. Respect integrity checks and alternate/disabled stylesheets.
- If a framework has already hashed inline blocks, preserve their exact bytes
  during later HTML minification and leave framework CSS inlining in control.
  Do not invalidate a built-in CSP to gain a few bytes.

## Transform order and CSP

Finish HTML, inline JS and CSS transformations **before** generating the final
CSP, then compress the final documents. Never rewrite hashed blocks afterward.
A safe pipeline is: framework build/minification → optional HTML/CSS optimization
→ CSP finalization → Brotli/gzip → artifact verification.

Astro's built-in CSP and ClientRouter have version-specific limitations. Preserve
an existing compatible policy. With a custom policy for client page swaps, a
build-wide hash allowlist must cover destination resources under the original
document's policy; per-page hashes alone do not prove compatibility. Keep CSP
before resources. Do not add unsafe-inline, unsafe-eval or reusable nonces.

## Compression and hosting

- Generate gzip level 9 and Brotli quality 11 siblings when the target host uses
  precompressed artifacts and build cost is acceptable. Bound concurrency rather
  than reading/compressing the whole site at once. Skip already compressed
  images/fonts and tiny inputs; keep a sibling only when it is smaller.
- On repeated runs remove stale generated variants when a source shrinks or no
  longer benefits. Check decompression against the exact final source bytes.
- `.gz`/`.br` files do not configure HTTP delivery. Caddy needs precompressed
  negotiation; Netlify performs its own compression. Do not set static
  Content-Encoding headers on ordinary files or claim preview proves CDN behavior.
- Preserve revalidation for HTML/stable URLs and immutable caching only for
  fingerprinted assets. Do not change hosting infrastructure or deploy implicitly.

## Compatible quality gates

Use separate tools for separate responsibilities: ESLint for JS/TS and Astro
scripts, Stylelint for CSS and Astro style blocks, and Prettier with its Astro
plugin for formatting. Put eslint-config-prettier last, prefer Stylelint's
correctness rules, and explicitly recognize documented framework CSS syntax.
Do not disable quality rules wholesale to pass a migration. Check parser/compiler
peer compatibility; a newer TypeScript compiler may need a separate compatible
compiler API for framework tooling. Preserve project version requirements.

Expose check-only and explicit fix/format commands. Include source checks,
TypeScript checking, both linters and formatting checks in pre-commit and CI;
keep build/output/compression checks in full verification. Exclude generated
assets and copied skill packages from formatting. Prove that invalid CSS/TS is
rejected and that formatted Astro/CSS/TS passes without tool-to-tool churn.

## Verification

Run the project's full checks and a fresh production build. Compare measured
initial resources and representative navigation against the baseline; distinguish
larger HTML due to inlined CSS from total transferred page bytes. Verify all
compressed variants round-trip and hashed code matches the final CSP. Exercise
HTML fixtures with inline word boundaries, pre/textarea content and JSON-LD.

In production preview check themes, fonts, images, forms, reduced motion and
no-JavaScript content. For client routing test A→B→A, Back/Forward, direct nested
loads and hash/query URLs with no CSP violations or duplicate initialization.
Report actual byte/request changes and remaining host-only verification. Do not
call a build optimal merely because it passes or has more optimization flags.

## Sources

- [Astro build settings](https://docs.astro.build/en/reference/configuration-reference/#build-options)
- [Vite build options](https://vite.dev/config/build-options)
- [Rolldown tree shaking](https://rolldown.rs/options/treeshake)
- [HTML Minifier Terser options](https://github.com/terser/html-minifier-terser#options-quick-reference)
- [Caddy precompressed files](https://caddyserver.com/docs/caddyfile/directives/file_server#precompressed)
- [Netlify compression](https://docs.netlify.com/build/caching/caching-overview/)

- [Prettier and linters](https://prettier.io/docs/integrating-with-linters)
- [Stylelint configuration](https://stylelint.io/user-guide/configure/)
