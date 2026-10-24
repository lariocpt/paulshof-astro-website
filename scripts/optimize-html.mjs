import { readdir, readFile, writeFile } from 'node:fs/promises';
import { minify } from 'html-minifier-terser';

export const INLINE_CSS_LIMIT = 4096;

// Run before CSP generation: minifying inline code afterward invalidates hashes.
/**
 * @param {string} html
 * @param {(href: string) => Promise<string | null | undefined>} loadStylesheet
 */
export async function optimizeDocument(
  html,
  loadStylesheet,
  { inlineCss = true, minifyJS = true } = {},
) {
  const links = inlineCss ? [...html.matchAll(/<link\b[^>]*>/gi)] : [];
  for (const [link] of links) {
    if (
      !/\brel="stylesheet"/i.test(link) ||
      /\b(?:integrity|disabled|title)\b/i.test(link)
    )
      continue;
    const href = link.match(/\bhref="([^"]+)"/i)?.[1];
    if (!href) continue;
    const css = await loadStylesheet(href);
    // Relative CSS URLs would resolve against the page after inlining. Leave
    // those sheets external, as well as imports and larger shared styles.
    if (
      !css ||
      Buffer.byteLength(css) >= INLINE_CSS_LIMIT ||
      /url\s*\(|@import\b|<\/style/i.test(css)
    )
      continue;
    const attributes = link
      .slice(5, -1)
      .replace(/\s*(?:rel|href)="[^"]*"/gi, '')
      .replace(/\/$/, '');
    html = html.replace(link, () => `<style${attributes}>${css}</style>`);
  }
  return minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    // Keep quotes, explicit end tags, inline word spacing, pre/textarea content,
    // and Astro's data attributes. CSS is already minified by Lightning CSS.
    minifyJS,
    minifyCSS: false,
    // Even with minifyJS disabled the HTML minifier trims script/style bodies.
    // Protect entire blocks when their hashes have already been generated.
    ...(minifyJS
      ? {}
      : {
          ignoreCustomFragments: [
            /<script\b[^>]*>[\s\S]*?<\/script>/gi,
            /<style\b[^>]*>[\s\S]*?<\/style>/gi,
          ],
        }),
  });
}

export default function optimizeHtml(options = {}) {
  return {
    name: 'optimize-static-html',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const stylesheets = new Map();
        async function loadStylesheet(href) {
          const url = new URL(href, 'https://build.invalid');
          if (
            url.origin !== 'https://build.invalid' ||
            !url.pathname.startsWith('/_astro/') ||
            !url.pathname.endsWith('.css') ||
            url.search ||
            url.hash
          )
            return null;
          if (!stylesheets.has(href))
            stylesheets.set(
              href,
              readFile(new URL(`.${url.pathname}`, dir), 'utf8'),
            );
          return stylesheets.get(href);
        }
        let pages = 0,
          saved = 0;
        async function walk(directory) {
          for (const entry of await readdir(directory, {
            withFileTypes: true,
          })) {
            const file = new URL(
              entry.name + (entry.isDirectory() ? '/' : ''),
              directory,
            );
            if (entry.isDirectory()) await walk(file);
            else if (entry.name.endsWith('.html')) {
              const html = await readFile(file, 'utf8');
              const optimized = await optimizeDocument(
                html,
                loadStylesheet,
                options,
              );
              saved += Buffer.byteLength(html) - Buffer.byteLength(optimized);
              pages++;
              await writeFile(file, optimized);
            }
          }
        }
        await walk(dir);
        logger.info(
          `${pages} pages optimized before CSP finalization (HTML byte change: ${-saved}).`,
        );
      },
    },
  };
}
