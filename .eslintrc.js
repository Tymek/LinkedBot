module.exports = {
  extends: ['@esvelo', 'plugin:@next/next/recommended'],
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
  ],
}
