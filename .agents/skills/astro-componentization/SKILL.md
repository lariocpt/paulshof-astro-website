---
name: astro-componentization
description: Create or refactor Astro UI to encapsulate repeated HTML fragments and their component-specific CSS. Use when editing .astro pages, layouts, or components with duplicated markup, shared presentation patterns, or unclear style ownership.
license: MIT
---

# Astro componentization

Give each repeated UI fragment one source template and keep its presentation
rules with the component that owns it. Inspect existing components, layouts,
styling conventions, and the installed Astro version before extracting new UI.

## Markup ownership

- Search for an existing component before adding another copy of a fragment.
  Extract repeated, meaningful structures such as cards, navigation entries,
  field groups, or content sections into named `.astro` components.
- Repeated rendered HTML is expected; duplicated source templates for the same
  pattern are the problem. For items differing only in data, map a collection
  through one template or component instead of copying each item's HTML.
- Use typed `Props` and `Astro.props` for data and small, meaningful variants.
  Use default or named slots for caller-supplied markup. Do not pass HTML
  strings through `set:html` merely to avoid defining a component or slot.
- Keep page shells in layouts and repeated UI in components. Pages compose
  these pieces and provide route-specific content.
- Migrate the relevant duplicate call sites together. Do not leave the old
  template beside its new abstraction or fork a component for minor text changes.
- Extract by shared responsibility, not visual resemblance alone. Avoid giant
  components with unrelated flags, or components for every trivial HTML tag.
  Distinct structures may remain distinct when sharing them would obscure intent.
- Preserve semantic elements, heading levels, links, form associations, and
  unique IDs at every call site. Extraction must not add unnecessary DOM wrappers.
- Use Astro components for static presentation; extraction alone does not
  justify adding a client framework or hydration directive.

## CSS ownership

- Move fragment-specific rules into the owning component's default scoped
  `<style>` when using authored CSS. Remove obsolete rules from the former owner.
  Keep existing utility-based styling when it already expresses the component.
- Leave resets, theme tokens, font definitions, and intentional site-wide rules
  shared. Reuse tokens rather than copying global CSS into each component.
- Scope follows template ownership. After extraction, parent selectors do not
  automatically reach a child's internals or content supplied through a slot.
  Check which component authors each element before moving its selectors.
- Scoped CSS is not Shadow DOM isolation: inherited properties, custom
  properties, and applicable global rules can still affect component content.
- Prefer documented props, variants, or CSS custom properties for customization.
  If exposing a `class` prop, explicitly apply it to the intended element;
  preserve Astro's scope attributes when forwarding parent styles, according
  to the configured `scopedStyleStrategy`.
- Use narrowly anchored `:global()` only when intentionally styling external
  content, such as rendered Markdown. Do not turn a moved stylesheet into
  `<style is:global>` just to make previously leaking selectors work again.

```astro
---
// FeatureCard.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<article class="feature-card">
  <h2>{title}</h2>
  <slot />
</article>

<style>
  .feature-card { padding: 1rem; border: 1px solid currentColor; }
  h2 { margin-block: 0 0.5rem; }
</style>
```

Callers reuse `<FeatureCard title="…">…</FeatureCard>` for each instance.
The card owns its heading and shell styles; supplied slot content keeps its
author's styling responsibility. Adapt the heading level to its actual context.

## Verify

- Check changed routes for remaining copies of the extracted structure and
  unused selectors. Exercise every migrated variant and slot.
- Render multiple instances alongside unrelated content: verify unique IDs,
  preserved semantics, styling, and no unintended cross-component effects.
- Inspect computed styles for moved elements and slotted content; compare
  responsive layouts and theme modes with the original presentation.
- Run the project's existing Astro checks and production build. Confirm static
  extraction did not introduce client JavaScript or unnecessary dependencies.

## Sources

- [Astro components, props, and slots](https://docs.astro.build/en/basics/astro-components/)
- [Scoped styles and styling boundaries](https://docs.astro.build/en/guides/styling/)
- [Shared page layouts](https://docs.astro.build/en/basics/layouts/)
