<template>
  <Card>
    <template v-slot:content>
      <h3 class="login-card__title">{{ $t('auth.signUpTitle') }}</h3>

      <v-alert v-if="successMessage" type="success">{{
        successMessage
      }}</v-alert>

      <v-form v-else ref="form" :lazy-validation="true">
        <v-text-field
          v-model.trim="user.username"
          :label="$t('field.loginField')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />

        <v-text-field
          v-model.trim="user.email"
          label="Email"
          type="text"
          :rules="[$rules.required, $rules.email]"
          outlined
        />

        <v-text-field
          v-model.trim="user.password"
          :label="$t('field.passwordField')"
          type="password"
          :rules="[$rules.required, $rules.getMinLength(6)]"
          outlined
        />

        <v-text-field
          v-model.trim="user.password_confirmation"
          :label="$t('field.confirmPasswordField')"
          type="password"
          :rules="[
            $rules.required,
            $rules.equal(user.password, $t('field.confirmPasswordValidate'))
          ]"
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
          @click="createUser"
          >{{ $t('auth.signUpBtn') }}</v-btn
        >
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { setRegistrationInfo } from '~/utils/auth'
import axios from '~/plugins/axios.ts'

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class Registration extends Vue {
  /**
   * Ссылка на компонент формы из vuetify
   */
  @Ref()
  readonly form: { validate: () => boolean }

  /**
   * Информация о пользователе
   */
  user = {
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  }

  /**
   * Сообщение при успешной регистрации
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
   * Создать пользователя
   */
  async createUser() {
    if (!this.form.validate()) return

    this.unactive = true

    const registrationInfo = {
      login: this.user.username,
      password: this.user.password
    }

    try {
      const { data } = await axios.post('/users', { user: this.user })
      const meta = data.meta

      setRegistrationInfo(registrationInfo)

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
