// Работа с приглашениями пользователя

import axios from '~/plugins/axios.ts'
import { GroupI } from '~/api/group.ts'

const restUrl = '/invites'

export enum GroupInviteStatuses {
  accepted = 'accepted',
  pending = 'pending'
}

export interface GroupInviteI {
  id: string
  email: string
  invitation_token: string
  sent_at: string
  accepted_at: string | null
  created_at: string
  updated_at: string
  status: GroupInviteStatuses
  group_id: string
  group_title?: string
  group_number?: string
}

/**
 * Получить свойство группы по id
 * @param groups - список групп
 * @param prop - название свойтства
 * @param id - группы
 */
function getGroupPropById(
  groups: { id: string; attributes: GroupI }[],
  prop: 'title' | 'number',
  id: string
): string {
  const group = groups.find((item) => item.id === id)
  return group ? group.attributes[prop] : '-'
}

/**
 * Получить список приглашений пользователя
 */
export async function getInvites(): Promise<GroupInviteI[]> {
  try {
    const response = await axios.get(restUrl)

    const invites = response.data.data.map(
      ({ attributes, relationships }: any) => ({
        ...attributes,
        group_id: relationships.group.data.id
      })
    )
    const groups = response.data.included.filter(
      (item: { type: string }): boolean => item.type === 'group'
    )

    return invites.map((item: GroupInviteI) => ({
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
 * @param token - токен на приглашение
 */
export async function acceptInvite(token: string): Promise<void> {
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
