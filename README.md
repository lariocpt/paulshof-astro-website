# Astro website starter

A neutral static website example built with Astro, typed MDX collections, and
native CSS design tokens. The current toolchain uses Astro 7, scoped component CSS, and
TypeScript 7. Replace the example identity, content, and artwork to implement
your own website while keeping the structure and verification practices.

## Run locally

Use Node.js 22.23.4+ (required by Astro) and Bun 1.4.3+ as declared in
`package.json`. Commit `bun.lock` as the sole dependency lockfile.

```sh
bun install --frozen-lockfile
bun run dev
```

The dev server prints its local URL. `bun run preview` serves a completed build.

## Make a website

1. Set the package name in `package.json` and regenerate the lockfile with Bun.
2. Edit `src/site.ts` for the name, locale, shared UI labels, and navigation.
   Change theme values in `src/styles/global.css`; keep the browser chrome
   colors in `site.theme` aligned with them.
3. Replace `src/content/**/*.mdx`. All business/project examples are fictional;
   sample milestone dates are not a company history. Page headings, metadata
   descriptions, and editorial prose live in these collections.
4. Adapt the page compositions in `src/pages/`. Reuse components instead of
   copying fragments, and keep component-specific authored CSS scoped with them.
5. Replace the example artwork and icons described in [docs/brand.md](docs/brand.md).
   Keep locally packaged font licenses when changing fonts.
6. Decide what the contact page actually does. The included form validates and
   displays a demo result; it sends no email and stores no personal information.
   Real submissions need an explicitly configured handler and error/pending states.
7. Configure `SITE_URL` for your own public origin before deployment. To allow
   indexing, also set `SITE_INDEXABLE=true`. Crawling stays off unless
   `ROBOTSTXT=ENABLED` is set at build time. Defaults deliberately keep the
   example unindexed. Do not use this switch as access control.

Example build configuration:

```sh
SITE_URL=https://www.your-domain.test SITE_INDEXABLE=true ROBOTSTXT=ENABLED bun run verify
```

Replace that illustrative origin with your actual domain; omit indexing for
previews. Environment variables must be present when the static site is built.
The shared SEO component, sitemap, robots.txt, and manifest are generated from
the same build configuration and site identity. Build from the site root;
subpath hosting requires adapting routes and asset paths deliberately.

## Repository map

| Location                   | Responsibility                                               |
| -------------------------- | ------------------------------------------------------------ |
| `src/site.ts`              | Shared identity, navigation, UI labels, and indexing intent  |
| `src/content.config.ts`    | Narrow content schemas; explicit ordering for lists          |
| `src/content/`             | Typed MDX page copy, services, examples, and process content |
| `src/layouts/Layout.astro` | Document, head, primary landmark, navigation, footer         |
| `src/components/`          | Reusable presentation and scoped CSS                         |
| `src/components/Seo.astro` | Canonicals, social metadata, and structured data             |
| `src/styles/global.css`    | Theme tokens, font faces, base rules, shared primitives      |
| `src/assets/`              | Imported content images optimized by Astro                   |
| `public/`                  | Fixed-path icons and locally served fonts                    |
| `.agents/skills/`          | Cross-agent standards and local content/page/image workflows |
| `scripts/`                 | Source checks, rendered-output checks, and precompression    |

Each route composes the shared layout. Headings reflect the page structure:
shared lists accept a heading level for top-level or nested use. The same
`ServiceList` renders a summary on the homepage and details on the services page.
`NavLinks` owns one list template used by desktop and mobile navigation.

## Client-side navigation

The shared layout includes Astro's `ClientRouter`. Internal links fetch the
destination's static HTML and swap the document content without a full reload.
Every route remains directly accessible, and real links work without JavaScript.
This needs neither an SSR adapter nor a catch-all redirect.

Processed scripts run once per browser document. Mobile navigation, reveals and the
demo form initialize on `astro:page-load`; outgoing listeners, observers and timers are
cleaned up on `astro:before-swap`. The head-initialisation script re-applies `data-js`
to the incoming document before swap, so revealed content never repaints as hidden.
Navigation markup is replaced so active links and accessible names reflect the new
route. No UI is persisted by default.

