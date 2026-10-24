import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const mdx = (dir: string) =>
  glob({ pattern: '**/*.mdx', base: `./src/content/${dir}` });

const ordered = { order: z.number().int() };

const services = defineCollection({
  loader: mdx('services'),
  schema: z.object({
    ...ordered,
    num: z.string(),
    title: z.string(),
    engagement: z.enum(['Fixed scope', 'Monthly', 'Retainer', 'Setup']),
    summary: z.string(),
  }),
});

const cases = defineCollection({
  loader: mdx('cases'),
  schema: z.object({
    ...ordered,
    sector: z.string(),
    title: z.string(),
    stack: z.string(),
  }),
});

const projects = defineCollection({
  loader: mdx('projects'),
  schema: z.object({
    ...ordered,
    name: z.string(),
    kind: z.string(),
    stack: z.string(),

    links: z.array(z.object({ label: z.string(), href: z.url() })).optional(),
  }),
});

const tools = defineCollection({
  loader: mdx('tools'),
  schema: z.object({
    ...ordered,
    name: z.string(),
    /** Three or four words, sits beside the name rather than under it. */
    kind: z.string(),
    licence: z.string(),
    /** What the link is — "docs" for a manual, "site" for a landing page. */
    label: z.string(),
    href: z.url(),
  }),
});

const career = defineCollection({
  loader: mdx('career'),
  schema: z.object({
    ...ordered,
    years: z.string(),
    /** Machine-readable start year for <time datetime>. */
    startYear: z.number().int(),
    role: z.string(),
    org: z.string(),
  }),
});

const outcomes = defineCollection({
  loader: mdx('outcomes'),
  schema: z.object({
    ...ordered,
    figure: z.string(),
    label: z.string(),
    /** Only set where the figure is a plain number that can be counted up to. */
    countTo: z.number().optional(),
  }),
});

const stack = defineCollection({
  loader: mdx('stack'),
  schema: z.object({ ...ordered, area: z.string() }),
});

const process = defineCollection({
  loader: mdx('process'),
  schema: z.object({ ...ordered, day: z.string() }),
});

const principles = defineCollection({
  loader: mdx('principles'),
  schema: z.object({ ...ordered, title: z.string() }),
});

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

export const collections = {
  services,
  cases,
  projects,
  tools,
  career,
  outcomes,
  stack,
  process,
  principles,
  pages,
};
