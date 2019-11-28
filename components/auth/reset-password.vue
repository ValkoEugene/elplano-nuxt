<template>
  <Card>
    <template v-slot:content>
      <h3 class="login-card__title">{{ $t('auth.resetPasswordTitle') }}</h3>

      <v-alert v-if="successMessage" type="success">{{
        successMessage
      }}</v-alert>

      <v-form v-else ref="form" :lazy-validation="true">
        <v-text-field
          v-model.trim="login"
          label="Email"
          placeholder="Email"
          type="text"
          :rules="[$rules.required, $rules.email]"
          outlined
        />
      </v-form>
    </template>
    <template v-if="!successMessage" v-slot:actions>
      <v-btn
        color="primary"
        rounded
        :disabled="unactive"
        class="login__btn elevation-10"
        @click="$refs.form.validate() && resetPassword()"
        >{{ $t('auth.resetPasswordBtn') }}</v-btn
      >
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class ResetPassword extends Vue {
  /**
   * Логин для сброса
   */
  login: string = ''

  /**
   * Сообщение при успешном сбросе
   */
  successMessage: string = ''

  /**
   * Флаг блокировки кнопки
   */
  unactive: boolean = false

  /**
   * Сбросить пароль
   */
  async resetPassword() {
    this.unactive = true

    try {
      const {
        data: { meta }
      } = await axios({
        method: 'post',
        url: `${process.env.baseUrl}/api/v1/users/password`,
        data: { user: { login: this.login } },
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      })

      this.successMessage = meta.message
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(
        error.response.data.errors.map(({ detail }: { detail: string }) => ({
          text: detail,
          color: 'error'
        }))
      )
    } finally {
      this.unactive = false
    }
  }
}
</script>
