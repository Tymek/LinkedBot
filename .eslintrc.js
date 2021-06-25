module.exports = {
  extends: '@esvelo',
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
