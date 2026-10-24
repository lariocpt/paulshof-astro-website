---
name: semantic-html
description: Create or review web HTML and JSX for semantic elements, minimal useful markup, accessible names, keyboard behavior, and correct links versus buttons. Use for document structure and interaction semantics, not React Native UI.
license: MIT
---

# Semantic HTML

Choose elements by meaning before styling. Minimize unnecessary markup, not
meaningful structure. Apply these rules to the changed UI without redesigning
unrelated screens.

## Structure

- Use native HTML before recreating its behavior with roles or JavaScript.
- Remove wrappers when an existing element can carry their layout or styling.
  Keep wrappers needed for grouping, positioning, scrolling, or valid content.
  A React fragment can group siblings without adding a DOM node.
- Use one visible `main` for the page's primary content. Compose layouts so
  nested route components do not introduce duplicate main landmarks.
- Use `header`, `footer`, and `nav` where their meaning fits. Give multiple
  navigation landmarks distinct accessible names.
- Use headings in document hierarchy, independently of their visual size.
  Prefer one descriptive page `h1`; do not add hidden headings to every box.
- Use `section` for a thematic grouping, usually with a heading; `article`
  for independently meaningful content. Generic layout can remain a `div`.
- Use lists for collections, `dl` for name/value descriptions, and tables
  for tabular data. Give data tables appropriate headers and a useful name.

## Interaction and accessibility

- Navigation uses `a` with a real `href`, or a framework link rendering one.
  Actions use `button`. Native submit buttons need no `onClick` handler.
- Set button `type` explicitly: `button` for local actions, `submit` for
  submission. Do not nest interactive elements.
- Prefer a visible accessible name. Label icon-only controls; hide decorative
  icons from assistive technology. Do not overwrite useful visible text with
  a different `aria-label`.
- Add applicable states such as `aria-expanded`, `aria-controls`,
  `aria-pressed`, or `aria-current`; keep them synchronized with actual UI.
  Do not add every ARIA attribute or repeat an element's implicit role.
- Preserve keyboard activation, logical focus order, visible focus, and focus
  restoration for overlays. Use the native widget or an established accessible
  primitive before implementing a custom composite widget.
- Do not hide focusable content with `aria-hidden` or use positive `tabIndex`
  values to repair an incorrect DOM order.
- Use live regions narrowly for asynchronous status updates. Do not make a
  whole page an alert or announce ordinary content repeatedly.

```html
<nav aria-label="Primary">
  <a href="/projects" aria-current="page">Projects</a>
</nav>
<main>
  <h1>Projects</h1>
  <button type="button" aria-expanded="false" aria-controls="filters">
    Filters
  </button>
  <section id="filters" aria-labelledby="filters-heading" hidden>
    <h2 id="filters-heading">Filter projects</h2>
  </section>
</main>
```

The disclosure handler must update `hidden` and `aria-expanded` together.

## Verify

- Inspect the rendered DOM: valid nesting, meaningful outline, no redundant wrappers.
- Reach and operate every control with the keyboard and see where focus is.
- Check accessible names and states in the accessibility tree; run the
  project's existing accessibility checks and manually inspect what they miss.

## Sources

- [HTML semantics](https://html.spec.whatwg.org/multipage/semantics.html)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [WAI interaction patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
