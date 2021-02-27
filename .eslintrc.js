module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',

    'no-debugger': 'error',
    'no-var': 'error',
    'no-redeclare': 'off',
    'prefer-const': 'error',
    eqeqeq: 'error',

    'vue/component-name-in-template-casing': ['error', 'kebab-case']
  }
}
