import axios from 'axios'
import { UserModule } from '~/store/user.ts'

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
 * Добавляем токены к каждому запросу
 * @param {import('axios').AxiosRequestConfig} config
 */
const addToken = (config) => {
  const token = window.$nuxt.$store.state.user.access_token

  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }

  return config
}

/**
 * Обновляем токен при 401 статусе
 * @param {import('axios').AxiosError} error
 */
const updateToken = (error) => {
  console.log('updateToken', error)
  const originalRequest = error.config

  if (error.response.status !== 401) {
    return Promise.reject(error)
  }

  // Проверяем статус и что это не повторный запрос
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    const data = {
      grant_type: 'refresh_token',
      refresh_token: window.$nuxt.$store.state.user.refresh_token
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
        window.$nuxt.$router.push('/log-off')
        console.error(`Не получилось получить token: ${error}`)
      })
  }
}

/**
 * Обработка ошибок
 * @param {AxiosError} error
 */
const handlingErrors = (error) => {
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
    error.messages = data.errors.map(({ detail }) => detail)
  } else if (status >= 500) {
    error.messages = ['Извините, возникла ошибка на сервере']
  }

  console.log('before axios reject', error.messages)
  error.snackbarErrors = error.messages.map((text) => ({
    text,
    color: 'error'
  }))
  return Promise.reject(error)
}

axiosInstance.interceptors.request.use(addToken)
axiosInstance.interceptors.response.use((response) => response, updateToken)
axiosInstance.interceptors.response.use((response) => response, handlingErrors)

baseAxiosIntance.interceptors.request.use(addToken)
baseAxiosIntance.interceptors.response.use((response) => response, updateToken)
baseAxiosIntance.interceptors.response.use(
  (response) => response,
  handlingErrors
)

export default axiosInstance

export { baseAxiosIntance }
