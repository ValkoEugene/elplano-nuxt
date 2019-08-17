import axios from '../plugins/axios'

export const REST_URL = '/student'

/**
 * Получить информацию о студенте
 * @async
 * @type {Function}
 * @returns {Object}
 */
export async function getStudent() {
  try {
    const result = await axios.get(REST_URL)

    return result.data.data.attributes
  } catch (error) {
    Promise.reject(error)
  }
}

/**
 * Обновить информацию о студенте
 * @async
 * @type {Function}
 * @param {Object} student
 * @returns {Object}
 */
export async function updateStudent(student) {
  try {
    const result = await axios.put(REST_URL, { student })

    return result.data.data.attributes
  } catch (error) {
    Promise.reject(error)
  }
}
