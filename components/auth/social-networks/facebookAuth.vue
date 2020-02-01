<template>
  <social-login-btn
    provider="Facebook"
    icon-src="/images/auth/facebook-auth.png"
    :icon-height="20"
    @click="loginFacebook"
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
export default class FacebookAuth extends Vue {
  /*
   * Авторизовать через Facebook
   */
  loginFacebook(): void {
    const client_id = process.env.FACEBOOK_AUTH_CLIENT_ID
    const redirect_uri = process.env.FACEBOOK_AUTH_REDIRECT_URL

    const src =
      'https://www.facebook.com/v5.0/dialog/oauth?' +
      `&client_id=${client_id}` +
      `&redirect_uri=${redirect_uri}` +
      `&response_type=code` +
      `&scope=email`

    window.location.href = src
  }
}
</script>
