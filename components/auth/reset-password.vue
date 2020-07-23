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
          type="text"
          :rules="[$rules.required, $rules.email]"
          outlined
        />
      </v-form>
    </template>
    <template v-slot:actions>
      <div class="actions__wrapper">
        <button
          type="button"
          :style="colorStyle"
          class="actions__link"
          @click="$emit('setComponent', 'Login')"
        >
          {{ $t('auth.loginLink') }}
        </button>
        <v-btn
          v-if="!successMessage"
          color="primary"
          :disabled="unactive"
          class="login__btn"
          @click="resetPassword"
          >{{ $t('auth.resetPasswordBtn') }}</v-btn
        >
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import axios from '~/plugins/axios.ts'
import { useSnackbars } from '~/compositions/useSnackbars.ts'

interface Form {
  validate: () => boolean
}

export default defineComponent({
  name: 'ResetPassword',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  setup(_, context) {
    /** Ссылка на компонент формы из vuetify */
    const form = ref<Form>(null)

    /** Логин для сброса */
    const login = ref('')

    /** Сообщение при успешном сбросе */
    const successMessage = ref('')

    /** Флаг блокировки кнопки */
    const unactive = ref(false)

    /** Стили с цветами */
    const colorStyle = computed(() => {
      const { theme }: { theme: any } = context.root.$vuetify

      return {
        color: theme.currentTheme.primary.base
      }
    })

    const { addErrorSnackbars } = useSnackbars(context)

    /** Сбросить пароль */
    const resetPassword = async () => {
      if (!form.value || !form.value.validate()) return

      unactive.value = true

      try {
        const {
          data: { meta }
        } = await axios.post('users/password', { user: { email: login.value } })

        successMessage.value = meta.message
      } catch (error) {
        const snackbars = error.response.data.errors.map(
          ({ detail }: { detail: string }) => ({
            text: detail,
            color: 'error'
          })
        )
        addErrorSnackbars(snackbars)
      } finally {
        unactive.value = false
      }
    }

    return {
      login,
      successMessage,
      unactive,
      colorStyle,
      resetPassword,
      form
    }
  }
})
</script>
