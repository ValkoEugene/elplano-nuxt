<template>
  <v-layout align-center justify-center fill-height>
    <v-alert v-if="!token" type="error"
      >Проблема с токеном, повторите попытку.</v-alert
    >

    <v-progress-circular v-else :size="100" color="primary" indeterminate />
  </v-layout>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import {
  Types as snackbarsTypes,
  namespace as snackbarsNamespace
} from '~/store/snackbars'
import { Types as userTypes, namespace as userNamespace } from '~/store/user.ts'
import { getRegistrationInfo } from '~/utils/auth'
import { confirmAccount } from '~/api/user.ts'

export const a = {
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
        await confirmAccount(this.token)

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
