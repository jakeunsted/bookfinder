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
        light: {
          colors: {
            background: '#FFFFFF', // 1
            grey: '#8B8D98',
            primary: '#3FC0F3', // 9
            links: '#007DAC', // 11
            highContrast: '#003C57', // 12
            buttons: '#2FB5E7', // 10
            focus: '#33B8EA', // 8
            border: '#9EDCFA', // 6
            interactiveComponent: '#B8E8FF', // 5
            white: '#FCFCFD'
          },
        },
        dark: {
          colors: {
            background: '#051414', // 1
            grey: '#8B8D98',
            primary: '#33F0F3', // 9
            links: '#00D7DA', // 11
            highContrast: '#ACF9F9', // 12
            buttons: '#1AE6E9', // 10
            focus: '#008486', // 8
            border: '#005A5C', // 6
            interactiveComponent: '#004A4C', // 5
            white: '#FCFCFD',
          },
        },
        pink: {
          colors: {
            background: '#FFE8FA', // 3
            grey: '#8B8D98',
            primary: '#F43EDC', // 9
            links: '#C500B0', // 11
            highContrast: '#68005C', // 12
            buttons: '#E62CCF', // 10
            focus: '#E28CD2', // 8
            border: '#F3BBE7', // 6
            interactiveComponent: '#F9CBEF', // 5
            white: '#FCFCFD'
          },
        },
      },
    }
  })
  app.vueApp.use(vuetify)
})