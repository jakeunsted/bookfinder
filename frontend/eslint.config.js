import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';


export default [
  {files: ['**/*.{js,mjs,cjs,vue}']},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    rules: {
      // Enforce semi-colons
      'semi': ['error', 'always'],
      // Enforce consistent indentation (2 spaces)
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      // Enforce single quotes for strings
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      // Limit line length to 80 characters
      'max-len': ['error', { 'code': 80 }],
      // Require trailing commas where valid in
      // ECMAScript 5 (objects, arrays, etc.)
      'comma-dangle': ['error', 'always-multiline'],
      // Enforce no unused variables
      'no-unused-vars': ['warn'],
      // Vue-specific rules
      // Enforce 2 spaces for HTML in Vue templates
      'vue/html-indent': ['error', 2], 
      // Disable multi-word component name rule in Vue (for simplicity)
      'vue/multi-word-component-names': 'off', 
      // Disable use of v-html to prevent XSS
      'vue/no-v-html': 'off',
      // Disable no-undef for Vue and Nuxt-specific functions
      'no-undef': 'off',
    },
  },
];