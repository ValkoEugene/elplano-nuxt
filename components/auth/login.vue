<template>
  <v-card>
    <v-card-text>
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
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        rounded
        :disabled="loginFetching"
        class="login__btn elevation-10"
        @click="$refs.form.validate() && login(user)"
        >{{ $t('auth.loginBtn') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { Types, namespace } from '../../store/user'

export default {
  name: 'Login',
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
