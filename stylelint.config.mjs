export default {
  extends: ['stylelint-config-recommended'],
  ignoreFiles: ['node_modules/**', 'dist/**', '.astro/**'],
  overrides: [
    {
      files: ['**/*.astro'],
      customSyntax: 'postcss-html',
      rules: {
        'color-no-hex': true,
        'color-named': 'never',
        'function-disallowed-list': [
          'rgb',
          'rgba',
          'hsl',
          'hsla',
          'hwb',
          'lab',
          'lch',
          'oklab',
          'oklch',
        ],
      },
    },
  ],
  rules: {
    'at-rule-no-unknown': true,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
    'function-no-unknown': true,
  },
};
