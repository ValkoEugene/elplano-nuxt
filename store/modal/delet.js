/**
 * Module for deleting confirmation and delete item by other vuex modules
 */

export const namespace = 'modal/delet'

export const Types = {
  mutations: {
    SET_DELETING_ID: 'SET_DELETE_ID',
    SET_DELETING_NAMESPACE: 'SET_DELETE_NAMESPACE',
    SET_DELETING_ACTION: 'SET_DELETE_ACTION',
    SET_CONFIRMATION_TEXT: 'SET_CONFIRMATION_TEXT',
    SET_SHOW_CONFIRMATION: 'SET_SHOW_CONFIRMATION'
  },
  actions: {
    INIT_DELETING: 'INIT_DELETING',
    DELET_CONFIRMED: 'DELET_CONFIRMED'
  }
}

export const state = () => ({
  /**
   * Id deleting item
   * @type {String}
   */
  id: '',
  /**
   * Vuex module namespace for deleting item
   * @type {String}
   */
  namespace: '',
  /**
   * Vuex module action for deleting item
   * @type {String}
   */
  action: '',
  /**
   * Text that showing in delet confirmation
   * @type {String}
   */
  text: '',
  /**
   * Flag that confirm modal is open
   * @type {Boolean}
   */
  showingConfirmation: false
})

export const mutations = {
  /**
   * Set id for deleting item
   * @param {Object} state
   * @param {String} id
   */
  [Types.mutations.SET_DELETING_ID](state, id) {
    state.id = id
  },
  /**
   * Set namespace for deleting item Module in vuex
   * @param {Object} state
   * @param {String} namespace
   */
  [Types.mutations.SET_DELETING_NAMESPACE](state, namespace) {
    state.namespace = namespace
  },
  /**
   * Set action for delet item Module in vuex
   * @param {Object} state
   * @param {String} action
   */
  [Types.mutations.SET_DELETING_ACTION](state, action) {
    state.action = action
  },
  /**
   * Set confirmation text
   * @param {Object} state
   * @param {String} text
   */
  [Types.mutations.SET_CONFIRMATION_TEXT](state, text) {
    state.text = text
  },
  /**
   * Set showingConfirmation flag
   * @param {Object} state
   * @param {String} showingConfirmation
   */
  [Types.mutations.SET_SHOW_CONFIRMATION](state, showingConfirmation) {
    state.showingConfirmation = showingConfirmation
  }
}

export const actions = {
  /**
   * Init data about deleting item
   * @param {{ commit: Function }} context
   * @param {Object} config
   */
  [Types.actions.INIT_DELETING]({ commit }, config) {
    const { id, namespace, action, text } = config

    commit(Types.mutations.SET_DELETING_ID, id)
    commit(Types.mutations.SET_DELETING_NAMESPACE, namespace)
    commit(Types.mutations.SET_DELETING_ACTION, action)
    commit(Types.mutations.SET_CONFIRMATION_TEXT, text)

    commit(Types.mutations.SET_SHOW_CONFIRMATION, true)
  },
  /**
   * Delete item by vuex action
   * @param {{ commit: Function, state: Object }} context
   */
  [Types.actions.DELET_CONFIRMED]({ dispatch, state }) {
    const { namespace, action, id } = state

    dispatch(`${namespace}/${action}`, id, { root: true })
  }
}
