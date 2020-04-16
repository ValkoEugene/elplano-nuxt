<template>
  <v-layout align-center justify-center fill-height>
    <v-alert v-if="!token" type="error"
      >Проблема с токеном, повторите попытку.</v-alert
    >

    <v-progress-circular v-else :size="100" color="primary" indeterminate />
  </v-layout>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { SnackbarColor } from '~/store/snackbars.ts'
import { getRegistrationInfo } from '~/utils/auth'
import { confirmAccount } from '~/api/user.ts'
import SyncLogin from '~/mixins/SyncLogin.ts'

@Component({ layout: 'empty' })
export default class ConfirmAccount extends Mixins(SyncLogin) {
  /**
   * Токен для подтверждения аккаунта
   */
  get token(): string | undefined {
    return this.$route.query.confirmation_token as string | undefined
  }

  mounted() {
    this.confirm()
  }

  /**
   * Подтвердить аккаунт
   * @async
   * @type {Function}
   * @returns {Void}
   */
  async confirm() {
    if (!this.token) return

    try {
      await confirmAccount(this.token)

      this.$vuexModules.Snackbars.ADD_SNACKBARS([
        { text: 'Аккаунт подтвержден', color: SnackbarColor.success }
      ])

      // Берем информацию из localStorage и если она была сразу логиним
      const registrationInfo = getRegistrationInfo()

      // Проверить наличие в localStorage пароль-логин если есть то логиним
      registrationInfo
        ? this.$vuexModules.User.login(registrationInfo)
        : this.$router.push('/login')
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(
        error.response.data.errors.map(({ detail }: { detail: string }) => ({
          text: detail,
          color: 'error'
        }))
      )

      this.$router.push('/login')
    }
  }
}
</script>
