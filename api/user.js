import axios from '../plugins/axios'

const REST_URL = '/user'

/**
 * Форматирование данных от api
 * @param {Object} response
 * @returns {{User, Student, groupId: String}}
 */
function formatDataFromApi(response) {
  const id = response.data.data.id
  const user = response.data.data.attributes
  const student = response.data.included.find((item) => item.type === 'student')
  const group = student.relationships.group

  return {
    user: { ...user, id },
    student: student.attributes,
    groupId: group && group.data && group.data.id
  }
}

/**
 * Получить информацию о пользователе
 * @async
 * @type {Function}
 * @return {{ User, Student }}
 */
async function getUserInfo() {
  try {
    const response = await axios.get(REST_URL)

    return formatDataFromApi(response)
  } catch (error) {
    Promise.reject(error)
  }
}

/**
 * Обновить информацию о студенте
 * @async
 * @type {Function}
 * @param {Student} student_attributes
 * @return {{ User, Student }}
 */
async function updateStudentInfo(student_attributes) {
  try {
    const response = await axios.put(REST_URL, { student_attributes })

    return formatDataFromApi(response)
  } catch (error) {
    Promise.reject(error)
  }
}

export default { getUserInfo, updateStudentInfo }
