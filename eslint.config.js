// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { globals } from './eslintrc.json'
export default createConfigForNuxt({
  features: {
    stylistic: {
      semi: true,
    },
    tooling: true,
    typescript: false,
  },
  dirs: {
    components: ['components'],
    composables: ['composables'],
    layouts: ['layouts'],
    pages: ['pages'],
    plugins: ['plugins'],
    servers: ['server'],
    src: [
      'stores',
    ],
  },
}).append(
  {
    ignores: [
      'node_modules/**',
    ],
  },
  {
    languageOptions: {
      globals: {
        defineEventHandler: true,
        ...globals,
      },
    },
    files: ['pages/**/*.vue', 'components/**/*.vue', 'server/**/*.js', 'plugins/**/*.js'],
    rules: {
      'vue/no-v-html': 'off',
      'no-undef': 'off',
    },
  },
);