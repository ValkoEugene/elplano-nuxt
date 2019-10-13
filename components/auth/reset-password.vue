<template>
  <Card>
    <template v-slot:content>
      <h3 class="login-card__title">{{ $t('auth.resetPasswordTitle') }}</h3>

      <v-alert v-if="successMessage" type="success">{{
        successMessage
      }}</v-alert>

      <v-form v-else ref="form" :lazy-validation="true">
        <v-text-field
          v-model.trim="login"
          label="Email"
          placeholder="Email"
          type="text"
          :rules="[$rules.required, $rules.email]"
          outlined
        />
      </v-form>
    </template>
    <template v-if="!successMessage" v-slot:actions>
      <v-btn
        color="primary"
        rounded
        :disabled="unactive"
        class="login__btn elevation-10"
        @click="$refs.form.validate() && resetPassword()"
        >{{ $t('auth.resetPasswordBtn') }}</v-btn
      >
    </template>
  </Card>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
import {
  Types as snackbarsTypes,
  namespace as snackbarsNamespace
} from '~/store/snackbars'

export default {
  name: 'ResetPassword',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  data: () => ({
    /**
     * Логин для сброса
     * @type {String}
     */
    login: '',

    /**
     * Сообщение при успешном сбросе
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
    ...mapMutations(snackbarsNamespace, {
      /**
       * Показать сообщение
       */
      addSnackbars: snackbarsTypes.mutations.ADD_SNACKBARS
    }),

    /**
     * Сбросить пароль
     * @async
     * @type {Function}
     * @returns {Void}
     */
    async resetPassword() {
      this.unactive = true

      try {
        const {
          data: { meta }
        } = await axios({
          method: 'post',
          url: `${process.env.baseUrl}/api/v1/users/password`,
          data: { user: { login: this.login } },
          headers: {
            'Content-Type': 'application/vnd.api+json'
          }
        })

        this.successMessage = meta.message
      } catch (error) {
        this.addSnackbars(
          error.response.data.errors.map(({ detail }) => ({
            text: detail,
            color: 'error'
          }))
        )
      } finally {
        this.unactive = false
      }
    }
  }
}
</script>
