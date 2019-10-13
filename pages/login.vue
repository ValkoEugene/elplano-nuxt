<template>
  <div class="login__wrapper">
    <div class="login__title">
      <h1 :style="colorStyle">Welcom to ELplano</h1>
      <div
        v-if="
          currentComponent === 'Login' || currentComponent === 'ResetPassword'
        "
        class="login__title--registration"
      >
        <p>{{ $t('auth.signupText') }}</p>
        <button
          type="button"
          :style="colorStyle"
          class="ml-2"
          @click="setComponent('Registration')"
        >
          {{ $t('auth.sigunpLink') }}
        </button>
      </div>
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

      <button
        v-if="
          currentComponent === 'Registration' ||
            currentComponent === 'ResetPassword'
        "
        type="button"
        :style="colorStyle"
        class="mt-3"
        @click="setComponent('Login')"
      >
        {{ $t('auth.loginLink') }}
      </button>

      <button
        v-if="currentComponent === 'Login'"
        type="button"
        :style="colorStyle"
        class="mt-3"
        @click="setComponent('ResetPassword')"
      >
        {{ $t('auth.resetPasswordLink') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthPage',
  layout: 'empty',
  components: {
    Login: () =>
      import(
        '~/components/auth/login.vue' /* webpackChunkName: 'components/auth' */
      ),
    Registration: () =>
      import(
        '~/components/auth/registration.vue' /* webpackChunkName: 'components/auth/login' */
      ),
    ResetPassword: () =>
      import(
        '~/components/auth/reset-password.vue' /* webpackChunkName: 'components/auth/login' */
      )
  },
  data: () => ({
    /**
     * @type ('Login', 'Registration', 'ResetPassword')
     * Показываемый компонент
     */
    currentComponent: 'Login'
  }),
  computed: {
    colorStyle() {
      return {
        color: this.$vuetify.theme.currentTheme.primary.base
      }
    }
  },
  methods: {
    /**
     * Установить показываемый компонент
     * @type {String}
     */
    setComponent(componentName) {
      this.currentComponent = componentName
    }
  }
}
</script>

<style>
.login__content .v-card {
  width: 100%;
  padding: 15px 0;
}

.login__btn {
  width: 200px !important;
  margin-left: calc(50% - 100px);
}

.login__title--registration p {
  margin: 0;
}

/**/

@media (max-width: 900px) {
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
    background: url(~assets/images/login-bg.png);
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
