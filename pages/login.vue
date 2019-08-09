<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-card-text>
              <v-form>
                <v-text-field v-model="user.login" label="Login" type="text" />

                <v-text-field
                  v-model="user.password"
                  label="Password"
                  data-test="some-data-test"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import axios from 'axios'
import {
  setRefreshToken,
  setToken,
  setUser as setUserToLocalStorage
} from '../plugins/token'

export default {
  data: () => ({
    user: {
      login: '',
      password: ''
    }
  }),
  methods: {
    async login() {
      try {
        const data = { ...this.user, grant_type: 'password' }

        const response = await axios.post(
          `${process.env.baseUrl}/oauth/token`,
          data
        )
        const { access_token, refresh_token } = response.data.data

        // Доделать информацию о юзере
        const mockUserInfo = {
          username: this.user.login,
          login: this.user.login
        }
        setUserToLocalStorage(mockUserInfo)
        setToken(access_token)
        setRefreshToken(refresh_token)
      } catch (error) {
        console.error('AHTUNG', error.message)
      }
    }
  }
}
</script>
