// Информация о преподавателях

import lecturersApi from '../api/lecturers'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from './snackbars'

export const namespace = 'lecturers'

export const Types = {
  mutations: {
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_LECTURERS: 'SET_LECTURERS',
    SET_LECTURER: 'SET_LECTURER',
    DELETE_LECTURER: 'DELETE_LECTURER'
  },
  actions: {
    LOAD_LECTURERS: 'SET_LECTURERS',
    CREATE_LECTURER: 'CREATE_LECTURER',
    EDIT_LECTURER: 'EDIT_LECTURER',
    DELETE_LECTURER: 'DELETE_LECTURER'
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
   * Преподаватели
   * @type {Object}
   */
  lecturers: {}
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
   * Установить список преподавателей
   * @param {Object} state
   * @param {Array} lecturers
   */
  [Types.mutations.SET_LECTURERS](state, lecturers) {
    state.lecturers = lecturers
  },

  /**
   * Установить предмет
   * @param {Object} state
   * @param {Object} lecturer
   */
  [Types.mutations.SET_LECTURER](state, lecturer) {
    state.lecturers[lecturer.id] = lecturer
  },

  /**
   * Удалить преподавателя
   * @param {Object} state
   * @param {Object} lecturer
   */
  [Types.mutations.DELETE_LECTURER](state, id) {
    if (state.lecturers[id]) {
      delete state.lecturers[id]
    }
  }
}

export const actions = {
  /**
   * Загрузить список преподавателей
   * @param {Object} context
   */
  async [Types.actions.LOAD_LECTURERS](context) {
    context.commit(Types.mutations.SET_LOADING, true)

    try {
      const lecturers = await lecturersApi.loadData()

      const formatedLecturers = {}
      lecturers.forEach((item) => {
        formatedLecturers[item.id] = item
      })

      context.commit(Types.mutations.SET_LECTURERS, formatedLecturers)
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
   * Создать преподавателя
   * @param {Object} state
   * @param {Object} data
   */
  async [Types.actions.CREATE_LECTURER](context, data) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      const lecturer = await lecturersApi.create(data)

      context.commit(Types.mutations.SET_LECTURER, lecturer)
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
   * Редактировать преподавателя
   * @param {Object} state
   * @param {Object} data
   */
  async [Types.actions.EDIT_LECTURER](context, data) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      const lecturer = await lecturersApi.update(data, data.id)

      context.commit(Types.mutations.SET_LECTURER, lecturer)
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
   * Удалить преподавателя
   * @param {Object} state
   * @param {String} id
   */
  async [Types.actions.DELETE_LECTURER](context, id) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      await lecturersApi.deleteById(id)

      context.commit(Types.mutations.DELETE_LECTURER, id)
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
