---
name: tailwind-theme-tokens
description: Create or review Tailwind CSS themes and component colors using semantic tokens, consistent theme modes, and accessible foreground/background pairs. Use for theme configuration or styling that introduces or changes colors.
license: MIT
---

# Tailwind theme tokens

Inspect the Tailwind major version, existing tokens, and theme-switch mechanism.
Extend the established theme rather than introducing a competing token system.

## Color ownership

- Define values centrally and consume semantic utilities such as `bg-surface`,
  `text-foreground`, `border-border`, and `outline-focus` in components.
  Reuse the project's equivalent names rather than renaming its vocabulary.
- Keep raw hex, RGB, HSL, OKLCH, and arbitrary literal color utilities in the
  token/theme definition, not scattered through feature markup or inline styles.
- Separate role from hue: a destructive action, validation error text, and a
  subtle error surface may need different tokens to maintain contrast.
- Define foreground/background pairs for solid controls and tinted surfaces.
  A saturated brand color is not automatically readable as small text.
- Ensure tokens resolve in each supported theme mode and in hover, disabled,
  selected, and keyboard-focus states. Do not communicate status by color alone.
- If generated artifacts exist, edit their source and run the existing generator.
  Do not impose a JSON generator on a project that only needs CSS variables.

## Version-specific wiring

- Tailwind v4 uses `@theme` variables to expose utilities. Use `@theme inline`
  when mapping utility tokens to other CSS variables whose values change by scope.
- Keep runtime mode values in ordinary selectors such as `:root` and the
  project's dark-mode selector. Map them to Tailwind's theme namespaces.
- Tailwind v3 uses its configuration theme extensions. Preserve the existing
  CSS variable mapping and opacity convention; v4 directives do not work there.
- Keep class names statically discoverable. Map variants to complete utilities
  instead of constructing strings such as `bg-${color}`.

```css
/* Tailwind v4; these pairs still need verification in the actual UI. */
@import "tailwindcss";

:root {
  --surface: #ffffff;
  --foreground: #171717;
}

[data-theme="dark"] {
  --surface: #171717;
  --foreground: #fafafa;
}

@theme inline {
  --color-surface: var(--surface);
  --color-foreground: var(--foreground);
}
```

Consume these with `bg-surface text-foreground`. Use the project's actual mode
selector; do not add a second theme switch. CSS variable overrides work without
requiring a `dark:` utility for every themed property.

## Verify

- Render changed components in every supported theme and interaction state.
- Check resolved foreground/background contrast: normally 4.5:1 for text,
  3:1 for large text, and applicable 3:1 non-text control/state contrast.
- Confirm theme overrides affect computed styles and emitted utilities exist
  in a production build. Use existing token drift checks when present.

## Sources

- [Tailwind v4 theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind v3 theme configuration](https://v3.tailwindcss.com/docs/theme)
- [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
