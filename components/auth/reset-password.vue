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
          type="text"
          :rules="[$rules.required, $rules.email]"
          outlined
        />
      </v-form>
    </template>
    <template v-slot:actions>
      <div class="actions__wrapper">
        <button
          type="button"
          :style="colorStyle"
          class="actions__link"
          @click="$emit('setComponent', 'Login')"
        >
          {{ $t('auth.loginLink') }}
        </button>
        <v-btn
          v-if="!successMessage"
          color="primary"
          :disabled="unactive"
          class="login__btn"
          @click="resetPassword"
          >{{ $t('auth.resetPasswordBtn') }}</v-btn
        >
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import axios from '~/plugins/axios.ts'

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
   * Ссылка на компонент формы из vuetify
   */
  @Ref()
  readonly form: { validate: () => boolean }

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
   * Стили с цветом
   */
  get colorStyle(): { color: string } {
    const { theme }: { theme: any } = this.$vuetify
    return {
      color: theme.currentTheme.primary.base
    }
  }

  /**
   * Сбросить пароль
   */
  async resetPassword() {
    if (!this.form.validate()) return

    this.unactive = true

    try {
      const {
        data: { meta }
      } = await axios.post('users/password', { user: { login: this.login } })

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
