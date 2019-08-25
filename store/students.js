// Информация о студентах

import groupUsersApi from '../api/group-users'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from './snackbars'

export const namespace = 'students'

export const Types = {
  mutations: {
    SET_LOADING: 'SET_LOADING',
    SET_STUDENTS: 'SET_STUDENTS'
  },
  actions: {
    LOAD_STUDENTS: 'SET_STUDENTS'
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
   * Список студентов
   * @type {Array}
   */
  students: []
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
   * Установить список студентов
   * @param {Object} state
   * @param {Array} students
   */
  [Types.mutations.SET_STUDENTS](state, students) {
    state.students = students
  }
}

export const actions = {
  /**
   * Загрузить список студентов
   * @param {Object} context
   */
  async [Types.actions.LOAD_STUDENTS](context) {
    context.commit(Types.mutations.SET_LOADING, true)

    try {
      const students = await groupUsersApi.getGroupUsers()

      context.commit(Types.mutations.SET_STUDENTS, students)
      context.commit(Types.mutations.SET_LOADING, false)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    }
  }
}
