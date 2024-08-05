import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// import '~/assets/scss/main.scss'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        dark: {
          colors: {
            primary: '#3FC0F3',
            secondary: '#001011',
            accent: '#0D9BD3',
          },
        },
      },
    }
  })
  app.vueApp.use(vuetify)
})