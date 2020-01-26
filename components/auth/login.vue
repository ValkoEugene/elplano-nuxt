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
        @click="$refs.form.validate() && login()"
        >{{ $t('auth.loginBtn') }}</v-btn
      >
    </template>

    <template v-slot:footer>
      <social-networks />
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

interface UserI {
  login: string
  password: string
}

@Component({
  components: {
    SocialNetworks: () =>
      import(
        '~/components/auth/social-networks.vue' /* webpackChunkName: 'components/auth/login' */
      ),
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class Login extends Vue {
  /**
   * Информация о пользователе
   */
  user: UserI = {
    login: '',
    password: ''
  }

  /**
   * Флаг процесса логина
   */
  get loginFetching(): boolean {
    return this.$vuexModules.User.loginFetching
  }

  /**
   * Логин
   */
  login() {
    this.$vuexModules.User.login(this.user)
  }
}
</script>
