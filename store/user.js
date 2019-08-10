import { setTokensInCookie } from '../utils/auth'

export const state = () => ({
  /**
   * Информация о пользователе
   * @type {Object}
   */
  userInfo: {
    email: '',
    username: '',
    admin: false,
    created_at: '',
    updated_at: '',
    avatar_url: '',
    confirmed: false
  },

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
   * Установить инцформацию о пользоавтеле
   * @param {Object} state
   * @param {Object} userInfo
   */
  setUser(state, userInfo) {
    state.userInfo = { ...state.userInfo, ...userInfo }
  },

  /**
   * Установить access_token
   * @param {Object} state
   * @param {String} access_token
   */
  setAccessToken(state, access_token) {
    state.access_token = access_token
  },

  /**
   * Установить refresh_token
   * @param {Object} state
   * @param {String} refresh_token
   */
  setRefreshToken(state, refresh_token) {
    state.refresh_token = refresh_token
  }
}

export const actions = {
  /**
   * Установить токены
   * @param {{ commit: Function }}
   * @param {{ access_token: String, refresh_token: String }} tokens
   */
  setTokens({ commit }, tokens) {
    const { access_token, refresh_token } = tokens

    commit('setAccessToken', access_token)
    commit('setRefreshToken', refresh_token)
    setTokensInCookie(tokens)
  }
}

export const getters = {
  /**
   * Флаг что пользователь авторизован
   * TODO переработать
   * @type {Boolean}
   */
  isAuth({ userInfo, access_token, refresh_token }) {
    return Boolean(access_token && refresh_token)
  },

  /**
   * Флаг что пользователь админ
   * @type {Boolean}
   */
  isAdmin(state) {
    return state.userInfo.admin
  },

  /**
   * Флаг что пользователь подтвердил учётную запись
   * @type {Boolean}
   */
  isConfirmed(state) {
    return state.userInfo.confirmed
  }
}
