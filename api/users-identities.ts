import axios from '~/plugins/axios.ts'

const restUrl = '/users/identities'

export enum IdentityProvider {
  google = 'google',
  vk = 'vk',
  yandex = 'yandex',
  facebook = 'facebook'
}

export interface Identity {
  code: string
  provider: IdentityProvider
  redirect_uri?: string
}

/**
 * Логин через сторонние сервисы
 */
export async function signInByProvider(identity: Identity): Promise<any> {
  try {
    const response = await axios.post(restUrl, { identity })
    return response.data
  } catch (error) {
    return Promise.reject(error)
  }
}
