module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:perfectionist/recommended-natural-legacy',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'perfectionist', 'unused-imports'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'react-hooks/rules-of-hooks': 'warn',

    // ESLint Imports
    'import/no-named-as-default-member': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],

    // Perfectionist
    'perfectionist/sort-imports': [
      'error',
      {
        customGroups: {
          value: {
            react: ['react', 'react-*'],
          },
          type: {
            'react-type': ['react', 'react-*'],
          },
        },
        groups: [
          ['builtin'],
          ['react'],
          ['external'],
          ['internal'],
          ['parent', 'sibling', 'index'],
          ['unknown'],
          ['react-type', 'type', 'internal-type', 'parent-type', 'sibling-type', 'index-type'],
          ['side-effect'],
          ['style', 'object'],
        ],
        internalPattern: ['~/**'],
        newlinesBetween: 'always',
        order: 'asc',
        type: 'natural',
        ignoreCase: true,
      },
    ],
  },
};
