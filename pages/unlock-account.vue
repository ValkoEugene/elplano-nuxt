<template>
  <v-layout align-center justify-center fill-height>
    <!-- eslint-disable -->
    <v-alert v-if="!token" type="error">Проблема с токеном, повторите попытку.</v-alert>

    <v-progress-circular v-else :size="100" color="primary" indeterminate />
  </v-layout>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
import {
  Types as snackbarsTypes,
  namespace as snackbarsNamespace
} from '../store/snackbars'

export default {
  name: 'ConfirmAccount',
  layout: 'empty',
  computed: {
    /**
     * Токен для разбалировки аккаунта
     * @type {String}
     */
    token() {
      return this.$route.query.unlock_token
    }
  },
  mounted() {
    if (this.token) this.confirm()
  },
  methods: {
    ...mapMutations({
      /**
       * Показать сообщение
       */
      addSnackbars: `${snackbarsNamespace}/${snackbarsTypes.mutations.ADD_SNACKBARS}`
    }),

    /**
     * Подтвердить аккаунт
     * @async
     * @type {Function}
     * @returns {Void}
     */
    async confirm() {
      try {
        const params = { unlock_token: this.token }

        await axios({
          method: 'get',
          url: `${process.env.baseUrl}/api/v1/users/unlock`,
          params,
          data: {},
          headers: {
            'Content-Type': 'application/vnd.api+json'
          }
        })

        this.addSnackbars([{ text: 'Аккаунт разблокирован', color: 'success' }])
        this.$router.push('/login')
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
