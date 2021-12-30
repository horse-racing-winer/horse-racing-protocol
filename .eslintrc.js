const base = require('@hrw/dev/config/eslint.cjs');

module.exports = {
  ...base,
  ignorePatterns: [
    '.eslintrc.js',
    '.github/**',
    '.vscode/**',
    '.yarn/**',
    '**/build/*',
    '**/coverage/*',
    '**/node_modules/*'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.json'
    ]
  },
  rules: {
    ...base.rules,
    'simple-import-sort/imports': [2, {
      groups: [
        ['^\u0000'], // all side-effects (0 at start)
        ['\u0000$', '^@hrw.*\u0000$', '^\\..*\u0000$'], // types (0 at end)
        ['^[^/\\.]'], // non-hrw
        ['^@hrw'], // hrw
        ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'] // local (. last)
      ]
    }],
  }
};
