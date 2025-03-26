// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // TODO: Remove once `U` components are in `@nuxt/ui-pro`
    'import/first': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 3 }]
  }
})
