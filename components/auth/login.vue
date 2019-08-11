<template>
  <v-card>
    <v-card-text>
      <v-form>
        <!-- eslint-disable -->
        <v-text-field v-model="user.login" label="Логин" placeholder="Логин" type="text" outlined />

        <v-text-field
          v-model="user.password"
          label="Пароль"
          placeholder="Пароль"
          type="password"
          outlined
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- eslint-disable -->
      <v-btn color="primary" :disabled="loginFetching" @click="login(user)">Войти</v-btn>
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
    loginFetching() {
      return this.$store.state.user.loginFetching
    }
  },
  methods: {
    ...mapActions({
      login: `${namespace}/${Types.actions.LOGIN}`
    })
  }
}
</script>
