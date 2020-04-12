<template>
  <div class="login__wrapper">
    <div class="login__title">
      <client-only>
        <logo :width="logoWidth" :height="logoHeight" />
      </client-only>
    </div>

    <div class="login__content">
      <Login v-if="currentComponent === 'Login'" @setComponent="setComponent" />
      <Registration
        v-if="currentComponent === 'Registration'"
        @setComponent="setComponent"
      />
      <ResetPassword
        v-if="currentComponent === 'ResetPassword'"
        @setComponent="setComponent"
      />

      <social-networks
        v-if="
          currentComponent === 'Login' || currentComponent === 'Registration'
        "
        :title-i18n="socialNetworksTitleI18n"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { getBrowserLocale } from '~/utils/getBrowserLocale.ts'
import { getVuexDecaratorModuleByWindow } from '~/utils/getVuexDecaratorModuleByWindow.ts'
import { I18n, Locales } from '~/store/i18n.ts'
import SyncLogin from '~/mixins/SyncLogin.ts'

@Component({
  layout: 'empty',
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
      ? 'sigunWithBtn'
      : 'loginWith'
  }

  get logoWidth(): number {
    return this.$vuetify.breakpoint.mdAndDown ? 200 : 400
  }

  get logoHeight(): number {
    return this.$vuetify.breakpoint.mdAndDown ? 25 : 50
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
.login__content .v-card {
  width: 100%;
  padding: 15px 0;
}

.login__btn {
  min-width: 150px !important;
}

.login__title--registration p {
  margin: 0;
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

  .login__wrapper {
    min-width: 100vw;
    min-height: 100vh;
  }

  .login__title {
    position: static;
    width: auto;
    text-align: center;
    margin: 20px 0;
  }

  .login__title h1 {
    font-size: 26px;
    margin-bottom: 15px;
  }

  .login__content {
    width: 90%;
    margin: auto;
  }

  .login-card__title {
    font-size: 22px;
    margin-bottom: 15px;
  }
}

@media (min-width: 900px) {
  .login__wrapper {
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .v-application:not(.theme--dark) .login__wrapper {
    background: url(~assets/images/login-bg.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  .v-application.theme--dark .login__wrapper {
    background: url(~assets/images/login-bg-dark.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  .login__title {
    position: absolute;
    width: 500px;
    top: 50px;
    left: 50px;
  }

  .login__title h1 {
    font-size: 42px;
  }

  .login__title--registration {
    display: flex;
    align-items: center;
  }

  .login-card__title {
    font-size: 32px;
    margin-bottom: 25px;
    text-align: center;
  }

  .login__content {
    width: 500px;
    padding-left: 50px;
  }
}
</style>
