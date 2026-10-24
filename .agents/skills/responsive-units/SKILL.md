---
name: responsive-units
description: Create or review web typography, spacing, and layout measurements using rem and em, a browser-relative root, and responsive sizing. Use for CSS sizing decisions, zoom, text scaling, or reflow issues.
license: MIT
---

# Responsive units

Use relative typography and spacing without forcing one unit onto every CSS
property. Inspect the project's spacing scale and responsive breakpoints first.

## Unit choices

- Keep the root at the browser default or `font-size: 100%`. Use percentages
  or other relative values for deliberate responsive root adjustments; avoid
  fixed-pixel roots and the 62.5% shortcut that shrinks default text.
- Use `rem` for font sizes, shared spacing, radii, and consistent component
  dimensions. A rem follows the root font, not a guaranteed 16px conversion.
- Use `em` when spacing should follow a component's own font size, such as
  button padding or icon gaps. Remember font-size in em compounds through nesting.
- Prefer unitless line-height so descendants inherit a multiplier rather than
  a fixed length. Use zero without a unit.
- Percentages, `fr`, `auto`, intrinsic keywords, and `minmax` are appropriate
  for layout. `ch` can limit reading measure; it is not an exact character count.
- Use viewport units for genuine viewport constraints; prefer dynamic viewport
  units where mobile browser chrome matters. Do not size text only in viewport units.
- Pixel borders and other deliberate hairline details are reasonable exceptions.
  HTML image dimensions and responsive image descriptors have their own syntax;
  do not convert those numeric pixel values into rem strings.
- Reuse Tailwind's or the project's relative scale after checking its definitions.
  A numeric utility name alone does not prove the emitted CSS uses relative units.

## Responsive behavior

- Prefer adapting layout and component type scales before changing the entire
  root size: root changes scale all rem-based dimensions together.
- For fluid text, use bounded `clamp()` expressions with relative bounds and
  test zoom. Mixing rem and viewport units is not an automatic accessibility pass.
- Prefer `min-height` and content-driven sizing over fixed heights around text.
  Allow wrapping and avoid clipping translated or enlarged labels.
- Let wide tables/code scroll in a dedicated container rather than making the
  whole document overflow. Use logical properties where appropriate.

```css
html { font-size: 100%; }
body { font-size: 1rem; line-height: 1.5; }

.content {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}

.action {
  font: inherit;
  padding: 0.5em 1em;
  border: 1px solid currentColor;
  border-radius: 0.375rem;
}
```

## Verify

- Check narrow and wide viewports and an increased browser default font size.
- Confirm text can reach 200% enlargement without losing content or operation.
  Check intermediate sizes; responsive rules must not cancel enlargement.
- Test reflow at 320 CSS pixels, commonly represented by 400% zoom on a
  1280 CSS-pixel viewport. Avoid two-dimensional page scrolling except for
  content whose meaning genuinely requires it, such as a data table.
- Exercise longer labels and text-spacing overrides, not just a short English sample.

## Sources

- [WCAG resize text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [WCAG reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [CSS length units](https://developer.mozilla.org/en-US/docs/Web/CSS/length)
