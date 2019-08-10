<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="user.login"
                  label="Логин"
                  placeholder="Логин"
                  type="text"
                  outlined
                  data-test="some-data-test"
                />

                <v-text-field
                  v-model="user.password"
                  label="Пароль"
                  placeholder="Пароль"
                  data-test="some-data-test"
                  type="password"
                  outlined
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- eslint-disable -->
              <v-btn color="primary" :disabled="fetching" @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'Login',
  layout: 'empty',
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
    },

    /**
     * Процесс обращения к api
     * @type {Boolean}
     */
    fetching: false
  }),
  methods: {
    ...mapMutations(['user/setUser']),

    ...mapActions(['user/setTokens']),

    /**
     * Вход
     * @type {Function}
     * @returns {Void}
     */
    async login() {
      this.fetching = true

      try {
        const data = { ...this.user, grant_type: 'password' }

        const response = await axios.post(
          `${process.env.baseUrl}/oauth/token`,
          data
        )
        const { access_token, refresh_token } = response.data

        // Доделать информацию о юзере
        const mockUserInfo = {
          username: this.user.login,
          email: this.user.login
        }

        this['user/setUser'](mockUserInfo)
        this['user/setTokens']({ access_token, refresh_token })

        this.$router.push('/')
      } catch (error) {
        // TODO Вывод ошибок
        console.error('AHTUNG', error.message)
      } finally {
        this.fetching = false
      }
    }
  }
}
</script>
