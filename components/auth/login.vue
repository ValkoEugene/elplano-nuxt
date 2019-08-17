<template>
  <v-card>
    <v-card-text>
      <v-form ref="form" :lazy-validation="true">
        <v-text-field
          v-model="user.login"
          :label="$t('field.loginField')"
          :placeholder="$t('field.loginField')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />

        <v-text-field
          v-model="user.password"
          :label="$t('field.passwordField')"
          :placeholder="$t('field.passwordField')"
          type="password"
          :rules="[$rules.required, $rules.getMinLength(6)]"
          outlined
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- eslint-disable -->
      <v-btn
        color="primary"
        :disabled="loginFetching"
        @click="$refs.form.validate() && login(user)"
      >{{ $t("auth.loginBtn") }}</v-btn>
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
