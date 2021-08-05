module.exports = {
  extends: ['@esvelo', 'plugin:@next/next/recommended'],
  root: true,
  rules: {
    'unicorn/no-array-for-each': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
  ],
}
