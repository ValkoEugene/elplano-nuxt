// Информация о преподавателях

import lecturersApi from '../api/lecturers'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from './snackbars'
import {
  namespace as modalEditNamespace,
  Types as modalEditTypes
} from './modal/edit'

export const namespace = 'lecturers'

export const Types = {
  mutations: {
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_LECTURERS: 'SET_LECTURERS',
    SET_LECTURER: 'SET_LECTURER',
    SET_EDITING_ID: 'SET_EDITING_ID',
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
   * @type {Array}
   */
  lecturers: [],

  /**
   * Id редактируемого преподавателя
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
    if (state.lecturers.some((item) => item.id === lecturer.id)) {
      state.lecturers = state.lecturers.map((item) =>
        item.id === lecturer.id ? lecturer : item
      )
      return
    }

    state.lecturers = [lecturer, ...state.lecturers]
  },

  /**
   * Установить id редактируемого преподавателя
   * @param {Object} state
   * @param {String} id
   */
  [Types.mutations.SET_EDITING_ID](state, id) {
    state.editingId = id
  },

  /**
   * Удалить преподавателя
   * @param {Object} state
   * @param {Object} lecturer
   */
  [Types.mutations.DELETE_LECTURER](state, id) {
    if (state.lecturers.some((item) => item.id === id)) {
      state.lecturers = state.lecturers.filter((item) => item.id !== id)
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

      context.commit(Types.mutations.SET_LECTURERS, lecturers)
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
      context.commit(Types.mutations.SET_EDITING_ID, lecturer.id)

      if (!context.rootState.modal.edit.editId) {
        context.commit(
          `${modalEditNamespace}/${modalEditTypes.mutations.SET_EDITING_ID}`,
          lecturer.id,
          { root: true }
        )
      }
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
