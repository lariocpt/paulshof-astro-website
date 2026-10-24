---
name: add-content-block
description: Add or edit this starter's MDX page copy or collection entries using existing schemas and explicit editorial order. Use for visible editorial content and content model changes in this repository.
---

# Content workflow

- Read `src/content.config.ts` and an entry from the relevant collection first.
  Each collection has a narrow schema; do not make fields optional just to
  accommodate an unmodeled variant.
- Keep editorial prose in `src/content/**/*.mdx`; components arrange content.
  Shared identity and UI labels live in `src/site.ts`. Do not duplicate them in MDX.
- For an existing entry, edit its frontmatter/body and preserve identifiers used
  by `getEntry`. For repeated entries, provide explicit integer `order`; readers
  sort by that field, independently of the filename.
- Quote strings that resemble numbers, booleans, or dates. `num: "01"` is a
  string; `num: 01` may be parsed as a number and violate the schema.
- Pages require `heading` and `description`; `eyebrow`, `lead`, and `cite` are
  optional. `description` supplies route metadata as well as documenting the entry.
- Services use `order, num, title, engagement, summary`; the engagement enum is
  declared in the schema. Cases/projects/resources/timeline/process/principles
  follow their own declared shape. Inspect the source instead of copying a
  schema table that can drift.
- Add a new content kind by defining a collection and schema, registering it,
  adding sample entries, and building a reusable reader/component for it.
- Use plain prose and Markdown for content, reserving MDX components for a real
  semantic/content need. Do not copy layout wrappers or inline presentation styles.
- Publish only supported facts. Sample project descriptions and milestone dates
  must be replaced before presenting them as a real business history.
- Run `bun run verify`; inspect the changed page at a narrow width and in both
  themes. Invalid frontmatter must fail the build rather than render blank.
