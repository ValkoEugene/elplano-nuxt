<template>
  <v-layout align-center justify-center fill-height>
    <v-alert v-if="!token" type="error"
      >Проблема с токеном, повторите попытку.</v-alert
    >

    <v-progress-circular v-else :size="100" color="primary" indeterminate />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SnackbarsModule, SnackbarColor } from '~/store/snackbars.ts'
import { UserModule } from '~/store/user.ts'
import { getRegistrationInfo } from '~/utils/auth'
import { confirmAccount } from '~/api/user.ts'

@Component({ layout: 'empty' })
export default class ConfirmAccount extends Vue {
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

      SnackbarsModule.ADD_SNACKBARS([
        { text: 'Аккаунт подтвержден', color: SnackbarColor.success }
      ])

      // Берем информацию из localStorage и если она была сразу логиним
      const registrationInfo = getRegistrationInfo()

      // Проверить наличие в localStorage пароль-логин если есть то логиним
      registrationInfo
        ? UserModule.login(registrationInfo)
        : this.$router.push('/login')
    } catch (error) {
      SnackbarsModule.ADD_SNACKBARS(
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
