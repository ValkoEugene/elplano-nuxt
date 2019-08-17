// Интернациализация

export const namespace = 'i18n'

export const Types = {
  mutations: {
    SET_LANG: 'SET_LANG'
  }
}

export const state = () => ({
  /**
   * Список локалей
   * @type {[String]}
   */
  locales: ['en', 'ru'],

  /**
   * Текущая локаль
   * @type {String}
   */
  locale: 'ru'
})

export const mutations = {
  /**
   * Установить локаль
   * @param {Object} state
   * @param {String} locale
   */
  [Types.mutations.SET_LANG](state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  }
}
