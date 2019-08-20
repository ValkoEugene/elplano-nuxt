// Информация о евентах

import eventsApi from '../api/events'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from './snackbars'

export const namespace = 'events'

export const Types = {
  mutations: {
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_EVENTS: 'SET_EVENTS',
    SET_EVENT: 'SET_EVENT',
    SET_EDITING_ID: 'SET_EDITING_ID',
    DELETE_EVENT: 'DELETE_EVENT'
  },
  actions: {
    LOAD_EVENTS: 'SET_EVENTS',
    CREATE_EVENT: 'CREATE_EVENT',
    EDIT_EVENT: 'EDIT_EVENT',
    DELETE_EVENT: 'DELETE_EVENT'
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
   * Предметы
   * @type {[
   *  {
   *    course_id: String,
   *    created_at: Date,
   *    description: String,
   *    end_at: Date,
   *    id: String,
   *    recurrence: Array,
   *    by_day: Array,
   *    start_at: Date,
   *    status: ('confirmed' | 'tentative' | 'cancelled'),
   *    timezone: String,
   *    title: String,
   *    updated_at: String
   *  }
   * ]}
   */
  events: [],

  /**
   * Id редактируемого евента
   * @type {String}
   */
  editingId: ''
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
   * Установить список евентов
   * @param {Object} state
   * @param {Array} events
   */
  [Types.mutations.SET_EVENTS](state, events) {
    state.events = events
  },

  /**
   * Установить евент
   * @param {Object} state
   * @param {Object} event
   */
  [Types.mutations.SET_EVENT](state, event) {
    if (state.events.some((item) => item.id === event.id)) {
      state.events = state.events.map((item) =>
        item.id === event.id ? event : item
      )
      return
    }

    state.events = [event, ...state.events]
  },

  /**
   * Установить id редактируемого евента
   * @param {Object} state
   * @param {String} id
   */
  [Types.mutations.SET_EDITING_ID](state, id) {
    state.editingId = id
  },

  /**
   * Удалить евент
   * @param {Object} state
   * @param {Object} event
   */
  [Types.mutations.DELETE_EVENT](state, id) {
    if (state.events.some((item) => item.id === id)) {
      state.events = state.events.filter((item) => item.id !== id)
    }
  }
}

export const actions = {
  /**
   * Загрузить список евентов
   * @param {Object} context
   */
  async [Types.actions.LOAD_EVENTS](context) {
    context.commit(Types.mutations.SET_LOADING, true)

    try {
      const events = await eventsApi.loadData()

      context.commit(Types.mutations.SET_EVENTS, events)
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
   * Создать евент
   * @param {Object} state
   * @param {Object} data
   */
  async [Types.actions.CREATE_EVENT](context, data) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      const event = await eventsApi.create(data)

      context.commit(Types.mutations.SET_EVENT, event)
      context.commit(Types.mutations.SET_EDITING_ID, event.id)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      context.commit(Types.mutations.SET_UPDATING, false)
    }
  },

  /**
   * Редактировать евент
   * @param {Object} state
   * @param {Object} data
   */
  async [Types.actions.EDIT_EVENT](context, data) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      const event = await eventsApi.update(data, data.id)

      context.commit(Types.mutations.SET_EVENT, event)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      context.commit(Types.mutations.SET_UPDATING, false)
    }
  },

  /**
   * Удалить евент
   * @param {Object} state
   * @param {String} id
   */
  async [Types.actions.DELETE_EVENT](context, id) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      await eventsApi.deleteById(id)

      context.commit(Types.mutations.DELETE_EVENT, id)
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
