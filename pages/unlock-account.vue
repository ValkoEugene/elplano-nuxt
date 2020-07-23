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
import { SnackbarColor } from '~/store/snackbars.ts'
import axios from '~/plugins/axios.ts'

@Component({
  layout: 'emptyWithLogo'
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

      await axios.get('/users/unlock', { params })

      this.$vuexModules.Snackbars.ADD_SNACKBARS([
        { text: 'Аккаунт разблокирован', color: SnackbarColor.success }
      ])
      this.$router.push('/login')
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(
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
