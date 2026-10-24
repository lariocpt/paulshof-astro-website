---
name: astro-client-routing
description: "Implement or debug Astro ClientRouter navigation, lifecycle scripts, persistent UI, and history. Use when adding client-side routing or fixing interactions after page swaps."
license: MIT
---

# Astro client-side routing

Inspect Astro version, layouts, scripts, hydration, and CSP before adding routing.
Use `ClientRouter` from `astro:transitions` in Astro 5+; older examples may call it
`ViewTransitions`. Keep normal document navigation when client routing adds no value.

## Choose and integrate the router

- Add one `<ClientRouter />` to the shared layout's `<head>` on participating
  pages. Both ends of a client navigation must include it. Existing static
  routes remain build-generated HTML; no SSR adapter or SPA catch-all is required.
- Native cross-document view transitions animate ordinary document navigation;
  they do not provide Astro's client lifecycle or persistent islands. Choose
  deliberately rather than treating animation as a requirement for client routing.
- Astro's built-in `security.csp` currently documents `ClientRouter` as unsupported.
  Check version-specific support and actual hosting headers first. Preserve
  required CSP; use document navigation/native transitions when incompatible,
  rather than disabling protection or broadly allowing inline code.
- Keep real anchor URLs, including the configured base path. Use
  `data-astro-reload` on links/forms requiring full document navigation.
  Preserve modified clicks, downloads, external links, and new-tab behavior.
- For programmatic navigation, import `navigate` from `astro:transitions/client`;
  validate user-controlled destinations. Use `history: 'replace'` or
  `data-astro-history="replace"` only when replacing history is intended.
- Router-handled forms support GET/POST, but do not create a POST endpoint for
  static hosting. Preserve submit/validation semantics and the receiving service's
  encoding requirements; use `data-astro-reload` where its integration needs it.

## Script lifecycle

Processed module scripts execute once, not on every visit. Inline scripts can
rerun; `data-astro-rerun` opts into rerunning inline code and bypasses normal
Astro processing. Prefer lifecycle-aware processed scripts for reusable behavior.

- Register document lifecycle listeners once from a processed script. Initialize
  page DOM on `astro:page-load`, which covers initial load and subsequent visits;
  `DOMContentLoaded` alone misses client navigations.
- Make setup idempotent and clean up outgoing listeners, observers, timers, and
  widgets. Do not destroy persisted UI unconditionally; give it its own lifecycle.
- Use `astro:before-swap` for outgoing DOM cleanup or destination theme preparation,
  `astro:after-swap` for immediate post-swap work, and `astro:page-load` for ready UI.
  Prefer existing framework/custom-element lifecycles where they already suffice.

```astro
---
// Shared layout; pages supply title and optional non-persisted counter buttons.
import { ClientRouter } from 'astro:transitions';
interface Props { title: string }
---
<html lang="en">
  <head><meta charset="utf-8" /><title>{Astro.props.title}</title><ClientRouter /></head>
  <body><slot /></body>
</html>
<script>
  let listeners: AbortController | undefined;
  function setup() {
    listeners?.abort();
    listeners = new AbortController();
    const { signal } = listeners;
    document.querySelectorAll<HTMLButtonElement>('[data-counter]').forEach(button => {
      button.addEventListener('click', () => {
        const count = Number(button.dataset.count ?? 0) + 1;
        button.dataset.count = String(count);
        button.textContent = `Count: ${count}`;
      }, { signal });
    });
  }
  document.addEventListener('astro:before-swap', () => listeners?.abort());
  document.addEventListener('astro:page-load', setup);
</script>
```

## Persistence and navigation behavior

- Use `transition:persist` only for deliberate continuity, such as a media player.
  Match corresponding elements with stable, unique `transition:name` values when
  necessary. Persistence is not durable storage across reloads or browser sessions.
- Persisted islands retain state but normally receive new props. Add
  `transition:persist-props` only when old props should remain too; avoid stale
  route-specific content, identity, or authorization data.
- Give each route an accurate title for Astro's built-in route announcer.
  Check keyboard focus, hashes, scroll restoration, and reduced motion; do not
  replace browser Back behavior with unconditional scrolling to the top.
- Apply theme state to the incoming document before swap to avoid flashes.
  Track analytics on completed navigations without double-counting initial load.
  Inspect prefetch configuration and request cost before enabling extra eager fetching.

## Verify

- Build and preview production output. Exercise direct nested-route loads,
  A→B→A, Back/Forward, hash/query URLs, forms, and explicit reload links.
- Repeat navigation and operate controls: one action must trigger one update,
  with no stale elements, duplicate subscriptions, or uncaught errors.
- Check intended persistence/reset, fresh metadata, focus, reduced motion,
  no-JavaScript navigation, and actual CSP headers. Build success alone does not
  prove navigation compatibility; test with the deployment's policy when present.

## Sources

- [Astro routing and view transitions](https://docs.astro.build/en/guides/view-transitions/)
- [Router API and lifecycle events](https://docs.astro.build/en/reference/modules/astro-transitions/)
- [Script processing](https://docs.astro.build/en/guides/client-side-scripts/)
- [Persistence and props](https://docs.astro.build/en/guides/view-transitions/#maintaining-state)
- [CSP limitations and prefetch configuration](https://docs.astro.build/en/reference/configuration-reference/)
