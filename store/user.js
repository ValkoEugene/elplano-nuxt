// Информация о пользователе

import axios from 'axios'
import userApi from '../api/user'
import getRouter from '../plugins/getRouter'
import { setTokensInCookie, resetTokensInCookie } from '../utils/auth'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from './snackbars'
import { namespace as groupNamespace, Types as groupTypes } from './group'

export const namespace = 'user'

export const Types = {
  mutations: {
    SET_LOGIN_FETCHING: 'SET_LOGIN_FETCHING',
    SET_USER: 'SET_USER',
    SET_STUDENT: 'SET_STUDENT',
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN',
    SET_REFRESH_TOKEN: 'SET_REFRESH_TOKEN'
  },
  actions: {
    SET_TOKENS: 'SET_TOKENS',
    RESET_USER: 'RESET_USER',
    GET_USER_INFO: 'GET_USER_INFO',
    UPDATE_STUDENT: 'UPDATE_STUDENT',
    LOGIN: 'LOGIN'
  },
  getters: {
    IS_AUTH: 'IS_AUTH',
    IS_ADMIN: 'IS_ADMIN',
    IS_CONFIRMED: 'IS_CONFIRMED',
    IS_PRESIDENT: 'IS_PRESIDENT'
  }
}

const userTemplate = {
  email: '',
  username: '',
  admin: false,
  created_at: '',
  updated_at: '',
  avatar_url: '',
  confirmed: false
}

export const state = () => ({
  /**
   * Флаг процесса авторизации
   * @type {Boolean}
   */
  loginFetching: false,

  /**
   * Флаг загрузки
   * @type {Boolean}
   */
  loading: true,

  /**
   * Флаг обновления
   * @type {Boolean}
   */
  updating: false,

  /**
   * Информация о пользователе
   * @type {Object | null}
   */
  userInfo: {},

  /**
   * Информация о студенте
   * @type {Object}
   */
  studentInfo: {},

  /**
   * Токен
   * @type {string}
   */
  access_token: '',

  /**
   * Рефреш токен
   * @type {String}
   */
  refresh_token: ''
})

export const mutations = {
  /**
   * Установить флаг процесса авторизации
   * @param {Object} state
   * @param {Boolean} value
   */
  [Types.mutations.SET_LOGIN_FETCHING](state, value) {
    state.loginFetching = value
  },

  /**
   * Установить инцформацию о пользоавтеле
   * @param {Object} state
   * @param {Object} userInfo
   */
  [Types.mutations.SET_USER](state, userInfo) {
    state.userInfo = { ...state.userInfo, ...userInfo }
  },

  /**
   * Установить инцформацию о студенте
   * @param {Object} state
   * @param {Object} student
   */
  [Types.mutations.SET_STUDENT](state, student) {
    state.studentInfo = { ...state.studentInfo, ...student }
  },

  /**
   * Установить access_token
   * @param {Object} state
   * @param {String} access_token
   */
  [Types.mutations.SET_ACCESS_TOKEN](state, access_token) {
    state.access_token = access_token
  },

  /**
   * Установить refresh_token
   * @param {Object} state
   * @param {String} refresh_token
   */
  [Types.mutations.SET_REFRESH_TOKEN](state, refresh_token) {
    state.refresh_token = refresh_token
  },

  /**
   * Установить флаг загрузки
   * @param {Object} state
   * @param {String} loading
   */
  [Types.mutations.SET_LOADING](state, loading) {
    state.loading = loading
  },

  /**
   * Установить флаг обновления
   * @param {Object} state
   * @param {String} updating
   */
  [Types.mutations.SET_UPDATING](state, updating) {
    state.updating = updating
  }
}

export const actions = {
  /**
   * Установить токены
   * @param {{ commit: Function }}
   * @param {{ access_token: String, refresh_token: String }} tokens
   */
  [Types.actions.SET_TOKENS]({ commit }, tokens) {
    const { access_token, refresh_token } = tokens

    commit(Types.mutations.SET_ACCESS_TOKEN, access_token)
    commit(Types.mutations.SET_REFRESH_TOKEN, refresh_token)
    setTokensInCookie(tokens)
  },

  /**
   * Сбросить пользователя
   * @param {{ commit: Function }}
   */
  [Types.actions.RESET_USER]({ commit }) {
    commit(Types.mutations.SET_ACCESS_TOKEN, '')
    commit(Types.mutations.SET_REFRESH_TOKEN, '')
    commit(Types.mutations.SET_USER, { ...userTemplate })
    commit(Types.mutations.SET_LOADING, true)
    resetTokensInCookie()
  },

  /**
   * Вход
   * @param {Object} context
   * @param {{ login: String, password: String }}
   */
  async [Types.actions.LOGIN](context, { login, password }) {
    context.commit(Types.mutations.SET_LOGIN_FETCHING, true)

    try {
      const data = { login, password, grant_type: 'password' }

      const response = await axios.post(
        `${process.env.baseUrl}/oauth/token`,
        data
      )
      const { access_token, refresh_token } = response.data

      context.dispatch(Types.actions.SET_TOKENS, {
        access_token,
        refresh_token
      })

      getRouter().push('/')
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.response.data.errors.map(({ detail }) => ({
          text: detail,
          color: 'error'
        })),
        { root: true }
      )
    } finally {
      context.commit(Types.mutations.SET_LOGIN_FETCHING, false)
    }
  },

  /**
   * Загрузить информацию о пользователе
   * @param {*} context
   */
  async [Types.actions.GET_USER_INFO](context) {
    console.log('getUserInfo')
    try {
      context.commit(Types.mutations.SET_LOADING, true)

      const { user, student, groupId } = await userApi.getUserInfo()

      context.commit(Types.mutations.SET_USER, user)
      context.commit(Types.mutations.SET_STUDENT, student)
      context.dispatch(
        `${groupNamespace}/${groupTypes.actions.SET_GROUP_ID}`,
        groupId,
        { root: true }
      )

      context.commit(Types.mutations.SET_LOADING, false)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )

      getRouter().push('/log-off')
    }
  },

  /**
   * Обновить информацию о студенте
   * @param {Object} context
   * @param {Object} student_attributes
   */
  async [Types.actions.UPDATE_STUDENT](context, student_attributes) {
    try {
      context.commit(Types.mutations.SET_UPDATING, true)

      const { user, student } = await userApi.updateStudentInfo(
        student_attributes
      )

      context.commit(Types.mutations.SET_USER, user)
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

export const getters = {
  /**
   * Флаг что пользователь авторизован
   * TODO переработать
   * @type {Boolean}
   */
  [Types.getters.IS_AUTH]({ access_token, refresh_token }) {
    return Boolean(access_token && refresh_token)
  },

  /**
   * Флаг что пользователь админ
   * @type {Boolean}
   */
  [Types.getters.IS_ADMIN](state) {
    return state.userInfo.admin
  },

  /**
   * Флаг что пользователь староста
   * @type {Boolean}
   */
  [Types.getters.IS_PRESIDENT](state) {
    return state.studentInfo.president
  },

  /**
   * Флаг что пользователь подтвердил учётную запись
   * @type {Boolean}
   */
  [Types.getters.IS_CONFIRMED](state) {
    return state.userInfo.confirmed
  }
}
