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
        @click="$refs.form.validate() && login(user)"
        >{{ $t('auth.loginBtn') }}</v-btn
      >
    </template>
  </Card>
</template>

<script>
import { mapActions } from 'vuex'
import { Types, namespace } from '../../store/user'

export default {
  name: 'Login',
  components: {
    Card: () =>
      import(
        '../UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  data: () => ({
    /**
     * Информация о пользователе
     * @type {{
     *  login: String,
     *  password: String
     * }}
     */
    user: {
      login: '',
      password: ''
    }
  }),
  computed: {
    /**
     * Флаг процесса логина
     * @type {Boolean}
     */
    loginFetching() {
      return this.$store.state.user.loginFetching
    }
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Вход
       */
      login: Types.actions.LOGIN
    })
  }
}
</script>
