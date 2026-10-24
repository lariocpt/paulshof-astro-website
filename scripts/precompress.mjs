// Hosts must explicitly negotiate these siblings (for example Caddy precompressed).
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompress, gzip, constants } from 'node:zlib';
import { promisify } from 'node:util';

const br = promisify(brotliCompress);
const gz = promisify(gzip);
const COMPRESSIBLE = new Set([
  '.html',
  '.css',
  '.js',
  '.mjs',
  '.json',
  '.svg',
  '.xml',
  '.txt',
  '.webmanifest',
]);
const MIN_BYTES = 512;

export async function precompressDirectory(directory) {
  const paths = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile() && COMPRESSIBLE.has(extname(path)))
        paths.push(path);
    }
  }
  await walk(directory);
  paths.sort();
  const totals = {
    files: 0,
    raw: 0,
    brotli: 0,
    gzip: 0,
    brFiles: 0,
    gzFiles: 0,
  };
  let next = 0;
  async function worker() {
    while (next < paths.length) {
      const path = paths[next++];
      const raw = await readFile(path);
      let compressed = [];
      if (raw.length >= MIN_BYTES) {
        compressed = await Promise.all([
          br(raw, {
            params: {
              [constants.BROTLI_PARAM_QUALITY]: 11,
              [constants.BROTLI_PARAM_SIZE_HINT]: raw.length,
            },
          }),
          gz(raw, { level: 9 }),
        ]);
        totals.files++;
        totals.raw += raw.length;
        totals.brotli += Math.min(raw.length, compressed[0].length);
        totals.gzip += Math.min(raw.length, compressed[1].length);
      }
      for (const [index, extension, count] of [
        [0, 'br', 'brFiles'],
        [1, 'gz', 'gzFiles'],
      ]) {
        const bytes = compressed[index];
        if (bytes && bytes.length < raw.length) {
          await writeFile(`${path}.${extension}`, bytes);
          totals[count]++;
        } else {
          // A repeated run must not serve an old sibling after the source shrinks.
          await rm(`${path}.${extension}`, { force: true });
        }
      }
    }
  }
  // Bound memory/CPU use on CI while allowing independent files to compress together.
  await Promise.all(
    Array.from({ length: Math.min(4, paths.length) }, () => worker()),
  );
  return totals;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const totals = await precompressDirectory(
    fileURLToPath(new URL('../dist/', import.meta.url)),
  );
  const kib = (value) => (value / 1024).toFixed(1);
  console.log(
    `precompress: ${totals.files} eligible files, ${totals.brFiles} .br / ${totals.gzFiles} .gz; ${kib(totals.raw)} KiB raw → ${kib(totals.brotli)} KiB Brotli / ${kib(totals.gzip)} KiB gzip`,
  );
}
