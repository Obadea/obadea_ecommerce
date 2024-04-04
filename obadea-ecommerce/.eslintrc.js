module.exports = {
  root: true,
  extends: [
    'plugin:@next/next/recommended',
    '@payloadcms',
    'eslint:recommended',
    'plugin:simple-import-sort/recommended',
  ],
  ignorePatterns: ['**/payload-types.ts'],
  plugins: ['prettier', 'simple-import-sort'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
}
