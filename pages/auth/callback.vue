<template>
  <div class="token_wrapper">
    {{ code || 'something go wrong' }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SnackbarColor } from '~/store/snackbars.ts'
import {
  signInByProvider,
  IdentityProvider,
  Identity
} from '~/api/users-identities.ts'

@Component({ layout: 'empty' })
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
   *
   */
  get redirect_uri(): string | undefined {
    return this.$route.query.redirect_uri as string | undefined
  }

  mounted() {
    if (this.code && this.provider) {
      console.log(this.code, this.provider)
      // if (this.code === 'never')
      const identity: Identity = {
        code: this.code,
        provider: this.provider
      }

      if (this.redirect_uri) {
        identity.redirect_uri = this.redirect_uri
      }

      signInByProvider(identity)
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
