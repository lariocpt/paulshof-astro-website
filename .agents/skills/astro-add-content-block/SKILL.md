---
name: astro-add-content-block
description: Add or edit editorial content in Astro content collections using typed frontmatter, MDX or Markdown bodies, explicit ordering, and reusable rendering components. Use for page copy, services, case studies, project entries, or new content types in a collection-based Astro website.
license: MIT
---

# Astro content blocks

Keep editorial content in the content layer and presentation in reusable
components. Inspect the installed Astro version, collection definitions, and
a representative entry before choosing field names or file locations.

## Find the owner

- Reuse the collection that models the content's meaning. Page headings and
  introductions, service descriptions, project entries, and timeline rows may
  have distinct schemas; do not collapse them into one all-optional block type.
- Follow the project's collection loader and supported source format. In a
  local MDX/Markdown setup, edit the appropriate content file rather than
  hardcoding editorial prose in a page or component.
- Keep shared identity, navigation, contact facts, and reusable UI labels in
  the project's existing configuration or localization layer. Do not duplicate
  those facts into every entry merely to move all visible strings into MDX.
- Preserve entry identifiers used by routes or `getEntry`. A content file rename
  can change its ID depending on the loader; update callers when renaming it.

## Edit or add an entry

- Match the actual frontmatter schema, including required fields, enums, and
  optional values. Add prose to the body and structured values to frontmatter.
  Do not weaken validation just to make an incorrectly shaped entry build.
- Quote strings that YAML may interpret as numbers, booleans, or dates. A
  display number such as `"04"` differs from the numeric sort order `4`.
- For ordered collections, use the explicit editorial order field and sort by
  it in the reader. Do not rely on alphabetical filenames or loader iteration.
  Follow the project's policy for ties when the display order matters.
- Author plain Markdown where sufficient. Use MDX components when the content
  actually needs them; do not copy layout wrappers, inline styles, or page shells
  into every entry.
- Let the enclosing component own the section heading level. Body headings
  should fit that context, rather than introducing a second page h1.
- Keep page metadata aligned with the rendered content. If the project stores
  its description/title in the entry, update those fields with the copy.
- Preserve multiple-paragraph rendering and styling. A single-line preview
  should come from a deliberate summary field, not discarded body content.
- Publish supported facts and attributions. Animate numeric figures only when
  they represent a real quantity; ranges or qualitative labels are not counters.

```mdx
---
order: 4
num: "04"
title: Website planning
summary: Define the audience, pages, and content before implementation.
---

Agree on the website's goals and prepare the material each page needs.

Document the decisions so design and implementation share the same brief.
```

These fields are illustrative: use the destination collection's schema. A
required engagement field or a different title key must be respected.

## Introduce a new content type

- Define a focused schema and loader, register the collection, and add a
  representative entry. Required data should be required; model real variants
  explicitly rather than accepting arbitrary frontmatter.
- Read entries using the version's content APIs. With the Content Layer APIs,
  `getCollection`/`getEntry` retrieve entries and `render(entry)` supplies the
  body component. Fetching frontmatter alone does not render the Markdown body.
- Create or extend a reusable component that owns the markup and scoped CSS.
  Keep selectors for rendered Markdown anchored to that component's content
  wrapper. Pages compose the component rather than duplicating its template.

## Verify

- Run the project's content checks and production build. Confirm missing
  required data and invalid types fail rather than silently showing empty UI.
- Inspect the actual route, not only the collection data: check content, order,
  heading hierarchy, links, metadata, and multi-paragraph rendering.
- Check a narrow viewport, larger text, and supported theme modes. Longer real
  copy must wrap without clipping. Use existing checkers; do not install an
  unrelated test framework for a content edit.

## Sources

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro MDX integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Styling rendered content](https://docs.astro.build/en/guides/styling/)
