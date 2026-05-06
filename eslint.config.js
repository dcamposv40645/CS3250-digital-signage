const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        browser: 'readonly',
        document: 'readonly',
        window: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        Chart: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'eqeqeq': 'error',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
    },
  },
  {
    files: ['**/*.test.js', '**/tests/**'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        jest: 'readonly',
      },
    },
  },
];