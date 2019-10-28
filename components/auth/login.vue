<template>
  <Card>
    <template v-slot:content>
      <h3 class="login-card__title">{{ $t('auth.loginTitle') }}</h3>

      <v-form ref="form" :lazy-validation="true">
        <v-text-field
          v-model.trim="user.login"
          :label="$t('field.loginField')"
          :placeholder="$t('field.loginField')"
          type="text"
          :rules="[$rules.required]"
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
      </v-form>
    </template>

    <template v-slot:actions>
      <v-btn
        color="primary"
        rounded
        :disabled="loginFetching"
        class="login__btn elevation-10"
        @click="$refs.form.validate() && UserModule.login(user)"
        >{{ $t('auth.loginBtn') }}</v-btn
      >
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '~/store/user.ts'

interface User {
  login: string
  password: string
}

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class Login extends Vue {
  /**
   * Информация о пользователе
   * @type {{
   *  login: String,
   *  password: String
   * }}
   */
  user: User = {
    login: '',
    password: ''
  }

  /**
   * Флаг процесса логина
   * @type {Boolean}
   */
  get loginFetching() {
    return UserModule.loginFetching
  }
}
</script>
