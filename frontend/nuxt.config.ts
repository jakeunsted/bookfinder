import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  ssr: false,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  alias: {
    pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    './modules/eslintrc.js',
    '@pinia/nuxt',
    '@nuxtjs/ionic',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      jwtSecret: process.env.SECRET_KEY,
      baseUrl: process.env.API_BASE_URL,
    },
    app: {
      baseUrl: process.env.API_BASE_URL,
    }
  },
  compatibilityDate: '2024-07-22',
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  }
})