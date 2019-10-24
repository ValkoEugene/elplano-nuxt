import ApiCRUD from './ApiCRUD'

export interface User {
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

export interface Student {
  about: string | null
  created_at: string
  email: string
  full_name: string | null
  phone: string | null
  president: boolean
  social_networks: { [key: string]: string }
  updated_at: string
}

export interface UserInfo extends User {
  id: string
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
