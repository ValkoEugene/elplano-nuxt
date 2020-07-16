import baseAxios from 'axios'
import axios from '~/plugins/axios.ts'

export type AdminAbout = {
  app_title: string
  app_description: string
  app_short_description: string
  app_extended_description: string
  app_terms: string
  app_contact_email: string
  app_contact_username: string
  app_version: string
  app_revision: string
}

export type SystemHealth = {
  db_check: {
    status: string | null
    message: string | null
    labels: string | null
  }
  redis_check: {
    status: string | null
    message: string | null
    labels: string | null
  }
  cache_check: {
    status: string | null
    message: string | null
    labels: string | null
  }
  queues_check: {
    status: string | null
    message: string | null
    labels: string | null
  }
}

export type MemoryUsage = {
  active_bytes: number
  total_bytes: number
}

export type DisksUsage = {
  total_bytes: number
  active_bytes: number
  disk_name: string
  mount_path: string
}

/**
 * Загрузить информацию о приложении
 * @async
 * @type {Function}
 * @returns {Promise}
 */
export async function getAboutInfo(): Promise<AdminAbout> {
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
export async function updateSettings(
  admin_settings: AdminAbout
): Promise<void> {
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
export async function getSystemHealth(): Promise<SystemHealth> {
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
export async function getSystemInformation(): Promise<{
  cpu_cores: number
  memory_usage: MemoryUsage
  disks_usage: DisksUsage[]
}> {
  try {
    const response = await axios.get('/admin/system/information')

    return response && response.data && response.data.meta
  } catch (error) {
    return Promise.reject(error)
  }
}
