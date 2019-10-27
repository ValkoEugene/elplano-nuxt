// Информация о пользователе

import axios from 'axios'
import { VuexHelper } from '~/utils/VuexHelper'
import { ActionContext, Store } from 'vuex'
import { UserDetail, getUserInfo, updateStudentInfo } from '~/api/user.ts'
import { User } from '~/api/admin-user.ts'
import { Student } from '~/api/group-users.ts'
import getRouter from '~/plugins/getRouter'
import { setTokensInCookie, resetTokensInCookie } from '~/utils/auth'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from '~/store/snackbars'
import {
  namespace as groupNamespace,
  Types as groupTypes
} from '~/store/group.ts'

export const namespace = 'user'

export const Types = {
  mutations: {
    SET_LOGIN_FETCHING: 'SET_LOGIN_FETCHING',
    SET_USER: 'SET_USER',
    SET_STUDENT: 'SET_STUDENT',
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN',
    SET_REFRESH_TOKEN: 'SET_REFRESH_TOKEN',
    SET_SHOW_A2HS_BUTTON: 'SET_SHOW_A2HS_BUTTON'
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

export interface Login {
  login: string
  password: string
}

export interface Tokens {
  access_token: string
  refresh_token: string
}

export interface UserStateI {
  loginFetching: boolean
  loading: boolean
  updating: boolean
  userInfo: User
  studentInfo: Student
  access_token: string
  refresh_token: string
  showA2hsButton: boolean
}

const userTemplate = {
  id: '',
  email: '',
  username: '',
  admin: false,
  created_at: '',
  updated_at: '',
  avatar_url: '',
  confirmed: false,
  avatar: '',
  banned: false,
  locale: '',
  locked: false
} as User

export const state = (): UserStateI => ({
  /**
   * Флаг процесса авторизации
   */
  loginFetching: false,

  /**
   * Флаг загрузки
   */
  loading: true,

  /**
   * Флаг обновления
   */
  updating: false,

  /**
   * Информация о пользователе
   */
  userInfo: { ...userTemplate },

  /**
   * Информация о студенте
   */
  studentInfo: {
    id: '',
    about: '',
    created_at: '',
    email: '',
    full_name: '',
    phone: '',
    president: false,
    social_networks: {},
    updated_at: ''
  },

  /**
   * Токен
   */
  access_token: '',

  /**
   * Рефреш токен
   */
  refresh_token: '',

  /**
   * Флаг показа кнопки Добавить на главный экран
   */
  showA2hsButton: false
})

export const mutations = {
  /**
   * Установить флаг процесса авторизации
   */
  [Types.mutations.SET_LOGIN_FETCHING](state: UserStateI, value: boolean) {
    state.loginFetching = value
  },

  /**
   * Установить инцформацию о пользоавтеле
   */
  [Types.mutations.SET_USER](state: UserStateI, userInfo: User) {
    state.userInfo = { ...state.userInfo, ...userInfo }
  },

  /**
   * Установить инцформацию о студенте
   */
  [Types.mutations.SET_STUDENT](state: UserStateI, student: Student) {
    state.studentInfo = { ...state.studentInfo, ...student }
  },

  /**
   * Установить access_token
   */
  [Types.mutations.SET_ACCESS_TOKEN](state: UserStateI, access_token: string) {
    state.access_token = access_token
  },

  /**
   * Установить refresh_token
   */
  [Types.mutations.SET_REFRESH_TOKEN](
    state: UserStateI,
    refresh_token: string
  ) {
    state.refresh_token = refresh_token
  },

  /**
   * Установить флаг загрузки
   */
  [Types.mutations.SET_LOADING](state: UserStateI, loading: boolean) {
    state.loading = loading
  },

  /**
   * Установить флаг обновления
   */
  [Types.mutations.SET_UPDATING](state: UserStateI, updating: boolean) {
    state.updating = updating
  },

  /**
   * Установить флаг показа кнопки Добавить на главный экран
   */
  [Types.mutations.SET_SHOW_A2HS_BUTTON](state: UserStateI, value: boolean) {
    state.showA2hsButton = value
  }
}

export const actions = {
  /**
   * Установить токены
   * @param {ActionContext} context
   * @param {Tokens} tokens
   */
  [Types.actions.SET_TOKENS](
    { commit }: ActionContext<UserStateI, any>,
    tokens: Tokens
  ) {
    const { access_token, refresh_token } = tokens

    commit(Types.mutations.SET_ACCESS_TOKEN, access_token)
    commit(Types.mutations.SET_REFRESH_TOKEN, refresh_token)
    setTokensInCookie(tokens)
  },

  /**
   * Сбросить пользователя
   * @param {ActionContext} context
   */
  [Types.actions.RESET_USER]({ commit }: ActionContext<UserStateI, any>) {
    commit(Types.mutations.SET_ACCESS_TOKEN, '')
    commit(Types.mutations.SET_REFRESH_TOKEN, '')
    commit(Types.mutations.SET_USER, { ...userTemplate })
    commit(Types.mutations.SET_LOADING, true)
    resetTokensInCookie()
  },

  /**
   * Вход
   * @param {ActionContext} context
   * @param {Login} login
   */
  async [Types.actions.LOGIN](
    context: ActionContext<UserStateI, any>,
    { login, password }: Login
  ) {
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
        error.response.data.errors.map(({ detail }: { detail: string }) => ({
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
   * @param {ActionContext} context
   */
  async [Types.actions.GET_USER_INFO](context: ActionContext<UserStateI, any>) {
    console.log('getUserInfo')
    try {
      context.commit(Types.mutations.SET_LOADING, true)

      const { user, student, groupId } = await getUserInfo()

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
   * @param {ActionContext} context
   * @param {Student} student_attributes
   */
  async [Types.actions.UPDATE_STUDENT](
    context: ActionContext<UserStateI, any>,
    student_attributes: Student
  ) {
    try {
      context.commit(Types.mutations.SET_UPDATING, true)

      const { user, student } = await updateStudentInfo(student_attributes)

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
   */
  [Types.getters.IS_AUTH]({
    access_token,
    refresh_token
  }: UserStateI): boolean {
    return Boolean(access_token && refresh_token)
  },

  /**
   * Флаг что пользователь админ
   */
  [Types.getters.IS_ADMIN](state: UserStateI): boolean {
    return state.userInfo.admin
  },

  /**
   * Флаг что пользователь староста
   */
  [Types.getters.IS_PRESIDENT](state: UserStateI): boolean {
    return Boolean(state.studentInfo && state.studentInfo.president)
  },

  /**
   * Флаг что пользователь подтвердил учётную запись
   */
  [Types.getters.IS_CONFIRMED](state: UserStateI): boolean {
    return state.userInfo.confirmed
  }
}

/**
 * Класс для работы с модулем vuex - пользователь
 */
export class UserState extends VuexHelper<UserStateI> {
  constructor(store: any) {
    super(store, namespace)
  }

  /**
   * Флаг что пользователь админ
   */
  get isAdmin(): boolean {
    return this.store.getters[this.namespace][Types.getters.IS_ADMIN]
  }

  /**
   * Флаг что пользователь авторизован
   */
  get isAuth(): boolean {
    return this.store.getters[this.namespace][Types.getters.IS_AUTH]
  }

  /**
   * Флаг что пользователь подтвердил учётную запись
   */
  get isConfirmed(): boolean {
    return this.store.getters[this.namespace][Types.getters.IS_CONFIRMED]
  }

  /**
   * Флаг что пользователь староста
   */
  get isPresident(): boolean {
    return this.store.getters[this.namespace][Types.getters.IS_PRESIDENT]
  }

  /**
   * Установить токены
   */
  async setTokensAction(tokens: Tokens): Promise<void> {
    return await this.dispatchWithNamespace(Types.actions.SET_TOKENS, tokens)
  }

  /**
   * Сбросить пользователя
   */
  async resetUserAction(): Promise<void> {
    return await this.dispatchWithNamespace(Types.actions.RESET_USER)
  }

  /**
   * Вход
   * @param login
   */
  async loginAction(login: Login): Promise<void> {
    return await this.dispatchWithNamespace(Types.actions.LOGIN, login)
  }

  /**
   * Загрузить информацию о пользователе
   */
  async getUserInfoAction(): Promise<void> {
    return await this.dispatchWithNamespace(Types.actions.GET_USER_INFO)
  }

  /**
   * Обновить информацию о студенте
   * @param student
   */
  async updateStudentAction(student: Student) {
    return this.dispatchWithNamespace(Types.actions.UPDATE_STUDENT, student)
  }
}
