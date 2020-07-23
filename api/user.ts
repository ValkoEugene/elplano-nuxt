import axios from '~/plugins/axios.ts'
import { User } from '~/api/admin-user.ts'
import { Student } from '~/api/group-users.ts'

export interface UserDetail {
  user: User
  student?: Student
  groupId?: string
}

export interface NewPasswordI {
  password: string
  password_confirmation: string
  reset_password_token: string
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
  if (student && student.attributes) {
    student.attributes.locale = user.locale
    student.attributes.id = student.id
  }
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
    const user = {
      locale: student_attributes.locale,
      student_attributes
    }
    const response = await axios.put(REST_URL, { user })

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
    await axios.get('/users/confirmation', { params })
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Создать новый пароль
 */
export async function createNewPassword(data: NewPasswordI) {
  try {
    await axios.patch('/users/password', { user: data })
  } catch (error) {
    return Promise.reject(error)
  }
}
