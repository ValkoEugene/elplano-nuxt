import { onMounted, ref } from '@vue/composition-api'

const ACCEPT_INVITE_TOKEN = 'ACCEPT_INVITE_TOKEN'

export const useAcceptInviteToken = () => {
  /** Токен для вступления в группу */
  const acceptToken = ref('')

  /** Инициализировать значение токена из localStorage */
  const initAcceptTokenByLocalStorage = () => {
    const token = window.localStorage.getItem(ACCEPT_INVITE_TOKEN) || ''

    acceptToken.value = token
  }

  /** Установить значение токена */
  const setAcceptInviteTokenInLocalStorage = (token: string) => {
    acceptToken.value = token
    window.localStorage.setItem(ACCEPT_INVITE_TOKEN, token)
  }

  /** Сбросить значение токена */
  const resetAcceptInviteTokenInLocalStorage = () => {
    acceptToken.value = ''
    window.localStorage.setItem(ACCEPT_INVITE_TOKEN, '')
  }

  onMounted(() => {
    initAcceptTokenByLocalStorage()
  })

  return {
    acceptToken,
    resetAcceptInviteTokenInLocalStorage,
    setAcceptInviteTokenInLocalStorage
  }
}
