import { test, expect } from 'bun:test';
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  existsSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { optimizeDocument } from '../scripts/optimize-html.mjs';
import { precompressDirectory } from '../scripts/precompress.mjs';

test('HTML optimization preserves words, preformatted text, JSON-LD and Astro attributes', async () => {
  const json = '{"name":"Two words","value":"<tag>"}';
  const output = await optimizeDocument(
    `<html><head><script type="application/ld+json">${json}</script></head><body><!-- comment --><p><a data-astro-reload href="/a/">one</a> <em>two</em></p><pre>  first\n    second</pre><textarea>  input\n  text</textarea></body></html>`,
    async () => null,
  );
  expect(output).not.toContain('<!-- comment -->');
  expect(output).toContain('</a> <em>two</em>');
  expect(output).toContain('<pre>  first\n    second</pre>');
  expect(output).toContain('<textarea>  input\n  text</textarea>');
  expect(output).toContain(json);
  expect(output).toContain('data-astro-reload');
});

test('small CSS inlining preserves media and avoids URL rebasing or integrity changes', async () => {
  const sheets: Record<string, string> = {
    '/small.css': '.small{display:block}',
    '/large.css': ' '.repeat(4096),
    '/url.css': '.icon{background:url(./icon.svg)}',
    '/import.css': '@import "./other.css";',
  };
  const html =
    ['small', 'large', 'url', 'import']
      .map(
        (name) => `<link rel="stylesheet" href="/${name}.css" media="screen">`,
      )
      .join('') + '<link rel="stylesheet" href="/small.css" integrity="test">';
  const output = await optimizeDocument(html, async (href) => sheets[href]);
  expect(output).toContain(
    '<style media="screen">.small{display:block}</style>',
  );
  for (const name of ['large', 'url', 'import'])
    expect(output).toContain(`href="/${name}.css"`);
  expect(output).toContain('integrity="test"');
});

test('existing CSP inline bytes can be preserved while minifying HTML', async () => {
  const html =
    '<script>\n  window.example = true;\n</script><style>\n.example { display: block; }\n</style>';
  expect(
    await optimizeDocument(html, async () => null, {
      inlineCss: false,
      minifyJS: false,
    }),
  ).toBe(html);
});

test('precompression round-trips final bytes and removes stale siblings after a shrink', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'astro-compression-'));
  try {
    const path = join(dir, 'index.html');
    const raw = '<p>Compress this text</p>'.repeat(200);
    writeFileSync(path, raw);
    writeFileSync(join(dir, 'image.png'), raw);
    await precompressDirectory(dir);
    expect(gunzipSync(readFileSync(`${path}.gz`)).toString()).toBe(raw);
    expect(brotliDecompressSync(readFileSync(`${path}.br`)).toString()).toBe(
      raw,
    );
    expect(existsSync(join(dir, 'image.png.gz'))).toBe(false);
    writeFileSync(path, 'small');
    await precompressDirectory(dir);
    expect(existsSync(`${path}.gz`)).toBe(false);
    expect(existsSync(`${path}.br`)).toBe(false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('all published compressed variants decode to the final source bytes', () => {
  let count = 0;
  function walk(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(gz|br)$/.test(path)) {
        const compressed = readFileSync(path);
        const decoded = path.endsWith('.gz')
          ? gunzipSync(compressed)
          : brotliDecompressSync(compressed);
        const raw = readFileSync(path.replace(/\.(gz|br)$/, ''));
        expect(decoded.equals(raw)).toBe(true);
        expect(compressed.length).toBeLessThan(raw.length);
        count++;
      }
    }
  }
  walk(resolve(import.meta.dir, '../dist'));
  expect(count).toBeGreaterThan(0);
});
