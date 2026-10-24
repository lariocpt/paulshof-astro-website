---
name: astro-styles
description: Style Astro sites with native CSS, semantic custom properties and scoped component styles. Use when adding or refactoring Astro styling around shared design tokens and explicit CSS ownership, without introducing a utility framework.
license: MIT
---

# Astro styles

Use ordinary CSS with shared design tokens and component-owned presentation.
Inspect the existing theme, fonts, layouts and component styles first. Preserve
an established brand and theme mechanism; do not copy another site's palette.
This skill defines a native-CSS approach, not an automatic instruction to migrate
an unrelated project away from its chosen framework.

## Tokens are the design vocabulary

- Define reusable colors, foreground/background pairs, spacing, typography,
  borders, radii, shadows and motion values as CSS custom properties in the
  shared theme stylesheet. Reuse the existing names and scale.
- Prefer semantic roles such as `--color-surface`, `--color-text`,
  `--color-action` and `--color-on-action`. A brand hue may need separate text,
  control-fill and decorative roles to maintain contrast.
- Use `var()` in components. Keep literal colors in the central token definition;
  transparent, currentColor and applicable system colors retain their CSS roles.
  Derived colors can use color-mix with existing tokens.
- Tokenize repeated design decisions. Do not create a global token for every
  number: intrinsic geometry, optical corrections, component breakpoints and
  deliberate one-off measurements can remain local. CSS variables do not work
  as ordinary media-query thresholds; keep those conditions valid CSS.
- Component-only variables belong on the owning component root and may derive
  from global tokens. Document intended overrides rather than leaking selectors.
- For dark/system modes, override the same token names. Preserve selector order
  and specificity so an explicit user choice beats the system preference. Verify
  foreground/background pairs in every supported mode and interaction state.

## Styles belong to their template

- Put component-specific CSS in the owning `.astro` file's default scoped
  `<style>`. Pages own page-specific composition styles. Existing components
  should be reused before copying markup and its presentation.
- Shared globals hold tokens, font declarations, a small native reset, base
  element rules and genuinely repeated primitives such as a page container.
  A selector used by only one component normally belongs in that component.
- Use meaningful class names for roles/parts. Avoid utility-class chains,
  ad-hoc inline styles and `<style is:global>` as a workaround for ownership.
  Do not add wrappers merely to make scoping convenient.
- Astro scopes selectors by template ownership. Parent styles do not simply
  reach child internals or MDX/slot output. Use a documented prop/variable API
  or narrowly anchored `:global()` beneath the owning content wrapper.
- When removing a utility framework, replace relied-on reset behavior and
  generated utilities explicitly. Check box sizing, controls, list appearance,
  hidden elements and typography. Remove the integration/dependencies only when
  the native CSS covers the existing UI; do not ship unresolved directives.
- Keep a browser-relative root and rem/em for text and spacing. Avoid overflow
  hiding as a substitute for reflow. Preserve visible focus, reduced motion,
  no-JavaScript content and dimensions reserved for images.

```astro
<article class="card"><slot /></article>
<style>
  .card {
    padding: var(--space-6);
    color: var(--color-text);
    background: var(--color-surface);
    border: var(--border-width) solid var(--color-border);
    border-radius: var(--radius-md);
  }
</style>
```

Use the consuming project's actual tokens; the example does not prescribe names.

## Enforce and verify

Use Stylelint for native CSS and Astro style blocks with a compatible HTML syntax
parser. Add only documented framework syntax to its vocabulary. Where required,
reject literal component colors while allowing central theme definitions. Use
Prettier's Astro plugin for formatting and put eslint-config-prettier last in
ESLint configuration; avoid running competing formatting rules inside linters.

Run the project's source, formatting, CSS/JS linting, type and production-output
checks. Compare representative computed styles before/after a migration, including
multiple instances, MDX content, fonts and controls. Check 320px, enlarged text,
light/dark/system, reduced motion and no JavaScript. For client navigation verify
theme continuity and styles after A→B→A. Keep CSP hashes based on final CSS bytes.

## Sources

- [Astro scoped styles](https://docs.astro.build/en/guides/styling/)
- [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Stylelint configuration](https://stylelint.io/user-guide/configure/)
- [Prettier with linters](https://prettier.io/docs/integrating-with-linters)
- [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
