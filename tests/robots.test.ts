import { expect, test } from 'bun:test';
import { resolve } from 'node:path';

for (const setting of [undefined, 'ENABLED', 'enabled', 'true', 'DISABLED']) {
  test(`robots.txt ${setting === 'ENABLED' ? 'allows' : 'disallows'} crawling with ROBOTSTXT=${setting ?? '(unset)'}`, () => {
    const env: NodeJS.ProcessEnv = { ...process.env, SITE_INDEXABLE: 'true' };
    delete env.ROBOTSTXT;
    if (setting !== undefined) env.ROBOTSTXT = setting;
    const route = resolve(import.meta.dir, '../src/pages/robots.txt.ts');
    const script = `const { GET } = await import(${JSON.stringify(route)}); const response = await GET({ site: new URL('https://example.test') }); console.log(JSON.stringify(await response.text()));`;
    const result = Bun.spawnSync([process.execPath, '-e', script], { env });
    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout.toString())).toBe(
      `User-agent: *\n${setting === 'ENABLED' ? 'Allow: /' : 'Disallow: /'}\n\nSitemap: https://example.test/sitemap-index.xml\n`,
    );
  });
}
