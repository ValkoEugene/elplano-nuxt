<template>
  <loader-full-page />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IdentityProvider } from '~/api/users-identities.ts'

@Component({
  layout: 'empty',
  components: {
    LoaderFullPage: () =>
      import(
        '~/components/UI-core/loaders/loader-full-page.vue' /* webpackChunkName: 'components/UI-core/loaders/loader-full-page' */
      )
  }
})
export default class AuthYandexCallbackPage extends Vue {
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
    this.$router.push({
      path: '/auth/callback',
      query: {
        code: this.code,
        provider: IdentityProvider.facebook,
        redirect_uri: process.env.FACEBOOK_AUTH_REDIRECT_URL
      }
    })
  }
}
</script>

<style scoped>
.token_wrapper {
  font-size: 14;
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: break-word !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  -moz-hyphens: auto;
  -webkit-hyphens: manual;
  -ms-hyphens: auto;
  hyphens: auto;
  height: 100vh;
  width: 100vw;
  padding: 50px;
}
</style>
