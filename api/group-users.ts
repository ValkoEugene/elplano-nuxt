import axios from '~/plugins/axios.ts'

export interface SocialNetwork {
  network: string
  url: string
}

export interface Student {
  id: string
  locale: string | null
  about: string | null
  created_at: string
  email: string
  full_name: string | null
  phone: string | null
  president: boolean
  social_networks: SocialNetwork[]
  gender: 'male' | 'female'
  birthday: string
  avatar: string
  updated_at: string
}

const restUrl = '/classmates'

/**
 * Получить список участников группы
 */
export async function getGroupUsers(): Promise<Student[]> {
  try {
    const response = await axios.get(restUrl)

    return response.data.data.map(
      ({ id, attributes }: any): Student => ({
        id,
        ...attributes
      })
    )
  } catch (error) {
    return Promise.reject(error)
  }
}
