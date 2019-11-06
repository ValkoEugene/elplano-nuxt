import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { Context } from '@nuxt/types'

Vue.use(VueI18n)

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    i18n: VueI18n
  }
}

export default ({ app, store }: Context) => {
  app.i18n = new VueI18n({
    locale: store.state.i18n.locale,
    fallbackLocale: 'ru',
    messages: {
      en: require('~/locales/en.json'),
      ru: require('~/locales/ru.json')
    }
  })
}
