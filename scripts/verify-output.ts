import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const dist = resolve(import.meta.dir, '../dist');
const failures: string[] = [];
const pages: string[] = [];
function walk(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) pages.push(path);
  }
}
if (!existsSync(join(dist, 'index.html')))
  throw new Error('Run bun run build before checking output.');
walk(dist);
const documents = new Map<string, { ids: Set<string>; links: string[] }>();
let navigationPolicy: string | undefined;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set<string>();
  const labels = new Set<string>();
  const controls: string[] = [];
  const links: string[] = [];
  let mains = 0,
    h1s = 0,
    titles = 0,
    canonicals = 0,
    descriptions = 0,
    lastHeading = 0;
  const report = (message: string) =>
    failures.push(`${file.slice(dist.length)}: ${message}`);
  const policy = html.match(
    /<meta http-equiv="content-security-policy" content="([^"]*)"/i,
  );
  if (
    !policy ||
    !/<head[^>]*>\s*<meta http-equiv="content-security-policy"/i.test(html)
  ) {
    report('expected CSP before all head resources');
  }
  if (policy) {
    if (navigationPolicy && navigationPolicy !== policy[1])
      report('CSP differs between client-routed pages');
    navigationPolicy ??= policy[1];
    if (
      (html.match(/http-equiv="content-security-policy"/gi) || []).length !== 1
    )
      report('expected exactly one CSP meta policy');
    const directives = new Map(
      policy[1]
        .split(';')
        .filter((value) => value.trim())
        .map((value) => {
          const [name, ...sources] = value.trim().split(/\s+/);
          return [name, sources];
        }),
    );
    if (/unsafe-inline|unsafe-eval|nonce-/.test(policy[1]))
      report('CSP contains an unsafe source or static nonce');
    for (const [, tag, attributes, body] of html.matchAll(
      /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    )) {
      // External resources use 'self'; every inline block, including JSON-LD,
      // must match the final emitted bytes rather than its source template.
      if (!body || /\bsrc\s*=/.test(attributes)) continue;
      if (tag === 'script' && /\btype=["']module["']/i.test(attributes))
        report('client routing requires external module scripts');
      const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
      if (!directives.get(`${tag}-src`)?.includes(hash))
        report(`CSP hash missing for inline ${tag}`);
    }
  }
  if ((html.match(/name="astro-view-transitions-enabled"/g) || []).length !== 1)
    report('expected one shared ClientRouter');
  const rewriter = new HTMLRewriter()
    .on('[style]', {
      element() {
        report('inline style attribute conflicts with CSP');
      },
    })
    .on('[id]', {
      element(el) {
        const id = el.getAttribute('id')!;
        if (ids.has(id)) report(`duplicate ID: ${id}`);
        ids.add(id);
      },
    })
    .on('main', {
      element() {
        mains++;
      },
    })
    .on('title', {
      element() {
        titles++;
      },
    })
    .on('h1,h2,h3,h4,h5,h6', {
      element(el) {
        const level = Number(el.tagName[1]);
        if (level === 1) h1s++;
        if (level > lastHeading + 1)
          report(`heading level jumps from ${lastHeading} to ${level}`);
        lastHeading = level;
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        descriptions++;
        if (!el.getAttribute('content')?.trim()) report('empty description');
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        canonicals++;
        const canonical = new URL(el.getAttribute('href')!);
        if (
          process.env.SITE_URL &&
          canonical.origin !== new URL(process.env.SITE_URL).origin
        )
          report('canonical origin differs from SITE_URL');
      },
    })
    .on('img', {
      element(el) {
        if (el.getAttribute('alt') === null) report('image is missing alt');
        if (!el.getAttribute('width') || !el.getAttribute('height'))
          report('image lacks intrinsic dimensions');
      },
    })
    .on('label[for]', {
      element(el) {
        labels.add(el.getAttribute('for')!);
      },
    })
    .on('input,textarea,select', {
      element(el) {
        if (el.getAttribute('type') !== 'hidden')
          controls.push(el.getAttribute('id') || '');
        if (!el.getAttribute('name')) report('form control lacks name');
      },
    })
    .on('a[href],link[href]', {
      element(el) {
        links.push(el.getAttribute('href')!);
      },
    })
    .on('script[src],img[src]', {
      element(el) {
        links.push(el.getAttribute('src')!);
      },
    });
  await rewriter.transform(new Response(html)).text();
  // Theme radios use wrapping labels; named application fields use explicit associations.
  if (controls.some((id) => id && !labels.has(id)))
    report('a field lacks an associated explicit label');
  if (
    mains !== 1 ||
    h1s !== 1 ||
    titles !== 1 ||
    canonicals !== 1 ||
    descriptions !== 1
  )
    report('expected one main, h1, title, canonical, and description');
  if (/fonts\.(googleapis|gstatic)\.com/i.test(html))
    report('external font references remain');
  documents.set(file, { ids, links });
}
for (const [file, document] of documents) {
  for (const href of document.links) {
    if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
    const current = file.endsWith('/index.html')
      ? file.slice(dist.length).replace(/index\.html$/, '')
      : file.slice(dist.length);
    const url = new URL(href, `https://local.invalid${current}`);
    const path = join(dist, decodeURIComponent(url.pathname));
    const target =
      existsSync(path) && !url.pathname.endsWith('/')
        ? path
        : join(path, 'index.html');
    if (!existsSync(target))
      failures.push(`${current}: missing local destination ${href}`);
    else if (
      url.hash &&
      documents.has(target) &&
      !documents.get(target)!.ids.has(decodeURIComponent(url.hash.slice(1)))
    ) {
      failures.push(`${current}: missing anchor ${href}`);
    }
  }
}
for (const name of [
  '_headers',
  'index.html.br',
  'index.html.gz',
  '404.html',
  'robots.txt',
  'site.webmanifest',
  'sitemap-index.xml',
]) {
  if (!existsSync(join(dist, name))) failures.push(`Missing output ${name}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `Verified ${pages.length} rendered pages: structure, metadata, image dimensions, IDs, local links, CSP hashes, and compression artifacts.`,
);
