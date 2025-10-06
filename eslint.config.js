import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const importOrderRule = [
  'error',
  {
    groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index', 'object', 'type']],
    pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
    pathGroupsExcludedImportTypes: ['builtin'],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
];

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage', 'node_modules', '**/*.generated.*', '**/__generated__/**']),

  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
    },

    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },

    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettier,
    ],

    rules: {
      /* Consistency & readability */
      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'nonblock-statement-body-position': ['error', 'beside'],
      'object-shorthand': ['error', 'always'],
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-var': 'error',
      eqeqeq: ['error', 'smart'],
      'no-implicit-coercion': ['warn', { allow: ['!!'] }],
      'no-nested-ternary': 'warn',

      /* Safety / correctness */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-param-reassign': ['warn', { props: true, ignorePropertyModificationsFor: ['draft', 'state'] }],
      'consistent-return': 'warn',
      'default-case-last': 'error',
      'dot-notation': 'error',
      'no-useless-return': 'warn',

      /* TypeScript (non type-aware) */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': ['warn', { fixToUnknown: false, ignoreRestArgs: true }],
      '@typescript-eslint/no-unnecessary-condition': 'off',

      /* React specifics */
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* Import hygiene */
      'import/order': importOrderRule,
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-mutable-exports': 'error',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/test/**',
            '**/__tests__/**',
            '**/*.{test,spec}.*',
            '**/*.config.*',
            '**/vite.config.*',
            '**/playwright.config.*',
            '**/eslint.config.*',
            '**/scripts/**',
          ],
          optionalDependencies: false,
          peerDependencies: true,
        },
      ],

      /* Minimal a11y */
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
    },
  },

  // Node/config scripts override
  {
    files: [
      '**/scripts/**/*.{js,ts}',
      '**/*.config.{js,cjs,mjs,ts}',
      'vite.config.*',
      'playwright.config.*',
      'eslint.config.js',
    ],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
]);
