<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 class="elevation-12">
          <v-tabs v-model="tab" right grow show-arrows>
            <v-tab>{{ $t('auth.loginTab') }}</v-tab>
            <v-tab>{{ $t('auth.sigunpTab') }}</v-tab>
            <v-tab>{{ $t('auth.resetPasswordTab') }}</v-tab>

            <v-tab-item>
              <Login />
            </v-tab-item>

            <v-tab-item>
              <Registration />
            </v-tab-item>

            <v-tab-item>
              <ResetPassword />
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'AuthPage',
  layout: 'empty',
  components: {
    Login: () =>
      import(
        '../components/auth/login.vue' /* webpackChunkName: 'components/auth' */
      ),
    Registration: () =>
      import(
        '../components/auth/registration.vue' /* webpackChunkName: 'components/auth/login' */
      ),
    ResetPassword: () =>
      import(
        '../components/auth/reset-password.vue' /* webpackChunkName: 'components/auth/login' */
      )
  },
  data: () => ({
    tab: null
  })
}
</script>
