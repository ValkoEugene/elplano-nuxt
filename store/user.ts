import axios from 'axios'
import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators'
import { getUserInfo, updateStudentInfo } from '~/api/user.ts'
import { User as UserI } from '~/api/admin-user.ts'
import { Student } from '~/api/group-users.ts'
import getRouter from '~/plugins/getRouter.ts'
import {
  setTokensInCookie,
  resetTokensInCookie,
  setUseDarkThemeInCookie
} from '~/utils/auth'
import { Snackbars } from '~/store/snackbars.ts'
import { Group } from '~/store/group.ts'
import { getVuexDecaratorModuleByWindow } from '~/utils/getVuexDecaratorModuleByWindow.ts'
import { signInByProvider, Identity } from '~/api/users-identities.ts'
import { I18n } from '~/store/i18n.ts'

export const name = 'user'

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
  userInfo: UserI
  studentInfo: Student
  access_token: string
  refresh_token: string
  showA2hsButton: boolean
  useDarkTheme: boolean
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
  locale: null,
  locked: false
} as UserI

@Module({ namespaced: true, name })
export class User extends VuexModule implements UserStateI {
  /**
   * Флаг процесса авторизации
   */
  loginFetching: boolean = false

  /**
   * Флаг загрузки
   */
  loading: boolean = true

  /**
   * Флаг обновления
   */
  updating: boolean = false

  /**
   * Информация о пользователе
   */
  userInfo: UserI = { ...userTemplate }

  /**
   * Информация о студенте
   */
  studentInfo: Student = {
    id: '',
    locale: '',
    about: '',
    created_at: '',
    email: '',
    full_name: '',
    phone: '',
    president: false,
    social_networks: [],
    updated_at: '',
    avatar: '',
    birthday: '',
    gender: 'male'
  }

  /**
   * Токен
   */
  access_token: string = ''

  /**
   * Рефреш токен
   */
  refresh_token: string = ''

  /**
   * Флаг показа кнопки Добавить на главный экран
   */
  showA2hsButton: boolean = false

  /**
   * Флаг использования темной темы
   */
  useDarkTheme: boolean = false

  get isAuth(): boolean {
    return Boolean(this.access_token && this.refresh_token)
  }

  get isAdmin(): boolean {
    return this.userInfo.admin
  }

  get isPresident(): boolean {
    return Boolean(this.studentInfo && this.studentInfo.president)
  }

  get isConfirmed(): boolean {
    return this.userInfo.confirmed
  }

  get haveProfileInfo(): boolean {
    return (
      Boolean(this.studentInfo.full_name) && Boolean(this.studentInfo.birthday)
    )
  }

  /**
   * Установить флаг использования темной темы
   */
  @Mutation
  SET_USE_DARK_THEME(value: boolean) {
    if (value === this.useDarkTheme) return

    this.useDarkTheme = value
    setUseDarkThemeInCookie(value)
  }

  /**
   * Установить флаг процесса авторизации
   */
  @Mutation
  SET_LOGIN_FETCHING(value: boolean) {
    this.loginFetching = value
  }

  /**
   * Установить информацию о пользователе
   */
  @Mutation
  SET_USER(userInfo: UserI) {
    this.userInfo = { ...this.userInfo, ...userInfo }
  }

  /**
   * Установить информацию о студенте
   */
  @Mutation
  SET_STUDENT(student: Student) {
    this.studentInfo = { ...this.studentInfo, ...student }
  }

  /**
   * Установить access_token
   */
  @Mutation
  SET_ACCESS_TOKEN(access_token: string) {
    this.access_token = access_token
  }

  /**
   * Установить refresh_token
   */
  @Mutation
  SET_REFRESH_TOKEN(refresh_token: string) {
    this.refresh_token = refresh_token
  }

  /**
   * Установить флаг загрузки
   */
  @Mutation
  SET_LOADING(loading: boolean) {
    this.loading = loading
  }

  /**
   * Установить флаг обновления
   */
  @Mutation
  SET_UPDATING(updating: boolean) {
    this.updating = updating
  }

  /**
   * Установить флаг показа кнопки Добавить на главный экран
   */
  @Mutation
  SET_SHOW_A2HS_BUTTON(value: boolean) {
    this.showA2hsButton = value
  }

  /**
   * Установить токены
   * @param {Tokens} tokens
   */
  @Action
  setTokens(tokens: Tokens) {
    const { access_token, refresh_token } = tokens

    this.SET_ACCESS_TOKEN(access_token)
    this.SET_REFRESH_TOKEN(refresh_token)
    setTokensInCookie(tokens)
  }

  /**
   * Сбросить пользователя
   * @param {ActionContext} context
   */
  @Action
  resetUser() {
    this.SET_ACCESS_TOKEN('')
    this.SET_REFRESH_TOKEN('')
    this.SET_USER({ ...userTemplate })
    this.SET_LOADING(true)
    getVuexDecaratorModuleByWindow(Group).setGroupId('')
    resetTokensInCookie()
  }

  /**
   * Вход
   * @param {ActionContext} context
   * @param {Login} login
   */
  @Action
  async login({ login, password }: Login) {
    this.SET_LOGIN_FETCHING(true)

    try {
      const data = { login, password, grant_type: 'password' }
      const locale = getVuexDecaratorModuleByWindow(I18n).locale

      const response = await axios({
        method: 'POST',
        url: `${process.env.baseUrl}/oauth/token`,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept-Language': locale
        },
        data
      })
      const { access_token, refresh_token } = response.data

      this.setTokens({
        access_token,
        refresh_token
      })
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.response.data.errors.map(({ detail }: { detail: string }) => ({
          text: detail,
          color: 'error'
        }))
      )
    } finally {
      this.SET_LOGIN_FETCHING(false)
    }
  }

  /**
   * Войти через соц. сети
   * @param {Identity} identity
   */
  @Action
  async socialLogin(identity: Identity) {
    console.log('socialLogin')
    try {
      this.SET_LOADING(true)

      const { included } = await signInByProvider(identity)
      const tokens = included.find(
        (item: { type: string }) => item.type === 'access_token'
      )
      const { access_token, refresh_token } = tokens.attributes
      this.setTokens({
        access_token,
        refresh_token
      })

      getRouter().push('/schedule')
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_LOGIN_FETCHING(false)
    }
  }

  /**
   * Загрузить информацию о пользователе
   * @param {ActionContext} context
   */
  @Action
  async getUserInfo() {
    console.log('getUserInfo')
    try {
      this.SET_LOADING(true)

      const response = await getUserInfo()
      console.log(response)
      const { user, student, groupId } = response

      const locale = user.locale
      if (locale) getVuexDecaratorModuleByWindow(I18n).setLang(locale)

      this.SET_USER(user)
      if (student) this.SET_STUDENT(student)

      groupId
        ? getVuexDecaratorModuleByWindow(Group).setGroupId(groupId)
        : getRouter().push('/group/preinstall-settings')

      if (!this.haveProfileInfo) {
        getRouter().push('/group/preinstall-settings')
      }

      this.SET_LOADING(false)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
      getRouter().push('/log-off')
    }
  }

  /**
   * Обновить информацию о студенте
   * @param {Student} student_attributes
   */
  @Action
  async updateStudent(student_attributes: Student) {
    try {
      this.SET_UPDATING(true)

      const { user, student } = await updateStudentInfo(student_attributes)

      const locale = user.locale
      if (locale) getVuexDecaratorModuleByWindow(I18n).setLang(locale)

      this.SET_USER(user)
      if (student) this.SET_STUDENT(student)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_UPDATING(false)
    }
  }
}
