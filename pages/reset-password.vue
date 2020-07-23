<template>
  <Card>
    <template v-slot:content>
      <h3 class="login-card__title">{{ $t('auth.createNewPassword') }}</h3>

      <v-alert v-if="!token" type="error">
        {{ $t('auth.invalidToken') }}
      </v-alert>

      <v-form v-else ref="form" :lazy-validation="true">
        <v-text-field
          v-model.trim="password"
          :label="$t('field.passwordField')"
          type="password"
          :rules="[$rules.required, $rules.getMinLength(6)]"
          outlined
        />

        <v-text-field
          v-model.trim="confirmPassword"
          :label="$t('field.confirmPasswordField')"
          type="password"
          :rules="[
            $rules.required,
            $rules.equal(password, $t('field.confirmPasswordValidate'))
          ]"
          outlined
        />
      </v-form>
    </template>

    <template v-slot:actions>
      <div v-if="token">
        <v-btn
          color="primary"
          :disabled="unactive"
          class="mr-3"
          @click="createNewPassword"
        >
          {{ $t('actions.create') }}
        </v-btn>

        <v-btn :disabled="unactive" link to="/login">
          {{ $t('auth.loginBtn') }}
        </v-btn>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'
import { createNewPassword as createNewPasswordApi } from '~/api/user.ts'
import { useSnackbars } from '~/compositions/useSnackbars.ts'

interface Form {
  validate: () => boolean
}

export default defineComponent({
  layout: 'empty',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  setup(_, context) {
    /** Ссылка на компонент формы из vuetify */
    const form = ref<Form>(null)

    /** Токен для сброса пароля */
    const token = computed(
      () => context.root.$route.query.reset_password_token || ''
    )

    /** Новый пароль */
    const password = ref('')

    /** Подтверждение нового пароля */
    const confirmPassword = ref('')

    /** Флаг блокировки формы */
    const unactive = ref(false)

    const { addErrorSnackbars } = useSnackbars(context)

    /** Создать новый пароль */
    const createNewPassword = async () => {
      if (!form.value || !form.value.validate()) return

      try {
        unactive.value = true
        await createNewPasswordApi({
          password: password.value,
          password_confirmation: confirmPassword.value,
          reset_password_token: token.value as string
        })
        context.root.$router.push('/login')
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
      token,
      password,
      confirmPassword,
      createNewPassword,
      unactive,
      form
    }
  }
})
</script>

<style scoped>
@media (max-width: 900px) {
  .login-card__title {
    font-size: 22px;
    margin-bottom: 15px;
  }
}

@media (min-width: 900px) {
  .login-card__title {
    font-size: 32px;
    margin-bottom: 25px;
    text-align: center;
  }
}
</style>
