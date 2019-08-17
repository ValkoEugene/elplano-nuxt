<template>
  <v-card>
    <v-card-text>
      <!-- eslint-disable -->
      <v-alert v-if="successMessage" type="success">{{ successMessage }}</v-alert>

      <v-form v-else ref="form" :lazy-validation="true">
        <v-text-field
          v-model="user.username"
          :label="$t('field.loginField')"
          :placeholder="$t('field.loginField')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />

        <!-- eslint-disable -->
        <v-text-field
          v-model="user.email"
          label="Email"
          placeholder="Email"
          type="text"
          :rules="[$rules.required, $rules.email]"
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

        <v-text-field
          v-model="user.password_confirmation"
          :label="$t('field.confirmPasswordField')"
          :placeholder="$t('field.confirmPasswordField')"
          type="password"
          :rules="[$rules.required, $rules.equal(user.password, $t('field.confirmPasswordValidate'))]"
          outlined
        />
      </v-form>
    </v-card-text>
    <v-card-actions v-if="!successMessage">
      <v-spacer></v-spacer>
      <!-- eslint-disable -->
      <v-btn
        color="primary"
        :disabled="unactive"
        @click="$refs.form.validate() && createUser()"
      >{{ $t('auth.sigunBtn') }}</v-btn>
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
        const attributes = data.data.attributes
        const meta = data.meta

        setRegistrationInfo(registrationInfo)

        this.setUser(attributes)

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
