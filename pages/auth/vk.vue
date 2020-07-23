<template>
  <loader-full-page />
</template>

<script lang="ts">
import VueRouter from 'vue-router'
import { Component, Vue } from 'vue-property-decorator'
import { IdentityProvider } from '~/api/users-identities.ts'

@Component({
  layout: 'emptyWithLogo',
  components: {
    LoaderFullPage: () =>
      import(
        '~/components/UI-core/loaders/loader-full-page.vue' /* webpackChunkName: 'components/UI-core/loaders/loader-full-page' */
      )
  }
})
export default class AuthVkCallbackPage extends Vue {
  /**
   * Токен для входа
   */
  get code(): string | undefined {
    return this.$route.query.code as string | undefined
  }

  mounted() {
    this.sendCode()
  }

  /**
   * Отправить code в главную страницу
   */
  sendCode() {
    const mainPage: any = window.opener
    const $router = mainPage.$nuxt.$router as VueRouter
    $router.push(
      {
        path: '/auth/callback',
        query: {
          code: this.code,
          provider: IdentityProvider.vk,
          redirect_uri: process.env.VK_AUTH_REDIRECT_URL
        }
      },
      () => {
        window.close()
      }
    )
  }
}
</script>
