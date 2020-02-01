<template>
  <social-login-btn
    provider="VKontakte"
    icon-src="/images/auth/vk-auth.png"
    @click="loginVK"
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
export default class vkAuth extends Vue {
  /*
   * Авторизовать через ВК
   */
  loginVK(): void {
    const client_id = process.env.VK_AUTH_CLIENT_ID
    const redirect_uri = process.env.VK_AUTH_REDIRECT_URL
    const display = 'popup'
    const response_type = 'code'
    const src =
      'https://oauth.vk.com/authorize?' +
      ` &client_id=${client_id}` +
      '&scope=email' +
      `&redirect_uri=${redirect_uri}` +
      `&display=${display}` +
      `&response_type=${response_type}`

    window.open(src, 'vk auth', 'width=100,height=100')
  }
}
</script>
