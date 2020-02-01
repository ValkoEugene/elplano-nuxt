<template>
  <social-login-btn
    provider="Yandex"
    icon-src="/images/auth/yandex-auth.png"
    @click="loginYandex"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    SocialLoginBtn: () =>
      import(
        '~/components/auth/social-networks/social-login-btn.vue' /* webpackChunkName: 'components/auth/social-networks/social-login-btn' */
      )
  }
})
export default class yandexAuth extends Vue {
  /*
   * Авторизовать через Yandex
   */
  loginYandex(): void {
    const client_id = process.env.YANDEX_AUTH_CLIENT_ID
    const redirect_uri = process.env.YANDEX_AUTH_REDITECT_URL
    const response_type = 'code'
    const src =
      'https://oauth.yandex.ru/authorize?' +
      `response_type=${response_type}` +
      `&client_id=${client_id}` +
      `&redirect_uri=${redirect_uri}`

    window.location.href = src
  }
}
</script>
