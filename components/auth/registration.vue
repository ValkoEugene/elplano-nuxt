<template>
  <Card>
    <template v-slot:content>
      <h3 class="login-card__title">{{ $t('auth.sigunTitle') }}</h3>

      <v-alert v-if="successMessage" type="success">{{
        successMessage
      }}</v-alert>

      <v-form v-else ref="form" :lazy-validation="true">
        <v-text-field
          v-model.trim="user.username"
          :label="$t('field.loginField')"
          :placeholder="$t('field.loginField')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />

        <v-text-field
          v-model.trim="user.email"
          label="Email"
          placeholder="Email"
          type="text"
          :rules="[$rules.required, $rules.email]"
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

        <v-text-field
          v-model.trim="user.password_confirmation"
          :label="$t('field.confirmPasswordField')"
          :placeholder="$t('field.confirmPasswordField')"
          type="password"
          :rules="[
            $rules.required,
            $rules.equal(user.password, $t('field.confirmPasswordValidate'))
          ]"
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
        @click="$refs.form.validate() && createUser()"
        >{{ $t('auth.sigunBtn') }}</v-btn
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
} from '../../store/snackbars'
import {
  Types as userTypes,
  namespace as userNamespace
} from '../../store/user'
import { setRegistrationInfo } from '../../utils/auth'

export default {
  name: 'Registration',
  components: {
    Card: () =>
      import(
        '../UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
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
    ...mapMutations(userNamespace, {
      /**
       * Сохранить пользователя
       */
      setUser: userTypes.mutations.SET_USER
    }),

    ...mapMutations(snackbarsNamespace, {
      /**
       * Показать сообщение
       */
      addSnackbars: snackbarsTypes.mutations.ADD_SNACKBARS
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
        login: this.user.username,
        password: this.user.password
      }

      try {
        const { data } = await axios({
          method: 'post',
          url: `${process.env.baseUrl}/api/v1/users`,
          data: { user: this.user },
          headers: {
            'Content-Type': 'application/vnd.api+json'
          }
        })
        const meta = data.meta

        setRegistrationInfo(registrationInfo)

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
