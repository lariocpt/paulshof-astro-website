# Proposed design library

These are **RTX 5080-generated concepts**, not actual property photography or finished
brand assets. Canonical business spelling and exact colours live in
[the brand guideline](../planning/03-brand-guideline.md).

- [Homepage concept](homepage-concept.png): ivory, burgundy, botanical accents, editorial
  hierarchy and a clear booking action.
- [Design-system concept](brand-system-concept.png): typography, button/card treatments
  and a mobile composition. Lettering is imperfect concept output; do not reuse it as a
  production logo, UI copy or evidence of real amenities.
- [Exact prompts and seeds](prompts.json)
- [Generation and restoration evidence](generation-evidence.json)

Both selected images were generated with qwen-image, 1024×1024, 25 steps, on Bigcachy's
RTX 5080. Generation took 52.745 and 46.693 seconds respectively; chat was restored and
admission resumed after each. The recovery watcher observed the GPU workload lock and did
not interrupt these jobs.

No OpenAI image service was used: generation ran through the requested local images
MCP/5080 controller. The image-generation skill supplied prompt structure. Keep production
text in accessible HTML and use real property images during implementation; these concepts
communicate art direction only.
