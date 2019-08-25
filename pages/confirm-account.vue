<template>
  <v-layout align-center justify-center fill-height>
    <v-alert v-if="!token" type="error"
      >Проблема с токеном, повторите попытку.</v-alert
    >

    <v-progress-circular v-else :size="100" color="primary" indeterminate />
  </v-layout>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapActions } from 'vuex'
import {
  Types as snackbarsTypes,
  namespace as snackbarsNamespace
} from '../store/snackbars'
import { Types as userTypes, namespace as userNamespace } from '../store/user'
import { getRegistrationInfo } from '../utils/auth'

export default {
  name: 'ConfirmAccount',
  layout: 'empty',
  computed: {
    /**
     * Токен для подтверждения аккаунта
     * @type {String}
     */
    token() {
      return this.$route.query.confirmation_token
    }
  },
  mounted() {
    if (this.token) this.confirm()
  },
  methods: {
    ...mapMutations(snackbarsNamespace, {
      /**
       * Показать сообщение
       */
      addSnackbars: snackbarsTypes.mutations.ADD_SNACKBARS
    }),

    ...mapActions(userNamespace, {
      /**
       * Войти
       */
      login: userTypes.actions.LOGIN
    }),

    /**
     * Подтвердить аккаунт
     * @async
     * @type {Function}
     * @returns {Void}
     */
    async confirm() {
      try {
        const params = { confirmation_token: this.token }

        await axios({
          method: 'get',
          url: `${process.env.baseUrl}/api/v1/users/confirmation`,
          params,
          data: {},
          headers: {
            'Content-Type': 'application/vnd.api+json'
          }
        })

        this.addSnackbars([{ text: 'Аккаунт подтвержден', color: 'success' }])

        // Берем информацию из localStorage и если она была сразу логиним
        const registrationInfo = getRegistrationInfo()

        // Проверить наличие в localStorage пароль-логин если есть то логиним
        registrationInfo
          ? this.login(registrationInfo)
          : this.$router.push('/login')
      } catch (error) {
        this.addSnackbars(
          error.response.data.errors.map(({ detail }) => ({
            text: detail,
            color: 'error'
          }))
        )

        this.$router.push('/login')
      }
    }
  }
}
</script>
