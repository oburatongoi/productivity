module.exports = {
  "root": true,
  extends: [
    'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/valid-v-for': 'off',
    // 'vue/valid-v-on': 'off',
    // 'vue/require-v-for-key': 'off',
    // 'vue/no-reserved-keys': 'off',
    // 'vue/no-parsing-error': 'off',
    // 'vue/require-prop-types': 'off',
    // 'vue/require-default-prop': 'off',
    // 'vue/mustache-interpolation-spacing': 'off',
    // plugin:vue/strongly-recommended
    // 'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    "vue/name-property-casing": ["error", "kebab-case"],
    'vue/html-indent': 'off',
  }
}
