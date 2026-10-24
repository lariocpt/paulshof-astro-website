import { test, expect } from 'bun:test';
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createPolicy } from '../scripts/csp-head.mjs';

// Exercise invalid rendered HTML against the real verifier, without changing dist/.
function verifyFixture(change: (html: string) => string) {
  const temporary = mkdtempSync(join(tmpdir(), 'astro-output-check-'));
  try {
    const root = resolve(import.meta.dir, '..');
    cpSync(join(root, 'dist'), join(temporary, 'dist'), { recursive: true });
    mkdirSync(join(temporary, 'scripts'));
    cpSync(
      join(root, 'scripts/verify-output.ts'),
      join(temporary, 'scripts/verify-output.ts'),
    );
    const homepage = join(temporary, 'dist/index.html');
    writeFileSync(homepage, change(readFileSync(homepage, 'utf8')));
    const result = Bun.spawnSync([
      process.execPath,
      join(temporary, 'scripts/verify-output.ts'),
    ]);
    return {
      exitCode: result.exitCode,
      output: result.stderr.toString() + result.stdout.toString(),
    };
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

test('accepts the built example site', () => {
  expect(verifyFixture((html) => html).exitCode).toBe(0);
});

test('rejects duplicate accessible IDs', () => {
  const result = verifyFixture((html) =>
    html.replace('</body>', '<p id="main">Duplicate</p></body>'),
  );
  expect(result.exitCode).toBe(1);
  expect(result.output).toContain('duplicate ID: main');
});

test('rejects a dead local link', () => {
  const result = verifyFixture((html) =>
    html.replace('</body>', '<a href="/missing-example/">Missing</a></body>'),
  );
  expect(result.exitCode).toBe(1);
  expect(result.output).toContain(
    'missing local destination /missing-example/',
  );
});

test('rejects inline script changes without matching CSP hashes', () => {
  const result = verifyFixture((html) =>
    html.replace('</script>', ';window.unauthorized = true;</script>'),
  );
  expect(result.exitCode).toBe(1);
  expect(result.output).toContain('CSP hash missing for inline script');
});

test('rejects a CSP that follows head resources', () => {
  const result = verifyFixture((html) =>
    html.replace(
      /(<meta http-equiv="content-security-policy" content="[^"]*"\s*\/?\s*>)/,
      '<script src="/favicon.svg"></script>$1',
    ),
  );
  expect(result.exitCode).toBe(1);
  expect(result.output).toContain('expected CSP before all head resources');
});

test('rejects inline style attributes', () => {
  const result = verifyFixture((html) =>
    html.replace('</body>', '<p style="color:red">Inline style</p></body>'),
  );
  expect(result.exitCode).toBe(1);
  expect(result.output).toContain('inline style attribute conflicts with CSP');
});

test('all routes share the final hash policy needed by client navigation', () => {
  const root = resolve(import.meta.dir, '../dist');
  const pages: string[] = [];
  function collect(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) collect(path);
      else if (entry.name.endsWith('.html'))
        pages.push(readFileSync(path, 'utf8'));
    }
  }
  collect(root);
  expect(pages.length).toBeGreaterThan(1);
  const policy = createPolicy(pages);
  for (const html of pages) {
    expect(
      html.match(
        /<meta http-equiv="content-security-policy" content="([^"]*)"/,
      )?.[1],
    ).toBe(policy);
    expect(html).toContain('name="astro-view-transitions-enabled"');
    expect(html).not.toMatch(/<script\s+type="module"\s*>/);
  }
  expect(policy).not.toMatch(/unsafe-inline|unsafe-eval|nonce-|data:/);
});

test('rejects route-specific policies and inline module scripts', () => {
  const changed = verifyFixture((html) =>
    html.replace("connect-src 'self'", "connect-src 'none'"),
  );
  expect(changed.exitCode).toBe(1);
  expect(changed.output).toContain('CSP differs between client-routed pages');
  expect(() =>
    createPolicy(['<script type="module">console.log("inline")</script>']),
  ).toThrow('external module');
});

test('Netlify headers are published and immutable caching is limited to fingerprinted assets', () => {
  const root = resolve(import.meta.dir, '..');
  const headers = readFileSync(join(root, 'dist/_headers'), 'utf8');
  expect(headers).toBe(readFileSync(join(root, 'public/_headers'), 'utf8'));
  const rules = headers
    .replace(/^#.*$/gm, '')
    .trim()
    .split(/\n\s*\n/)
    .map((rule) => rule.trim());
  expect(rules).toContain(
    "/*\n  Content-Security-Policy: frame-ancestors 'none'",
  );
  expect(rules.filter((rule) => rule.includes('immutable'))).toEqual([
    '/_astro/*\n  Cache-Control: public, max-age=31536000, immutable',
  ]);
  expect(rules).toContain(
    '/\n  Cache-Control: public, max-age=0, must-revalidate',
  );
  const assets = readdirSync(join(root, 'dist/_astro'));
  expect(assets.length).toBeGreaterThan(0);
  for (const asset of assets) expect(asset).toMatch(/\.[\w-]{8}(?:_|\.)/);
});
