import axios from 'axios'
import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { UserDetail, getUserInfo, updateStudentInfo } from '~/api/user.ts'
import { User as UserI } from '~/api/admin-user.ts'
import { Student } from '~/api/group-users.ts'
import getRouter from '~/plugins/getRouter'
import { setTokensInCookie, resetTokensInCookie } from '~/utils/auth'
// import {
//   namespace as snackbarNamespace,
//   Types as snackbarTypes
// } from '~/store/snackbars'
import { SnackbarsModule } from './snackbars'
import { GroupModule } from './group'
import store from '~/store'

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
} as UserI

@Module({ dynamic: true, store: store(), name: 'user' })
class User extends VuexModule implements UserStateI {
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
    about: '',
    created_at: '',
    email: '',
    full_name: '',
    phone: '',
    president: false,
    social_networks: {},
    updated_at: ''
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

  /**
   * Установить флаг процесса авторизации
   */
  @Mutation
  SET_LOGIN_FETCHING(value: boolean) {
    this.loginFetching = value
  }

  /**
   * Установить инцформацию о пользоавтеле
   */
  @Mutation
  SET_USER(userInfo: UserI) {
    this.userInfo = { ...this.userInfo, ...userInfo }
  }

  /**
   * Установить инцформацию о студенте
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
   * @param {ActionContext} context
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

      const response = await axios.post(
        `${process.env.baseUrl}/oauth/token`,
        data
      )
      const { access_token, refresh_token } = response.data

      this.setTokens({
        access_token,
        refresh_token
      })

      getRouter().push('/')
    } catch (error) {
      SnackbarsModule.ADD_SNACKBARS(
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
   * Загрузить информацию о пользователе
   * @param {ActionContext} context
   */
  @Action
  async getUserInfo() {
    console.log('getUserInfo')
    try {
      this.SET_LOADING(true)

      const { user, student, groupId } = await getUserInfo()

      this.SET_USER(user)
      if (student) this.SET_STUDENT(student)
      if (groupId) GroupModule.setGroupId(groupId)
      this.SET_LOADING(false)
    } catch (error) {
      SnackbarsModule.ADD_SNACKBARS(error.snackbarErrors)
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

      this.SET_USER(user)
      if (student) this.SET_STUDENT(student)
      this.SET_UPDATING(false)
    } catch (error) {
      SnackbarsModule.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}

export const UserModule = getModule(User)
