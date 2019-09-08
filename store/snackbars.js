// Сообщения для snakbars

export const namespace = 'snackbars'

export const Types = {
  mutations: {
    SET_SNACKBARS: 'SET_SNACKBARS',
    ADD_SNACKBARS: 'ADD_SNACKBARS'
  }
}

/**
 * Добавить сообщения через экземпляр store
 * @param {Object} store - экземпдяр store vuex
 * @param {Array} snackbars - сообщения
 */
export const addSnackbarsByStore = (store, snackbars) => {
  store.commit(`${namespace}/${Types.mutations.ADD_SNACKBARS}`, snackbars)
}

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
  [Types.mutations.SET_SNACKBARS](state, snackbars) {
    state.snackbars = [...snackbars]
  },

  /**
   * Добавить сообщения
   * @param {Object} state
   * @param {Array} snackbars
   */
  [Types.mutations.ADD_SNACKBARS](state, snackbars) {
    state.snackbars = [...state.snackbars, ...snackbars]
  }
}
