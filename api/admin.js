import baseAxios from 'axios'
import axios from '../plugins/axios'

/**
 * Загрузить информацию о приложении
 * @async
 * @type {Function}
 * @returns {Promise}
 */
export async function getAboutInfo() {
  try {
    const response = await baseAxios.get('/', {
      baseURL: `${process.env.baseUrl}`,
      data: {},
      headers: {
        'Content-Type': 'application/vnd.api+json'
      }
    })

    return response.data.meta
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Обновить информацию о приложении
 * @async
 * @type {Function}
 * @param {Object} admin_settings
 * @returns {Promise}
 */
export async function updateSettings(admin_settings) {
  try {
    await axios.put('/admin/settings', { admin_settings })
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Получить информацию о работоспособности системы
 * @async
 * @type {Function}
 * @returns {Promise}
 */
export async function getSystemHealth() {
  try {
    const response = await axios.get('/admin/system/health/liveness')

    return response && response.data && response.data.meta
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Получить общую информацию о системы
 * @async
 * @type {Function}
 * @returns {Promise}
 */
export async function getSystemInformation() {
  try {
    const response = await axios.get('/admin/system/information')

    return response && response.data && response.data.meta
  } catch (error) {
    return Promise.reject(error)
  }
}
