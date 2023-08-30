module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-continue': 'off',
    'no-new': 'off', // GameObjects assign themselves to appropriate lists so are not thrown away
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'import/prefer-default-export': 'off',
  },
};
