import { namespace, Types } from '../store/i18n'

export default function({ isHMR, app, store, route, params, error, redirect }) {
  const defaultLocale = app.i18n.fallbackLocale

  // Игнорируем hotreload
  if (isHMR) return

  const locale = route.query.lang || defaultLocale

  if (!store.state.i18n.locales.includes(locale)) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }

  store.commit(`${namespace}/${Types.mutations.SET_LANG}`, locale, {
    root: true
  })

  console.log('store.state.i18n.locale', store.state.i18n.locale)

  app.i18n.locale = store.state.i18n.locale
}
