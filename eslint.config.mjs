// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'import/first': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 3 }]
  }
})
