import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const mdx = (dir: string) =>
  glob({ pattern: '**/*.mdx', base: `./src/content/${dir}` });

const ordered = { order: z.number().int() };

const pages = defineCollection({
  loader: mdx('pages'),
  schema: z.object({
    description: z.string().min(1),
    eyebrow: z.string().optional(),
    heading: z.string().min(1),
    lead: z.string().optional(),
    cite: z.string().optional(),
  }),
});

/**
 * Long-form editorial body: the property's own sentences about rates, directions and so
 * on. The heading lives in the entry because the page outline is content, and `level` is
 * a field rather than a guess because a block under the page h1 must not jump to h3.
 */
const prose = defineCollection({
  loader: mdx('prose'),
  schema: z.object({
    ...ordered,
    heading: z.string(),
    level: z.union([z.literal(2), z.literal(3)]).default(2),
    note: z.string().optional(),
  }),
});

/**
 * Attraction posts. `order` is the published listing order from the previous site, not the
 * filename. Body copy is the property's own published text; `description` is a real summary
 * (the source's own meta echoed each title) and `summary` is the short line the list shows.
 */
const attractions = defineCollection({
  loader: mdx('attractions'),
  schema: z.object({
    ...ordered,
    title: z.string().min(1),
    description: z.string().min(1),
    summary: z.string().min(1),
  }),
});

export const collections = {
  prose,
  pages,
  attractions,
};
