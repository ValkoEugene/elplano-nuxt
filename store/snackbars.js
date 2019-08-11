// Сообщения для snakbars

export const state = () => ({
  /**
   * Список сообщений
   * @type {[
   *  {
   *    text: String,
   *    color: ('success'|'info' | 'error')
   *  }
   * ]}
   */
  snackbars: []
})

export const mutations = {
  /**
   * Установить сообщения
   * @param {Object} state
   * @param {Array} snackbars
   */
  setSnackbars(state, snackbars) {
    state.snackbars = [...snackbars]
  },

  /**
   * Добавить сообщения
   * @param {Object} state
   * @param {Array} snackbars
   */
  addSnackbars(state, snackbars) {
    state.snackbars = [...state.snackbars, ...snackbars]
  }
}
