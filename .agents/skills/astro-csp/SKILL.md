---
name: astro-csp
description: Implement or review Content Security Policy for Astro static and server-rendered websites, including framework-generated hashes, inline code, hosting headers, and production verification. Use for explicit CSP work or CSP violations in Astro projects.
license: MIT
---

# Astro CSP

Inspect the installed Astro version, rendering mode, integrations, and hosting
headers. Inventory scripts, styles, inline attributes, fonts, images, frames,
and network connections before choosing sources. Preserve existing protection.

## Choose compatible enforcement

- Astro 6+ provides `security.csp` with generated script/style hashes in a head
  meta policy. Older versions may have an experimental API: check the installed
  docs/types rather than applying current options or upgrading incidentally.
- Test the framework implementation with build and preview; development Vite
  behavior does not establish that production CSP works.
- Prefer stable hashes for static output. Do not embed a build-time nonce in
  reusable HTML and call it a per-response nonce.
- Astro's generated hashes cover processed resources; inspect unprocessed
  inline scripts, JSON-LD, theme bootstraps, and third-party assets separately.
  Use supported hash/runtime APIs where necessary and verify the emitted bytes.
- Check version-specific limitations around ClientRouter, syntax highlighting,
  dynamic style attributes, and integrations before enabling a policy globally.

```js
// Astro 6+ configuration fragment; merge into the existing config.
security: {
  csp: {
    directives: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      "img-src 'self'",
      "font-src 'self'",
      "connect-src 'self'",
    ],
  },
}
```

This is a starting point for a local-resource site, not a universal policy.
Configure script/style sources through the supported `scriptDirective` and
`styleDirective` options. Their resources can replace defaults; retain `'self'`
explicitly when needed. Do not put duplicate script/style directives in `directives`.

## Policy details

- Allow only required origins and schemes, scoped to the resource directive.
  Add `data:` or `blob:` only where an actual feature needs them, not everywhere.
- Avoid broad wildcards and production `unsafe-eval`. Do not fix inline-code
  violations by adding `unsafe-inline` indiscriminately.
- A nonce on a style element does not authorize arbitrary `style` attributes;
  likewise script hashes do not normally authorize `onclick` attributes.
  Prefer classes, stylesheets, and event listeners over weakening the policy.
- If a version supports attribute hashes, scope them narrowly and verify browser
  support. Do not assume Astro 7.x options exist in a 6.x installation.
- Use an HTTP response header for `frame-ancestors`, which a meta CSP cannot
  enforce. Reporting and Report-Only also require appropriate header support;
  a meta tag alone is not a report-only rollout or full header replacement.
- A header and a meta policy are both enforced. Ensure hosting/CDN policies
  agree; adding a permissive second policy cannot loosen the first.
- On-demand rendering may use server headers or supported Astro runtime CSP
  APIs. If choosing nonces, generate unpredictable values per response, apply
  them consistently, and prevent shared caches from replaying the HTML.
- Preserve escaping/sanitization: CSP is additional protection, not a substitute
  for treating user content safely. Do not expand deployment scope just to set it.

## Verify

- Build and serve production output, then inspect the actual response headers
  and early head meta on representative routes and error pages.
- Verify theme initialization, forms, islands, fonts, image variants, and any
  navigation enhancements with no unexplained CSP violations.
- Use an isolated test page or browser fixture to prove an unauthorized inline
  script is blocked while intended scripts run. Do not inject probes into live pages.
- Check that hashes change when their code changes and that transforms/CDNs do
  not rewrite hashed bytes. Record required exceptions and test the served policy,
  not merely the configuration file.

## Sources

- [Astro CSP configuration](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)
- [Astro runtime CSP API](https://docs.astro.build/en/reference/api-reference/#csp)
- [CSP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [CSP headers and multiple policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)
