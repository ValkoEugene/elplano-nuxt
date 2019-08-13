// Информация о пользователе

import axios from 'axios'
import getRouter from '../plugins/getRouter'
import { setTokensInCookie, resetTokensInCookie } from '../utils/auth'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from './snackbars'

export const namespace = 'user'

export const Types = {
  mutations: {
    SET_LOGIN_FETCHING: 'SET_LOGIN_FETCHING',
    SET_USER: 'SET_USER',
    SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN',
    SET_REFRESH_TOKEN: 'SET_REFRESH_TOKEN'
  },
  actions: {
    SET_TOKENS: 'SET_TOKENS',
    RESET_USER: 'RESET_USER',
    LOGIN: 'LOGIN'
  },
  getters: {
    IS_AUTH: 'IS_AUTH',
    IS_ADMIN: 'IS_ADMIN',
    IS_CONFIRMED: 'IS_CONFIRMED'
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
   * Информация о пользователе
   * @type {Object}
   */
  userInfo: { ...userTemplate },

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

      // TODO Доделать информацию о юзере
      const mockUserInfo = {
        username: login,
        email: login
      }

      context.commit(Types.mutations.SET_USER, mockUserInfo)

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
   * Флаг что пользователь подтвердил учётную запись
   * @type {Boolean}
   */
  [Types.getters.IS_CONFIRMED](state) {
    return state.userInfo.confirmed
  }
}