Use `data-astro-reload` for links and forms that require normal document navigation.
The demo contact form uses it to avoid router interception, and its own handler
cancels submission and displays the demo result. It does not send a request.
Use `transition:persist` only when continuity is required, and verify that
persisted state cannot leave stale route-specific content or controls.

Local skills are directly discoverable by compatible agents. `CLAUDE.md` points
to [AGENTS.md](AGENTS.md), and Claude hooks use the same source checker as CI.
The generic standards are MIT-licensed copies from
[lariocpt/agent-skills](https://github.com/lariocpt/agent-skills); keep their notices.

## Verify changes

```sh
bun run check         # source conventions; no build required
bun run tscheck       # Astro templates/scripts and TypeScript 7 (alias: typecheck)
bun run lint          # ESLint + Stylelint for JS, TS, CSS, and Astro
bun run format        # Prettier formats supported project files
bun run format:check  # check formatting without writing files
bun run build         # Astro build, then .br/.gz siblings where smaller
bun run check:output  # checks the generated site
bun run test          # verifier acceptance/rejection fixtures; build first
bun run verify        # checks, build, output verification, and tests
```

The Husky pre-commit hook runs source conventions, `bun run tscheck`, and
`bun run lint`, and `bun run format:check` for the whole working tree and stops on the first failure.
`bun install` installs the hook through the prepare script. CI also runs these
checks through `bun run verify`.

TypeScript 7 supplies `tsc` through the `@typescript/native` npm alias.
ESLint and Astro's template checker still require TypeScript 6's compiler API;
the `typescript` alias points to Microsoft's `@typescript/typescript6`
compatibility package. Keep both aliases until those tools support TypeScript 7.
Astro checking fails on errors, warnings, or hints; ESLint and Stylelint allow no warnings. Prettier owns formatting; the final
`eslint-config-prettier` preset disables competing ESLint formatting rules.
Stylelint uses correctness rules and parses Astro style blocks through
`postcss-html`, with documented Astro syntax allowed. Generated assets,
lockfiles, and copied skills are excluded from formatting. Use `bun run lint:fix`
then `bun run format` to repair issues; pre-commit and CI only check files.

Rendered checks cover every HTML route, IDs and internal links, heading order,
one primary landmark and heading, metadata, image dimensions/alt, and required
artifacts. They do not replace keyboard, screen-reader, contrast, or visual testing.
Check at 320 CSS pixels, 200% text enlargement, increased browser font settings,
reduced motion, and with JavaScript disabled. Without
JavaScript the content and navigation remain available; demo submission stays
disabled rather than posting personal information into a URL.

In a production preview, test A→B→A, direct nested-route loads, Back/Forward,
hash/query URLs, reveal and scroll behaviour, updated titles/canonicals and active links,
and repeated use of navigation controls and the contact form. Confirm page swaps
actually occur without reloads, with no duplicate handlers or CSP violations.

Both Jenkins and GitHub Actions build and validate artifacts. Neither deploys.
Publish `dist/` through your chosen static host after configuring the site's
origin and contact behavior. Netlify uses `netlify.toml`; other hosts need their
own 404, caching, and header configuration. Precompressed `.br`/`.gz` files are
optional delivery optimizations: the ordinary files are always present.

## Production build optimization

Vite 8/Oxc minifies and tree shakes JavaScript while preserving side effects;
Lightning CSS minifies split stylesheets. Production source maps are disabled.
`optimize-html.mjs` removes HTML comments, conservatively collapses whitespace,
and minifies the synchronous head-initialisation script. Local stylesheets below 4 KiB are
inlined when they have no URL/import references or integrity constraints; larger
shared CSS stays externally cacheable. This is independent of
`assetsInlineLimit: 0`, which keeps processed modules external for ClientRouter.

Build order is Astro/Vite → HTML/CSS optimization → final build-wide CSP hashes
→ Brotli quality 11/gzip level 9. Precompression uses up to four file workers,
keeps only smaller variants, removes stale variants after a shrink, and reports
raw/compressed totals. Tests check word spacing, pre/textarea bytes, JSON-LD,
CSS inlining constraints, and exact compression round-trips. Host negotiation
is still required: Netlify handles its own compression; hosts such as Caddy can
serve the generated siblings. No static Content-Encoding header is added.

Netlify response headers have one source, `public/_headers`, which Astro copies
to `dist/_headers`. Fingerprinted `/_astro/` assets receive
`public, max-age=31536000, immutable`; HTML, icons, fonts, the manifest, and other
fixed URLs retain browser revalidation (`public, max-age=0, must-revalidate`).
Keep stable-name files out of `/_astro/` so changed content always gets a new URL.

Astro's built-in `security.csp` does not support `ClientRouter`. This starter
uses a custom static-build integration in `scripts/csp-head.mjs` instead. It hashes
the final inline script/style bytes across all HTML pages, including the
head-initialisation script and JSON-LD, then inserts the same policy at the start of every head,
including the 404, before compression. A build-wide allowlist matters because a
page swap retains the original document's policy: resources from destination
routes must already be authorized. This permits the build's authored inline code
across routes, rather than limiting each page to its own inline hashes.

Processed modules remain external (`vite.build.assetsInlineLimit: 0`), avoiding
ClientRouter's `data:` module sentinel for inline modules. The integration rejects
inline modules and existing CSP meta tags; do not also enable `security.csp`.
Reveal delays use data attributes and CSSOM property updates. Prism avoids
Shiki's inline styles. Keep new scripts, styles and network destinations compatible
with the policy; inline attributes, `unsafe-inline`, `unsafe-eval` and static
nonces are not permitted.
The Netlify HTTP policy adds `frame-ancestors 'none'`, preventing embedding;
do not add a second script/style policy without accounting for policy intersection.

`bun run verify` checks CSP placement and emitted inline hashes as well as header
publication. Preview serves the production HTML policy but does not apply Netlify
headers. After an authorized deployment, inspect GET responses for `/`, a nested
page, a missing URL, a fingerprinted asset, and a fixed-path asset; check cache
directives, ETags/conditional requests, and CSP. Disable any host transformations
that rewrite hashed scripts or styles. No deployment is part of local verification.
For Netlify projects with the injected Powered by Netlify badge, disable it under
Project configuration → General if its `about:srcdoc` iframe produces CSP errors;
do not loosen the site's policy to authorize the injected badge.

## Licenses

Bundled skills include their MIT notices. Archivo font files are distributed
under the [SIL Open Font License](public/fonts/OFL.txt). Do not assume that those
licenses automatically establish licensing for every application file you add.

## Native Astro styles

Use ordinary CSS with semantic variables from `src/styles/global.css`, following
`.agents/skills/astro-styles/SKILL.md`. This starter has no Tailwind dependency.
The global file owns theme colors, paired foreground/background roles, spacing,
typography, borders, fonts, resets, and genuine shared primitives. Components
and pages own their default scoped `<style>` blocks; form fields and the section
divider live with their owning components. Consume shared spacing and color
tokens instead of scattering design values. Keep breakpoints and one-off
geometry local when they express component behavior.

The site ships one theme: the palette is the brand, and a second theme would double
every contrast decision, so no per-component dark palette exists. Adding one would mean
adding values to the global roles, never literals in a component. Stylelint rejects
literal component colors and invalid CSS, and
Prettier formats native CSS and Astro markup without competing ESLint rules.

## Crawler access

`robots.txt` disallows all crawlers by default (`User-agent: *`, `Disallow: /`).
Only the exact build-time value `ROBOTSTXT=ENABLED` emits `Allow: /`; unset,
`enabled`, `true`, and other values keep crawling disabled. Rebuild after changing
the variable because this is a static file. The sitemap URL uses `SITE_URL`.

`SITE_INDEXABLE=true` independently removes the starter's noindex metadata. Set
both flags for a public site intended for crawling and indexing. robots.txt is
a voluntary crawler instruction, not access control.
