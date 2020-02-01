import ApiCRUD from './ApiCRUD'
import { Student } from '~/api/group-users'

export interface User {
  id: string
  admin: boolean
  avatar: string
  banned: boolean
  confirmed: boolean
  created_at: string
  email: string
  locale: string | null
  locked: boolean
  updated_at: string
  username: string
}

export interface UserInfo extends User {
  student: Student | null
}

const restUrl = 'admin/users'

const formatDataFromApi = ({
  id,
  attributes,
  student = {}
}: any): UserInfo => ({
  id,
  ...attributes,
  student: student.attributes
})
const formatDataForApi = (item: any): any => item

export const adminUserApi = new ApiCRUD<UserInfo>({
  restUrl,
  formatDataFromApi,
  formatDataForApi,
  includedTypes: ['student']
})
