<template>
  <loader-full-page />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SnackbarColor } from '~/store/snackbars.ts'
import { IdentityProvider, Identity } from '~/api/users-identities.ts'

@Component({
  layout: 'empty',
  components: {
    LoaderFullPage: () =>
      import(
        '~/components/UI-core/loaders/loader-full-page.vue' /* webpackChunkName: 'components/UI-core/loaders/loader-full-page' */
      )
  }
})
export default class AuthCallbackPage extends Vue {
  /**
   * Токен для входа
   */
  get code(): string | undefined {
    return this.$route.query.code as string | undefined
  }

  /**
   * Название провайдра
   */
  get provider(): IdentityProvider | undefined {
    return this.$route.query.provider as IdentityProvider | undefined
  }

  /**
   * Адрес для перенаправления
   */
  get redirect_uri(): string | undefined {
    return this.$route.query.redirect_uri as string | undefined
  }

  mounted() {
    if (this.code && this.provider) {
      const identity: Identity = {
        code: this.code,
        provider: this.provider
      }

      if (this.redirect_uri) {
        identity.redirect_uri = this.redirect_uri
      }

      this.$vuexModules.User.socialLogin(identity)
    } else {
      this.$vuexModules.Snackbars.ADD_SNACKBARS([
        { text: 'Invalid params', color: SnackbarColor.error }
      ])
      this.$router.replace('/login')
    }
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
