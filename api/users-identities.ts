import axios from '~/plugins/axios'

const restUrl = '/users/identities'

export enum IdentityProvider {
  google = 'google',
  vk = 'vk'
}

export interface Identity {
  code: string
  provider: IdentityProvider
  redirect_uri?: string
}

/**
 * Отправить приглашение
 * @param invite - приглашение
 */
export async function signInByProvider(identity: Identity): Promise<void> {
  try {
    const response = await axios.post(restUrl, { identity })
    console.log('response', response)
  } catch (error) {
    return Promise.reject(error)
  }
}
