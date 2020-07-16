// eslint-disable-next-line import/no-unresolved
import { Context } from '@nuxt/types'
import { Locales } from '~/store/i18n.ts'

export default function({ isHMR, app, store, route, error }: Context) {
  const defaultLocale = app.i18n.fallbackLocale
  const I18nModule = app.$vuexModules.I18n

  // Игнорируем hotreload
  if (isHMR) return

  if (store.state.i18n.locale) return

  const locale = route.query.lang || defaultLocale

  if (!store.state.i18n.locales.includes(locale)) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }

  I18nModule.SET_LANG(locale as Locales)

  console.log('store.state.i18n.locale', store.state.i18n.locale)

  app.i18n.locale = store.state.i18n.locale
}
