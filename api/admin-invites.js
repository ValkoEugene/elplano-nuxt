import axios from '../plugins/axios'

const restUrl = '/group/invites'

/**
 * Получить список отправленных приглашений
 * @async
 * @type {Function}
 * @returns {Promise}
 */
async function getInvites() {
  try {
    const response = await axios.get(restUrl)

    const invites = response.data.data.map(({ attributes }) => attributes)

    return invites
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Отправить приглашение
 * @async
 * @type {Function}
 * @param {Object} invite
 * @returns {Promise}
 */
async function sendInvite(invite) {
  try {
    await axios.post(restUrl, { invite })
  } catch (error) {
    return Promise.reject(error)
  }
}

export default { getInvites, sendInvite }
