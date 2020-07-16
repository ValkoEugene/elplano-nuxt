import axios from '~/plugins/axios.ts'

const restUrl = '/group/invites'

export interface inviteI {
  email: string
}

export enum GroupInviteStatuses {
  accepted = 'accepted',
  pending = 'pending'
}

export interface GroupInviteI {
  email: string
  invitation_token: string
  sent_at: string
  accepted_at: null | string
  created_at: string
  updated_at: string
  status: GroupInviteStatuses
}

/**
 * Получить список отправленных приглашений
 */
export async function getInvites(): Promise<GroupInviteI[]> {
  try {
    const response = await axios.get(restUrl)

    return response.data.data.map(
      ({ attributes }: { attributes: GroupInviteI }) => attributes
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Отправить приглашение
 * @param invite - приглашение
 */
export async function sendInvite(invite: inviteI): Promise<void> {
  try {
    await axios.post(restUrl, { invite })
  } catch (error) {
    return Promise.reject(error)
  }
}
