import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/en-gb'

// Устанавливаем локаль по умолчанию
moment.locale('ru')

export default moment

/**
 * Устанвить локаль
 * !!! После смены локали необходимо создать новые объекты moment, использовать $forceUpdate !!!
 * @param {String} lang
 */
export function setLocale(lang) {
  if (lang !== 'ru' && lang !== 'en') return
  if (lang === 'en') lang = 'en-gb'

  moment.locale(lang)
}
