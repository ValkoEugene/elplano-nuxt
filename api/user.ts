import axios, { baseAxiosIntance } from '~/plugins/axios'
import { User } from '~/api/admin-user.ts'
import { Student } from '~/api/group-users.ts'

export interface UserDetail {
  user: User
  student?: Student
  groupId?: string
}

const REST_URL = '/user'

/**
 * Форматирование данных от api
 * @param {Object} response
 * @returns {{User, Student, groupId: String}}
 */
function formatDataFromApi(response: any): UserDetail {
  const id = response.data.data.id
  const user = response.data.data.attributes as User
  const student = response.data.included.find(
    (item: { type: string }) => item.type === 'student'
  )
  const group = student && student.relationships && student.relationships.group

  return {
    user: { ...user, id },
    student: student && student.attributes,
    groupId: group && group.data && group.data.id
  }
}

/**
 * Получить информацию о пользователе
 */
export async function getUserInfo(): Promise<UserDetail> {
  try {
    const response = await axios.get(REST_URL)

    return formatDataFromApi(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Обновить информацию о студенте
 * @param student_attributes - информация о студенте
 */
export async function updateStudentInfo(
  student_attributes: Student
): Promise<UserDetail> {
  try {
    const response = await axios.put(REST_URL, { student_attributes })

    return formatDataFromApi(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Подтвердить аккаунт
 * @param confirmation_token - токен
 */
export async function confirmAccount(
  confirmation_token: string
): Promise<void> {
  try {
    const params = { confirmation_token }
    await baseAxiosIntance.get('/users/confirmation', { params })
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function login() {}