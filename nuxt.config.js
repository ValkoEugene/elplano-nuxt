import shrinkRay from 'shrink-ray-current'
import colors from 'vuetify/es5/util/colors'
import MomentLocalesPlugin from 'moment-locales-webpack-plugin'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/global.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/VuexDecaratorsModules',
    '~/plugins/rules',
    '~/plugins/i18n',
    '~/plugins/helpers',
    '~/plugins/composition-api',
    { src: '~/plugins/vuex-client-plugins.ts', mode: 'client' },
    { src: '~/plugins/a2hs.ts', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build'
  ],
  /**
   *
   */
  router: {
    middleware: ['i18n']
  },
  manifest: {
    name: 'EL Plano app',
    short_name: 'EL Plano',
    description: 'Student schedule management applications',
    theme_color: '#1976d2',
    start_url: '/schedule',
    icons: [
      {
        src: 'icon.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ],
    display: 'standalone'
  },
  render: {
    compressor: shrinkRay()
  },
  workbox: {
    offline: true
    // importScripts: ['custom-sw.js']
  },
  /*
   ** Nuxt.js modules
   */
  modules: ['nuxt-material-design-icons', '@nuxtjs/pwa'],
  /**
   * Перменные окружения
   */
  env: {
    baseUrl: process.env.BASE_URL,
    VK_AUTH_CLIENT_ID: process.env.VK_AUTH_CLIENT_ID,
    VK_AUTH_REDIRECT_URL: process.env.VK_AUTH_REDIRECT_URL,
    GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
    YANDEX_AUTH_CLIENT_ID: process.env.YANDEX_AUTH_CLIENT_ID,
    YANDEX_AUTH_REDITECT_URL: process.env.YANDEX_AUTH_REDITECT_URL,
    FACEBOOK_AUTH_CLIENT_ID: process.env.FACEBOOK_AUTH_CLIENT_ID,
    FACEBOOK_AUTH_REDIRECT_URL: process.env.FACEBOOK_AUTH_REDIRECT_URL
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        light: {
          primary: {
            base: colors.blue.darken2,
            lighten1: colors.blue.lighten1,
            lighten2: colors.blue.lighten2,
            lighten3: colors.blue.lighten3,
            lighten4: colors.blue.lighten4,
            darken1: colors.blue.darken1,
            darken2: colors.blue.darken2,
            darken3: colors.blue.darken3,
            darken4: colors.blue.darken4,
            accent1: colors.blue.accent1,
            accent2: colors.blue.accent2,
            accent3: colors.blue.accent3,
            accent4: colors.blue.accent4
          },
          info: colors.blue.lighten1
        },
        dark: {
          info: colors.grey.darken3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config /** ctx */) {
      // Убираем неиспользуемые локали
      config.plugins.push(new MomentLocalesPlugin())
      config.plugins.push(
        new MomentLocalesPlugin({
          localesToKeep: ['ru', 'en-gb']
        })
      )
    }
  }
}
