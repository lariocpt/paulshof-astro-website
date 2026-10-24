# Website implementation practices

Read [README.md](README.md) for setup, ownership boundaries, and deployment
configuration. This is a static Astro website starter with illustrative content.

- Read the relevant `.agents/skills/*/SKILL.md` before changing that area.
  Start with `add-page`, `add-content-block`, or `add-image` for those workflows;
  `astro-componentization` covers extraction and CSS ownership.
- Pages compose `Layout`; the layout owns the document, head, navigation, footer,
  and one `main`. SEO belongs in `Seo.astro`, not duplicated across pages.
- `Layout` includes one Astro `ClientRouter`. Keep real anchor URLs and static
  HTML routes; do not add an SPA catch-all or SSR adapter for navigation.
  Read `astro-client-routing` before changing page-swap behavior.
- Processed scripts execute once. Initialize page controls on `astro:page-load`
  and clean up listeners, observers, and timers on `astro:before-swap`. Prepare
  theme state on the incoming document before swap. Use `transition:persist`
  only for deliberate continuity; route-specific navigation must stay current.
- Preserve the custom build-wide hash CSP in `scripts/csp-head.mjs`. Astro's
  built-in `security.csp` does not support `ClientRouter`; do not enable it
  alongside this integration or weaken the policy with `unsafe-inline`,
  `unsafe-eval`, `data:` scripts, or static nonces. Keep processed modules
  external with `vite.build.assetsInlineLimit: 0`.
- Keep editorial text in typed MDX collections. Page descriptions come from the
  same entry as the visible content; shared identity and UI labels live in `site.ts`.
  Repeated collections sort by explicit `order`, not filenames.
- Give repeated HTML fragments a single template. Reuse the existing component
  before creating one; use props/slots for variation. Do not add DOM wrappers
  simply because a component was extracted.
- Read `astro-styles` before styling. Use native CSS and shared semantic variables;
  this starter does not use Tailwind. Component colors must consume theme tokens.
- Component-specific CSS belongs in scoped style blocks or existing utilities.
  Globals hold theme tokens, fonts, base rules, and genuine shared primitives.
  Scope Markdown selectors under the owning content wrapper.
- Use semantic elements, correct heading levels, keyboard behavior, visible focus,
  useful names, and only applicable ARIA. Preserve unique IDs across instances.
- Use relative typography and spacing; keep the browser-relative root size.
  Check narrow screens, zoom, and enlarged text instead of hiding overflow.
- Import content imagery through `astro:assets`; reserve dimensions and set alt.
  Keep icons/fonts with fixed public paths. Custom fonts are local with their license.
- Keep static content usable without JavaScript and with reduced motion. Add
  client JavaScript only where interaction requires it. The contact form is a
  demo until a real handler is explicitly implemented; never report a fake send.
  The demo form opts out of router interception with `data-astro-reload` and
  cancels submission in its own handler; it must never POST or leak fields to a URL.
- Generate robots.txt from build-time `ROBOTSTXT`; only `ENABLED` permits crawling.
  Keep the default blocked and indexing metadata independently controlled.
- Configure public origins at build time; default samples stay unindexed.
  Never copy a previous project's identity, contact details, claims, or deployment.
- Use Bun and `bun.lock`; run `bun run verify` after substantive site changes.
  Pre-commit runs source conventions, `bun run tscheck`, and `bun run lint`, and `bun run format:check`;
  fix diagnostics rather than bypassing the hook. Preserve the TypeScript 7
  compiler and TypeScript 6 tooling compatibility aliases.
  Source checks are heuristic; the production build/output checks and manual
  keyboard/theme/reflow checks provide additional evidence.
- Verify client routing with A→B→A, Back/Forward, direct nested loads, hash/query
  URLs, repeated control use, fresh metadata, theme continuity, reduced motion,
  and no-JavaScript navigation. Exercise the built CSP and Netlify headers;
  a successful development session does not establish production compatibility.
- Do not deploy or change hosting infrastructure as a side effect of editing a page.
