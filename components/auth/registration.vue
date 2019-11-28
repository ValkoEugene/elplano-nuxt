<template>
  <Card>
    <template v-slot:content>
      <h3 class="login-card__title">{{ $t('auth.sigunTitle') }}</h3>

      <v-alert v-if="successMessage" type="success">{{
        successMessage
      }}</v-alert>

      <v-form v-else ref="form" :lazy-validation="true">
        <v-text-field
          v-model.trim="user.username"
          :label="$t('field.loginField')"
          :placeholder="$t('field.loginField')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />

        <v-text-field
          v-model.trim="user.email"
          label="Email"
          placeholder="Email"
          type="text"
          :rules="[$rules.required, $rules.email]"
          outlined
        />

        <v-text-field
          v-model.trim="user.password"
          :label="$t('field.passwordField')"
          :placeholder="$t('field.passwordField')"
          type="password"
          :rules="[$rules.required, $rules.getMinLength(6)]"
          outlined
        />

        <v-text-field
          v-model.trim="user.password_confirmation"
          :label="$t('field.confirmPasswordField')"
          :placeholder="$t('field.confirmPasswordField')"
          type="password"
          :rules="[
            $rules.required,
            $rules.equal(user.password, $t('field.confirmPasswordValidate'))
          ]"
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
        @click="$refs.form.validate() && createUser()"
        >{{ $t('auth.sigunBtn') }}</v-btn
      >
    </template>
  </Card>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Vue } from 'vue-property-decorator'
import { setRegistrationInfo } from '~/utils/auth'

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
   * Создать пользователя
   */
  async createUser() {
    this.unactive = true

    const registrationInfo = {
      login: this.user.username,
      password: this.user.password
    }

    try {
      const { data } = await axios({
        method: 'post',
        url: `${process.env.baseUrl}/api/v1/users`,
        data: { user: this.user },
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      })
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
