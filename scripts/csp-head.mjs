import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Client navigation retains the original document's policy. Every route needs
// the same allowlist, including styles and JSON-LD found only on other routes.
// Hash final emitted bytes; never rewrite script/style bodies afterward.
export function createPolicy(documents) {
  const hashes = { script: new Set(), style: new Set() };
  for (const html of documents) {
    for (const [, tag, attributes, body] of html.matchAll(
      /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    )) {
      if (!body || /\bsrc\s*=/.test(attributes)) continue;
      if (
        tag.toLowerCase() === 'script' &&
        /\btype=["']module["']/i.test(attributes)
      ) {
        throw new Error(
          'Client routing CSP requires external module scripts; keep assetsInlineLimit: 0.',
        );
      }
      hashes[tag.toLowerCase()].add(
        `'sha256-${createHash('sha256').update(body).digest('base64')}'`,
      );
    }
  }
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    `script-src 'self' ${[...hashes.script].sort().join(' ')}`,
    `style-src 'self' ${[...hashes.style].sort().join(' ')}`,
    "script-src-attr 'none'",
    "style-src-attr 'none'",
  ].join('; ');
}

export default function cspHead() {
  return {
    name: 'client-routing-csp',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const documents = [];
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
              if (
                /<meta\s+http-equiv=["']content-security-policy["']/i.test(
                  html,
                ) ||
                !/<head[^>]*>/i.test(html)
              ) {
                throw new Error(
                  `Expected no existing CSP and one head in ${file.pathname}; do not enable security.csp.`,
                );
              }
              documents.push({ file, html });
            }
          }
        }
        await walk(dir);
        if (!documents.length)
          throw new Error('No static HTML found for CSP generation.');
        const policy = createPolicy(documents.map((document) => document.html));
        const meta = `<meta http-equiv="content-security-policy" content="${policy}">`;
        for (const { file, html } of documents) {
          await writeFile(
            file,
            html.replace(/<head[^>]*>/i, (head) => head + meta),
          );
        }
      },
    },
  };
}
