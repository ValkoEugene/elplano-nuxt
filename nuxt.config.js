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
  plugins: ['~/plugins/rules', '~/plugins/i18n', '~/plugins/helpers'],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /**
   *
   */
  router: {
    middleware: ['i18n']
  },
  /*
   ** Nuxt.js modules
   */
  modules: ['nuxt-material-design-icons'],
  /**
   * Перменные окружения
   */
  env: {
    baseUrl: process.env.BASE_URL
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: {
            base: colors.purple.darken2,
            lighten1: colors.purple.lighten1,
            lighten2: colors.purple.lighten2,
            lighten3: colors.purple.lighten3,
            lighten4: colors.purple.lighten4,
            darken1: colors.purple.darken1,
            darken2: colors.purple.darken2,
            darken3: colors.purple.darken3,
            darken4: colors.purple.darken4,
            accent1: colors.purple.accent1,
            accent2: colors.purple.accent2,
            accent3: colors.purple.accent3,
            accent4: colors.purple.accent4
          },
          info: colors.purple.lighten1
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
    extend(config, ctx) {
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
