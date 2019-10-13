import axios from '~/plugins/axios'

const restUrl = '/classmates'

/**
 * Получить список участников группы
 * @async
 * @type {Function}
 * @returns {Promise}
 */
async function getGroupUsers() {
  try {
    const response = await axios.get(restUrl)

    const students = response.data.data.map(({ id, attributes }) => ({
      id,
      ...attributes
    }))

    return students
  } catch (error) {
    return Promise.reject(error)
  }
}

export default { getGroupUsers }
