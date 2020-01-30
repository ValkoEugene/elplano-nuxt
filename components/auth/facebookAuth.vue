<template>
  <span @click="loginFacebook">
    <img class="social-networks__logo" src="~assets/images/facebook-auth.png" />
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
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
