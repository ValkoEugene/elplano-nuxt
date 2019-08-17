// Информация о пользователе

import { getStudent, updateStudent } from '../api/student'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from './snackbars'

export const namespace = 'student'

export const Types = {
  mutations: {
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_STUDENT: 'SET_STUDENT'
  },
  actions: {
    GET_STUDENT: 'GET_STUDENT',
    UPDATE_STUDENT: 'UPDATE_STUDENT'
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
   * Информация о студенте
   * @type {Object}
   */
  student: {
    full_name: '',
    email: '',
    phone: '',
    about: '',
    social_networks: {
      twitter: '',
      facebook: ''
    },
    president: false,
    created_at: '',
    updated_at: ''
  }
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
   * Установить инцформацию о студенте
   * @param {Object} state
   * @param {Object} student
   */
  [Types.mutations.SET_STUDENT](state, student) {
    state.student = { ...state.student, ...student }
  }
}

export const actions = {
  /**
   * Получить информацию о студенте
   * @param {Object} context
   */
  async [Types.actions.GET_STUDENT](context) {
    context.commit(Types.mutations.SET_LOADING, true)

    try {
      const student = await getStudent()

      context.commit(Types.mutations.SET_STUDENT, student)
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
   * Обновить информацию о студенте
   * @param {Object} context
   * @param {Object} updatedStudent
   */
  async [Types.actions.UPDATE_STUDENT](context, updatedStudent) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      const student = await updateStudent(updatedStudent)

      context.commit(Types.mutations.SET_STUDENT, student)
      context.commit(Types.mutations.SET_UPDATING, false)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    }
  }
}
