// Работа с приглашениями пользователя

import axios from '~/plugins/axios'

const restUrl = '/invites'

/**
 * Получить свойство группы по id
 * @param {Array} groups - список групп
 * @prop {String} prop - название свойтства
 * @param {String} id - группы
 */
function getGroupPropById(groups, prop, id) {
  const group = groups.find((item) => item.id === id)
  return group ? group.attributes[prop] : '-'
}

/**
 * Получить список приглашений пользователя
 * @async
 * @type {Function}
 * @returns {Promise}
 */
async function getInvites() {
  try {
    const response = await axios.get(restUrl)

    const invites = response.data.data.map(({ attributes, relationships }) => ({
      ...attributes,
      group_id: relationships.group.data.id
    }))
    const groups = response.data.included.filter(
      (item) => item.type === 'group'
    )

    return invites.map((item) => ({
      ...item,
      group_title: getGroupPropById(groups, 'title', item.group_id),
      group_number: getGroupPropById(groups, 'number', item.group_id)
    }))
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Принять приглашение в группу
 * @async
 * @type {Function}
 * @param {String} token - токен активации
 * @returns {Promise}
 */
async function acceptInvite(token) {
  try {
    await axios.put(
      `${restUrl}/${token}`,
      {},
      { headers: { 'Content-Type': 'application/vnd.api+json' } }
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export default { getInvites, acceptInvite }
