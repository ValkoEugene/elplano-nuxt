<template>
  <v-card>
    <v-card-text>
      <!-- eslint-disable -->
      <v-alert v-if="successMessage" type="success">{{ successMessage }}</v-alert>

      <v-form v-else>
        <v-text-field
          v-model="user.username"
          label="Логин"
          placeholder="Логин"
          type="text"
          outlined
        />

        <!-- eslint-disable -->
        <v-text-field v-model="user.email" label="Email" placeholder="Email" type="text" outlined />

        <v-text-field
          v-model="user.password"
          label="Пароль"
          placeholder="Пароль"
          type="password"
          outlined
        />

        <v-text-field
          v-model="user.password_confirmation"
          label="Подтверждение пароля"
          placeholder="Подтверждение пароля"
          type="password"
          outlined
        />
      </v-form>
    </v-card-text>
    <v-card-actions v-if="!successMessage">
      <v-spacer></v-spacer>
      <!-- eslint-disable -->
      <v-btn color="primary" :disabled="unactive" @click="createUser">Зарегистироваться</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
import {
  Types as snackbarsTypes,
  namespace as snackbarsNamespace
} from '../../store/snackbars'
import {
  Types as userTypes,
  namespace as userNamespace
} from '../../store/user'
import { setRegistrationInfo } from '../../utils/auth'

export default {
  name: 'Registration',
  data: () => ({
    /**
     * Информация о пользователе
     * @type {Object}
     */
    user: {
      username: '',
      email: '',
      password: '',
      password_confirmation: ''
    },

    /**
     * Сообщение при успешной регистрации
     * @type {String}
     */
    successMessage: '',

    /**
     * Флаг блокировки кнопки
     * @type {Boolean}
     */
    unactive: false
  }),
  methods: {
    ...mapMutations({
      /**
       * Сохранить пользователя
       */
      setUser: `${userNamespace}/${userTypes.mutations.SET_USER}`,

      /**
       * Показать сообщение
       */
      addSnackbars: `${snackbarsNamespace}/${snackbarsTypes.mutations.ADD_SNACKBARS}`
    }),

    /**
     * Создать пользователя
     * @async
     * @type {Function}
     * @returns {Void}
     */
    async createUser() {
      this.unactive = true

      const registrationInfo = {
        login: this.user,
        password: this.user.password
      }

      try {
        const {
          data: { attributes, meta }
        } = await axios({
          method: 'post',
          url: `${process.env.baseUrl}/api/v1/users`,
          data: { user: this.user },
          headers: {
            'Content-Type': 'application/vnd.api+json'
          }
        })
        setRegistrationInfo(registrationInfo)

        const user = attributes
        this.setUser(user)

        this.message = meta.message
      } catch (error) {
        this.addSnackbars(
          error.messages.map((text) => ({ text, color: 'error' }))
        )
      } finally {
        this.unactive = false
      }
    }
  }
}
</script>
