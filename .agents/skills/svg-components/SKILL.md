---
name: svg-components
description: Implement web SVG icons, marks, and illustrations as reusable, stylable components that render inline SVG markup. Use when adding SVG UI assets, extracting repeated SVG, or enabling theme-aware SVG styling in Astro or React.
license: MIT
---

# SVG components

Implement SVG used in the page UI as a component that renders the SVG markup.
Expose styling at that component boundary instead of embedding the graphic as
an opaque image URL. This is the collection's convention for maintainable SVG UI.

## Component and styling contract

- Reuse an existing icon/mark component before copying its paths into another
  caller. A component can render the `svg` root directly; it needs no HTML wrapper.
- Keep a correct `viewBox` and aspect ratio. Expose class and appropriate SVG
  attributes so callers can set dimensions, color, and accessibility information.
- Use `currentColor` for monochrome fills or strokes. Preserve `fill="none"`
  on stroke artwork. For multicolor artwork, expose semantic CSS custom
  properties where useful; do not flatten intentional brand colors automatically.
- Use CSS and existing theme tokens for presentation. Avoid hardcoded inline
  style attributes or injecting style text as the component's public API.
- Scope path-specific styling inside the component. Parent classes should
  control its documented API rather than reach into incidental path order.
- Preserve the geometry when optimizing. Keep gradients, masks, clipping paths,
  and referenced definitions needed by the drawing.
- Prefix referenced IDs per instance when using defs, titles, or descriptions.
  Accept an ID prefix in Astro or use a stable facility such as React `useId`;
  update every related `url(#...)`, href, and ARIA reference together.

## Framework integration

- In Astro 5.7+, a local `.svg` default import can be rendered as a component;
  it inlines markup and forwards SVG attributes. A named `.astro` wrapper is
  useful when styling, accessibility, variants, or ID handling need an explicit API.
- In React/Next.js, render SVG JSX from a typed component. Use an SVG-to-component
  loader only if the project configures one; a plain file import may be an asset
  URL or image metadata instead. Use React's SVG attribute spelling.
- Do not add client hydration just to render an SVG. Static component markup
  and CSS are sufficient unless the graphic actually has interactive behavior.
- Fixed-URL consumers such as favicon links, manifest icons, downloads, and
  external social previews still need file assets. Keep those derivatives
  synchronized; a component cannot replace a URL required by another protocol.

```astro
---
// ArrowIcon.astro: a decorative icon beside an already labeled link/button.
import type { SVGAttributes } from 'astro/types';
type Props = Omit<SVGAttributes<'svg'>, 'children'>;
const { class: className, ...attributes } = Astro.props;
---
<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none"
  stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"
  class={className} {...attributes}>
  <path d="M5 12h14m-6-6 6 6-6 6" />
</svg>
```

The defaults above are for decoration. For a meaningful standalone graphic,
define an accessible name and remove decorative hiding deliberately.

## Accessibility and trust

- Hide decorative graphics from assistive technology and name the actual
  interactive control. Meaningful standalone SVGs need an appropriate image
  role and accessible name; use a unique title/description association when needed.
- Put interactions on native links/buttons around the graphic. Do not turn an
  unlabeled SVG root into a click target or add unnecessary keyboard stops.
- Review imported markup: discard scripts, event attributes, and unwanted
  external resources. Do not inject untrusted SVG strings into the document.

## Verify

- Inspect output: the UI component renders inline `svg`, not an image pointing
  to a file. Check caller classes, currentColor, resizing, and supported themes.
- Render two instances to catch duplicate IDs and broken gradient/mask references.
- Verify accessible names and keyboard behavior of containing controls. Check
  production compilation, including the project's actual SVG import behavior.

## Sources

- [Astro SVG components](https://docs.astro.build/en/guides/images/#svg-components)
- [SVG presentation attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/Presentation)
- [React SVG elements](https://react.dev/reference/react-dom/components#all-svg-components)
