import { Locales, localesList } from '~/store/i18n.ts'

/**
 * Получить локаль браузера
 */
export const getBrowserLocale = (): Locales => {
  const locale =
    (window && window.navigator && window.navigator.language) || 'ru'

  return localesList.includes(locale) ? (locale as Locales) : 'ru'
}
