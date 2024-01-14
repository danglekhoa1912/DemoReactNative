module.exports = {
  env: {
    'jest/globals': true,
  },
  root: true,
  extends: '@react-native',
  plugins: ['no-relative-import-paths'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    quotes: ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'react/require-default-props': ['error'],
    'react/default-props-match-prop-types': ['error'],
    'react/sort-prop-types': ['error'],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-relative-import-paths/no-relative-import-paths': [
      'error',
      {allowSameFolder: true, rootDir: 'src', prefix: '@'},
    ],
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
