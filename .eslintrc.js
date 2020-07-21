module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  // Отключил для корректной работы typescript
  // parserOptions: {
  //   parser: 'babel-eslint'
  // },
  extends: [
    '@nuxtjs',
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['prettier', '@typescript-eslint'],
  // add your custom rules here
  rules: {
    camelcase: 'off',
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'import/no-unresolved': 'error',
    'prettier/prettier': ['error']
  },
  settings: {
    // Чтобы ESLint понимал импорты с алиасами Nuxt
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              '~': __dirname
            }
          }
        }
      }
    }
  }
}
