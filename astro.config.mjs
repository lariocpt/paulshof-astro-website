// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cspHead from './scripts/csp-head.mjs';
import optimizeHtml from './scripts/optimize-html.mjs';

const origin = new URL(process.env.SITE_URL || 'https://example.com');
if (
  !['http:', 'https:'].includes(origin.protocol) ||
  origin.pathname !== '/' ||
  origin.search ||
  origin.hash
) {
  throw new Error(
    'SITE_URL must be an absolute HTTP(S) site origin without a path, query, or fragment.',
  );
}
if (
  process.env.SITE_INDEXABLE === 'true' &&
  ['example.com', 'localhost', '127.0.0.1'].includes(origin.hostname)
) {
  throw new Error(
    'Set SITE_URL to your public origin before enabling indexing.',
  );
}

export default defineConfig({
  site: origin.origin,
  output: 'static',
  // Astro's built-in CSP does not support ClientRouter. cspHead generates
  // one build-wide hash policy so destination resources survive page swaps.
  trailingSlash: 'always',
  // Finalize HTML/inline code first, hash CSP second, precompress last.
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.endsWith('/404/') }),
    optimizeHtml(),
    cspHead(),
  ],
  build: { inlineStylesheets: 'never' },
  markdown: { syntaxHighlight: 'prism' },
  compressHTML: true,
  vite: {
    // Keep processed modules external: ClientRouter otherwise inserts a data:
    // module sentinel when rerunning inline modules, which this CSP forbids.
    build: {
      minify: 'oxc',
      cssMinify: 'lightningcss',
      cssCodeSplit: true,
      sourcemap: false,
      assetsInlineLimit: 0,
      // Preserve side-effect detection so CSS imports and lifecycle setup run.
      rolldownOptions: { treeshake: true },
    },
  },
});
