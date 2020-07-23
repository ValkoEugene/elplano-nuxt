<template>
  <div class="login__wrapper">
    <Login v-if="currentComponent === 'Login'" @setComponent="setComponent" />

    <Registration
      v-if="currentComponent === 'Registration'"
      @setComponent="setComponent"
    />

    <ResetPassword
      v-if="currentComponent === 'ResetPassword'"
      @setComponent="setComponent"
    />

    <SocialNetworks
      v-if="currentComponent === 'Login' || currentComponent === 'Registration'"
      :title-i18n="socialNetworksTitleI18n"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { getBrowserLocale } from '~/utils/getBrowserLocale.ts'
import { getVuexDecaratorModuleByWindow } from '~/utils/getVuexDecaratorModuleByWindow.ts'
import { I18n, Locales } from '~/store/i18n.ts'
import SyncLogin from '~/mixins/SyncLogin.ts'

@Component({
  layout: 'emptyWithLogo',
  components: {
    Logo: () =>
      import('~/components/logo.vue' /* webpackChunkName: 'components/logo' */),
    SocialNetworks: () =>
      import(
        '~/components/auth/social-networks/social-networks.vue' /* webpackChunkName: 'components/auth/login' */
      ),
    Login: () =>
      import(
        '~/components/auth/login.vue' /* webpackChunkName: 'components/auth/login' */
      ),
    Registration: () =>
      import(
        '~/components/auth/registration.vue' /* webpackChunkName: 'components/auth/login' */
      ),
    ResetPassword: () =>
      import(
        '~/components/auth/reset-password.vue' /* webpackChunkName: 'components/auth/login' */
      )
  }
})
export default class LoginPage extends Mixins(SyncLogin) {
  /**
   * Показываемый компонент
   */
  currentComponent: string = 'Login'

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
   * Свойство для i18n заголовка логина через соц. сети
   */
  get socialNetworksTitleI18n(): string {
    return this.currentComponent === 'Registration'
      ? 'signUpWithBtn'
      : 'loginWith'
  }

  /**
   * Установить показываемый компонент
   */
  setComponent(componentName: string): void {
    this.currentComponent = componentName
  }

  /**
   * Инициализация локали
   */
  initLocale() {
    const locale = getBrowserLocale() as Locales
    getVuexDecaratorModuleByWindow(I18n).setLang(locale)
  }

  mounted() {
    this.initLocale()
  }
}
</script>

<style>
.login__wrapper .v-card {
  width: 100%;
  padding: 15px 0;
}

.login__btn {
  min-width: 150px !important;
}

.actions__wrapper {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

@media (max-width: 900px) {
  .actions__wrapper {
    flex-direction: column-reverse;
  }

  .actions__link {
    margin-top: 10px;
  }

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
