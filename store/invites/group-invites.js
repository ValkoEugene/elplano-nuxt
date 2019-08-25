// Информация о предметах

import adminInvitesApi from '../../api/admin-invites'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from '../snackbars'

export const namespace = 'invites/group-invites'

export const Types = {
  mutations: {
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_INVITES: 'SET_INVITES'
  },
  actions: {
    LOAD_INVITES: 'LOAD_INVITES',
    SEND_INVITE: 'SEND_INVITE'
  }
}

export const state = () => ({
  /**
   * Флаг загрузки
   * @type {Boolean}
   */
  loading: true,

  /**
   * Флаг процесса обновления
   * @type {Boolean}
   */
  updating: false,

  /**
   * Пришлашения
   * @type {Array}
   */
  invites: []
})

export const mutations = {
  /**
   * Установить флаг процесса загрузки
   * @param {Object} state
   * @param {Boolean} value
   */
  [Types.mutations.SET_LOADING](state, value) {
    state.loading = value
  },

  /**
   * Установить флаг процесса обновления
   * @param {Object} state
   * @param {Boolean} value
   */
  [Types.mutations.SET_UPDATING](state, value) {
    state.updating = value
  },

  /**
   * Установить список приглашений
   * @param {Object} state
   * @param {Array} invites
   */
  [Types.mutations.SET_INVITES](state, invites) {
    state.invites = invites
  }
}

export const actions = {
  /**
   * Загрузить список приглашений
   * @param {Object} context
   */
  async [Types.actions.LOAD_INVITES](context) {
    context.commit(Types.mutations.SET_LOADING, true)

    try {
      const invites = await adminInvitesApi.getInvites()

      context.commit(Types.mutations.SET_INVITES, invites)
      context.commit(Types.mutations.SET_LOADING, false)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    }
  },

  /**
   * Отправить приглашение
   * @param {Object} context
   * @param {Object} data
   */
  async [Types.actions.SEND_INVITE](context, data) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      await adminInvitesApi.sendInvite(data)

      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        [{ text: window.$nuxt.$t('invites.sended'), color: 'success' }],
        { root: true }
      )
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      context.commit(Types.mutations.SET_UPDATING, false)
    }
  }
}
