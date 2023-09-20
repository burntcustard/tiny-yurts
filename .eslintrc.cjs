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
    // Named exports rather than default exports allow >1 related item to be exported more cleanly
    'import/prefer-default-export': 'off',

    // Continue is used to skip the current for() loop iteration
    'no-continue': 'off',

    // GameObjects assign themselves to appropriate lists so are not thrown away
    'no-new': 'off',

    'no-plusplus': 'off',

    // Allow addEventListener without document. - we know what these globals are
    'no-restricted-globals': 'off',

    // No return statement means that undefined is returned
    'no-return-assign': 'off',

    // Prefer single quotes, but allow template literals because it's how we detect/minify CSS
    'quotes': [ 'error', 'single', {
      'allowTemplateLiterals': true,
    }],
  },
};
