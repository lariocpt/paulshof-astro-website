import { test, expect } from 'bun:test';
import { resolve } from 'node:path';
import { ESLint } from 'eslint';
import stylelint from 'stylelint';
import { format, resolveConfig } from 'prettier';

const root = resolve(import.meta.dir, '..');
const astroPath = resolve(root, 'src/components/QualityFixture.astro');

test('CSS linting rejects unknown properties in standalone CSS and Astro style blocks', async () => {
  for (const [code, codeFilename] of [
    ['.fixture { colr: red; }', resolve(root, 'src/styles/fixture.css')],
    ['<style>.fixture { colr: red; }</style>', astroPath],
  ]) {
    const result = await stylelint.lint({ code, codeFilename, cwd: root });
    expect(result.errored).toBe(true);
    expect(
      result.results
        .flatMap((item) => item.warnings)
        .some((item) => item.rule === 'property-no-unknown'),
    ).toBe(true);
  }
});

test('ESLint rejects TypeScript mistakes', async () => {
  const eslint = new ESLint({ cwd: root });
  const results = await eslint.lintText('const unused: string = "unused";', {
    filePath: resolve(root, 'src/quality-fixture.ts'),
  });
  expect(
    results
      .flatMap((item) => item.messages)
      .some((item) => item.ruleId === '@typescript-eslint/no-unused-vars'),
  ).toBe(true);
});

test('formatted Astro, CSS and TypeScript pass both linters without formatting churn', async () => {
  const options = { ...(await resolveConfig(astroPath)), filepath: astroPath };
  const source =
    '<button class="fixture" type="button">Example</button><style>.fixture{color:var(--color-text);padding:var(--space-2)}</style><script>const label: string="ready"; console.info(label);</script>';
  const formatted = await format(source, options);
  expect(await format(formatted, options)).toBe(formatted);
  const css = await stylelint.lint({
    code: formatted,
    codeFilename: astroPath,
    cwd: root,
  });
  expect(css.errored).toBe(false);
  const eslint = new ESLint({ cwd: root, fix: true });
  const [result] = await eslint.lintText(formatted, { filePath: astroPath });
  expect(result.errorCount).toBe(0);
  expect(result.warningCount).toBe(0);
  expect(result.output ?? formatted).toBe(formatted);
});

test('component colors must use theme tokens', async () => {
  const result = await stylelint.lint({
    code: '<style>.fixture { color: #ffffff; }</style>',
    codeFilename: astroPath,
    cwd: root,
  });
  expect(result.errored).toBe(true);
  expect(
    result.results
      .flatMap((item) => item.warnings)
      .some((item) => item.rule === 'color-no-hex'),
  ).toBe(true);
});
