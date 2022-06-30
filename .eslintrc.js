// @ts-check
const { defineConfig } = require('eslint-define-config');
const { readGitignoreFiles } = require('eslint-gitignore');

module.exports = defineConfig({
  ignorePatterns: [
    ...readGitignoreFiles(),
    '.eslintrc.js', // Skip self linting
  ],
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.lint.json',
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['vue', '@typescript-eslint/eslint-plugin', 'prettier', 'import'],
  rules: {
    curly: ['error'],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'linebreak-style': ['error', 'unix'],
    'max-classes-per-file': 'error',
    'max-len': ['warn', { code: 120 }],
    'no-case-declarations': 'warn',
    'no-constant-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-concat': 'error',
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', { avoidEscape: true }],

    // Cant resolve module.exports = ...
    // https://github.com/benmosher/eslint-plugin-import/issues/1145
    'import/default': 'warn',

    'import/no-unresolved': 'error',

    // Cant resolve types
    // https://github.com/benmosher/eslint-plugin-import/issues/1341
    'import/named': 'off',

    'max-lines': ['warn', 400],

    'id-denylist': [
      'error',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined',
    ],

    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    indent: ['off', 2],
    '@typescript-eslint/indent': ['off', 2],

    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn'],

    '@typescript-eslint/array-type': [
      'warn',
      { default: 'array-simple', readonly: 'generic' },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-expect-error': 'allow-with-description' },
    ],
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true },
    ],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/lines-between-class-members': [
      'warn',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-readonly': 'warn',
    '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowNumber: true, allowBoolean: true },
    ],

    'vue/multi-word-component-names': 'off',
    'vue/no-parsing-error': 'off',
    'vue/no-template-shadow': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: 'tsconfig.lint.json',
        extraFileExtensions: ['.vue'],
        templateTokenizer: {
          pug: 'vue-eslint-parser-template-tokenizer-pug',
        },
        tsconfigRootDir: './',
      },
    },
  ],
});
