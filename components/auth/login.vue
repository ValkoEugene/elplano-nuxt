<template>
  <div>
    <Card>
      <template v-slot:content>
        <v-form ref="form" :lazy-validation="true">
          <v-text-field
            v-model.trim="user.login"
            :label="$t('field.loginField')"
            type="text"
            :rules="[$rules.required]"
            outlined
          />

          <div class="password-link__wrapper">
            <button
              type="button"
              :style="colorStyle"
              @click="$emit('setComponent', 'ResetPassword')"
            >
              {{ $t('auth.resetPasswordLink') }}
            </button>
          </div>

          <v-text-field
            v-model.trim="user.password"
            :label="$t('field.passwordField')"
            type="password"
            :rules="[$rules.required, $rules.getMinLength(6)]"
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
            @click="$emit('setComponent', 'Registration')"
          >
            {{ $t('auth.sigunpLink') }}
          </button>
          <v-btn
            color="primary"
            :disabled="loginFetching"
            class="login__btn"
            @click="login"
            >{{ $t('auth.loginBtn') }}</v-btn
          >
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

interface UserI {
  login: string
  password: string
}

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class Login extends Vue {
  /**
   * Ссылка на компонент формы из vuetify
   */
  @Ref()
  readonly form: { validate: () => boolean }

  /**
   * Информация о пользователе
   */
  user: UserI = {
    login: '',
    password: ''
  }

  /**
   * Флаг процесса логина
   */
  get loginFetching(): boolean {
    return this.$vuexModules.User.loginFetching
  }

  /**
   * Стили с цветом
   */
  get colorStyle(): { color: string } {
    const { theme }: { theme: any } = this.$vuetify
    return {
      color: theme.currentTheme.primary.base
    }
  }

  /**
   * Логин
   */
  login() {
    if (!this.form.validate()) return

    this.$vuexModules.User.login(this.user)
  }
}
</script>

<style scoped>
.password-link__wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
