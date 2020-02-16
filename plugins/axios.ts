import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { User } from '~/store/user.ts'
import { getVuexDecaratorModuleByWindow } from '~/utils/getVuexDecaratorModuleByWindow.ts'
import { SnackbarI, SnackbarColor } from '~/store/snackbars.ts'
import { I18n } from '~/store/i18n.ts'
import getRouter from '~/plugins/getRouter.ts'
import {
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie
} from '~/utils/auth.js'

interface CustomAxiosRequestConfig {
  _retry?: boolean
}

interface CustomError {
  messages: string[]
  snackbarErrors: SnackbarI[]
}

const axiosInstance = axios.create({
  baseURL: `${process.env.baseUrl}/api/v1`,
  data: {},
  headers: {
    'Content-Type': 'application/vnd.api+json'
  }
})

const baseAxiosIntance = axios.create({
  baseURL: `${process.env.baseUrl}`,
  data: {},
  headers: {
    'Content-Type': 'application/vnd.api+json'
  }
})

/**
 * Добавляем необходимые заголовки к каждому запросу
 */
const addHeaders = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const token = getAccessTokenFromCookie(null)

  const locale = getVuexDecaratorModuleByWindow(I18n).locale

  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }
  config.headers.common['Accept-Language'] = locale

  return config
}

/**
 * Обновляем токен при 401 статусе
 */
const updateToken = (error: AxiosError) => {
  if (!error.response) return

  console.log('updateToken', error)
  const originalRequest: CustomAxiosRequestConfig & AxiosRequestConfig =
    error.config

  if (error.response.status !== 401) {
    return Promise.reject(error)
  }

  // Проверяем статус и что это не повторный запрос
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const UserModule = getVuexDecaratorModuleByWindow(User)

    const data = {
      grant_type: 'refresh_token',
      refresh_token: getRefreshTokenFromCookie(null)
    }

    return axios
      .post(`${process.env.baseUrl}/oauth/token`, data)
      .then((response) => response.data)
      .then((data) => {
        const { access_token, refresh_token } = data

        UserModule.setTokens({ access_token, refresh_token })

        // Обновляем заголовки для повторного запроса
        axios.defaults.headers.common.Authorization = `Bearer ${access_token}`
        originalRequest.headers.Authorization = `Bearer ${access_token}`

        return axios(originalRequest)
      })
      .catch((error) => {
        getRouter().push('/log-off')
        console.error(`Не получилось получить token: ${error}`)
      })
  }
}

/**
 * Обработка ошибок
 */
const handlingErrors = (error: AxiosError & CustomError) => {
  console.log('axios errorHandker', error)
  // Обрабатываем ошибки сети
  // в них нет ответа и соответственно status, data что нужны
  if (!error.response) {
    console.log('Network error')
    return Promise.reject(new Error('Network error'))
  }

  // Получаем статус ошибки и данные
  const { status, data } = error.response

  if (status === 401) {
    return // Отдельно обрабатываем в updateToken
  } else if (status === 404) {
    error.messages = ['Запись не найдена']
  } else if (status >= 400 && status < 500 && data.errors) {
    error.messages = data.errors.map(({ detail }: { detail: string }) => detail)
  } else if (status >= 500) {
    error.messages = ['Извините, возникла ошибка на сервере']
  }

  console.log('before axios reject', error.messages)
  error.snackbarErrors = error.messages.map((text) => ({
    text,
    color: SnackbarColor.error
  }))
  return Promise.reject(error)
}

axiosInstance.interceptors.request.use(addHeaders)
axiosInstance.interceptors.response.use((response) => response, updateToken)
axiosInstance.interceptors.response.use((response) => response, handlingErrors)

baseAxiosIntance.interceptors.request.use(addHeaders)
baseAxiosIntance.interceptors.response.use((response) => response, updateToken)
baseAxiosIntance.interceptors.response.use(
  (response) => response,
  handlingErrors
)

export default axiosInstance

export { baseAxiosIntance }
