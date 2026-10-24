import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];
async function* walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, item.name);
    if (item.isDirectory()) yield* walk(path);
    else yield path;
  }
}
for (const name of [
  'bun.lock',
  'AGENTS.md',
  'README.md',
  'src/pages/404.astro',
  'public/fonts/OFL.txt',
]) {
  try {
    await access(resolve(root, name));
  } catch {
    failures.push(`Missing ${name}`);
  }
}
try {
  await access(resolve(root, 'package-lock.json'));
  failures.push('Use bun.lock as the sole lockfile.');
} catch {
  /* The npm lockfile is expected to be absent. */
}
for await (const path of walk(resolve(root, 'src'))) {
  if (!/\.(astro|mdx|css|ts)$/.test(path)) continue;
  const source = await readFile(path, 'utf8');
  const name = relative(root, path);
  const report = (message) => failures.push(`${name}: ${message}`);
  if (/fonts\.(?:googleapis|gstatic)\.com/.test(source))
    report('Use local font assets.');
  if (/\.(?:astro|mdx)$/.test(path)) {
    if (/<img\b/.test(source)) report('Use astro:assets for content images.');
    for (const image of source.matchAll(/<(?:Image|Picture)\b[^>]*>/gs)) {
      if (!/\balt\s*=/.test(image[0]))
        report(
          'Image/Picture needs explicit alt text, including empty alt for decoration.',
        );
    }
    if (
      /(?:src|href)=["']\/[^"']+\.(?:png|jpe?g|webp|avif|gif)["']/.test(
        source,
      ) &&
      !name.includes('layouts/')
    ) {
      report('Import content images from src/assets instead of public.');
    }
    if (/(?:^|[\s:,(])#[\da-f]{3,8}\b/im.test(source))
      report('Use theme tokens instead of literal colors.');
  }
  if (
    name.startsWith('src/pages/') &&
    name.endsWith('.astro') &&
    !/<Layout\b/.test(source)
  ) {
    report('Pages must compose the shared Layout.');
  }
  const styles = path.endsWith('.css')
    ? [source]
    : [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/g)].map(
        (match) => match[1],
      );
  for (const style of styles) {
    if (
      /(?:font-size|padding(?:-[\w-]+)?|margin(?:-[\w-]+)?|(?:row-|column-)?gap)\s*:[^;{}]*\dpx\b/.test(
        style,
      )
    ) {
      report('Use rem/em for typography and spacing.');
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    'Source conventions passed. These heuristic checks complement rendered-output and manual checks.',
  );
