module.exports = {
  "root": true,
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    // 'plugin:vue/base',
    // 'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    // 'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    'vue/valid-v-on': 'off',
    'vue/require-v-for-key': 'off',
    'vue/no-reserved-keys': 'off',
    'vue/no-parsing-error': 'off',

    // plugin:vue/strongly-recommended
    'vue/html-self-closing': 'off',
  }
}
