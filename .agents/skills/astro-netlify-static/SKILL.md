---
name: astro-netlify-static
description: "Configure Astro static builds on Netlify with browser cache headers, fingerprinted assets, and hash-based CSP. Use for static hosting configuration or cache/CSP troubleshooting."
license: MIT
---

# Astro static builds on Netlify

Inspect Astro version, build command, `outDir`, asset paths, Netlify configuration,
and existing policies. Keep the site statically generated; on-demand rendering,
Functions, and proxied routes need their own response handling.

## Build and header delivery

- Use Astro's static output and publish the actual build directory (normally
  `dist`). A purely static site does not require the Netlify SSR adapter.
- Keep headers in one maintained source: `public/_headers`, copied by Astro
  into the publish directory, or `[[headers]]` in `netlify.toml`. Adapt paths
  when `publicDir`, `outDir`, `base`, or `build.assets` differs from defaults.
- Do not rely on `Astro.response.headers` or build-time middleware to create
  HTTP headers for static files. Netlify must deliver them.

## Browser caching

- Keep HTML and mutable fixed-URL files revalidating. Netlify's default browser
  policy is `public, max-age=0, must-revalidate`; retain it unless requirements
  justify another policy. Revalidation permits storage; it is not `no-store`.
- Use `public, max-age=31536000, immutable` only where content changes produce
  a new URL. Verify generated `/_astro/` files are fingerprinted before applying
  a directory rule; do not assume copied `public/` assets are hashed.
- Never give HTML, service workers, manifests, or stable-name images/fonts a
  year-long immutable lifetime. Version those URLs or retain revalidation.
- Netlify invalidates changed static content on deploy; its edge cache can keep
  static responses fresh for up to a year despite shorter freshness directives.
  Browser caches remain independent: deploying cannot evict an immutable browser copy.
- `Netlify-CDN-Cache-Control` targets Netlify, `CDN-Cache-Control` targets compatible
  CDNs, and `Cache-Control` reaches browsers too. Do not import dynamic-response
  `durable`/SWR recipes merely to serve static files.

```text
# public/_headers; default paths, verified fingerprinted assets, no embedding
/
  Cache-Control: public, max-age=0, must-revalidate

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/*
  Content-Security-Policy: frame-ancestors 'none'
```

Other documents retain Netlify's revalidation default. Add explicit route rules
if overriding it. Avoid overlapping rules with conflicting cache directives or
duplicating policies across `_headers` and TOML; inspect the resulting response.

## CSP for reusable static HTML

- Use build-generated hashes rather than a fixed nonce. Astro 6+ supports
  `security.csp`; check the installed version's API before changing configuration.
  Merge this fragment into the existing config for a local-resource site:

```js
output: 'static',
security: {
  csp: {
    directives: [
      "default-src 'self'", "base-uri 'self'", "object-src 'none'",
      "form-action 'self'", "img-src 'self'", "font-src 'self'",
      "connect-src 'self'",
    ],
  },
},
```

- Check routing before enabling this recipe: Astro's built-in CSP currently
  does not support `ClientRouter`. Preserve required CSP and use document
  navigation/native cross-document transitions when incompatible. Do not disable
  CSP or add `unsafe-inline` merely to make client routing work.
- For a supported custom HTTP CSP with client routing, test navigation in both
  directions: fetching HTML does not replace the active document's response
  policy. Destination scripts, styles, and fetches must remain authorized;
  page-specific hashes alone do not establish compatibility across DOM swaps.
- Astro emits script/style hashes in a head meta policy. Allow actual external
  resources narrowly; use supported script/style options, retaining `'self'`
  when overriding their resources. Check theme scripts, JSON-LD, islands, and
  unprocessed inline code against the final emitted bytes.
- The example Netlify header supplies `frame-ancestors`, which meta cannot
  enforce. Adapt embedding and form destinations to the site's requirements.
- Header and meta policies intersect. A second `default-src 'self'` header can
  block hashed inline scripts/styles through fallback; it does not inherit
  Astro's hashes. Keep supplemental headers compatible with the generated meta.
- If a complete HTTP policy is required, generate route-specific hash headers
  from final build output, covering all document URL forms and error pages.
  Do not paste one page's hashes into a global policy or rewrite bytes afterward.
- Report-Only needs an HTTP header; it does not disable an enforcing meta policy.
  Prefer external scripts/classes over adding broad `unsafe-inline` allowances.

## Verify

- Build production output; confirm `_headers` reaches the publish root and
  inspect emitted hashes and asset filenames. Astro preview alone cannot prove
  Netlify's header delivery or CDN behavior.
- On an authorized deployed URL, inspect GET response headers/body for `/`, a
  nested route, 404, one hashed asset, and one stable asset. Check cache directives,
  validators, conditional requests, and policy agreement; do not deploy implicitly.
- In a browser, exercise themes, navigation, forms, islands, and fonts; verify
  intended code runs and unauthorized inline code is blocked in an isolated fixture.
  For compatible client routing, test A→B→A and direct reloads under served headers.
  Test a changed build: document revalidation and new asset URLs must reveal updates.

## Sources

- [Astro on Netlify](https://docs.astro.build/en/guides/deploy/netlify/)
- [Netlify custom headers](https://docs.netlify.com/manage/routing/headers/)
- [Netlify caching behavior](https://docs.netlify.com/build/caching/caching-overview/)
- [Astro CSP configuration](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)
- [CSP policy intersection](https://www.w3.org/TR/CSP3/#multiple-policies)
- [Browser cache directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
