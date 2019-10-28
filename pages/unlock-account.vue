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
import axios from 'axios'
import { SnackbarsModule, SnackbarColor } from '~/store/snackbars.ts'

@Component({
  layout: 'empty'
})
export default class ConfirmAccount extends Vue {
  /**
   * Токен для разбалировки аккаунта
   */
  get token(): string | undefined {
    return this.$route.query.unlock_token as string | undefined
  }

  mounted() {
    if (this.token) this.confirm()
  }

  /**
   * Подтвердить аккаунт
   */
  async confirm() {
    try {
      const params = { unlock_token: this.token }

      await axios({
        method: 'get',
        url: `${process.env.baseUrl}/api/v1/users/unlock`,
        params,
        data: {},
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      })

      SnackbarsModule.ADD_SNACKBARS([
        { text: 'Аккаунт разблокирован', color: SnackbarColor.success }
      ])
      this.$router.push('/login')
    } catch (error) {
      SnackbarsModule.ADD_SNACKBARS(
        error.response.data.errors.map(({ detail }: { detail: string }) => ({
          text: detail,
          color: SnackbarColor.error
        }))
      )

      this.$router.push('/login')
    }
  }
}
</script>
