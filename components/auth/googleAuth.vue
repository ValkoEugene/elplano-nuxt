<template>
  <span @click="initAuthByGoogle">
    <img class="social-networks__logo" src="~assets/images/google-auth.svg" />
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SnackbarColor } from '~/store/snackbars.ts'
import { IdentityProvider } from '~/api/users-identities.ts'

@Component({})
export default class GoogleAuth extends Vue {
  /**
   * Флаг что скрпит для авторизации через google загружен
   */
  isGoogleOuathScriptLoaded: boolean = false

  /**
   * Авторизоваться через google
   */
  authByGoogle(): void {
    const { gapi } = window

    gapi.load('auth2', () => {
      gapi.auth2.authorize(
        {
          client_id:
            '755391828122-f8lsukf4sbqth14q6e3bv7661ivghf2k.apps.googleusercontent.com',
          scope: 'email profile openid',
          response_type: 'code'
        },
        (response) => {
          if (response.error) {
            console.error(response.error)
            if (response.error === 'popup_closed_by_user') return

            this.$vuexModules.Snackbars.ADD_SNACKBARS([
              { text: response.error, color: SnackbarColor.error }
            ])
            return
          }

          this.$router.push({
            path: '/auth/callback',
            query: {
              code: response.code,
              provider: IdentityProvider.google,
              redirect_uri: 'postmessage'
            }
          })
        }
      )
    })
  }

  /**
   * Инициализация авторизации через google
   */
  initAuthByGoogle(): void {
    if (this.isGoogleOuathScriptLoaded) {
      this.authByGoogle()
      return
    }

    const googleOuathScript = window.document.createElement('script')
    googleOuathScript.setAttribute(
      'src',
      'https://apis.google.com/js/platform.js'
    )
    window.document.head.appendChild(googleOuathScript)

    googleOuathScript.onload = () => {
      this.isGoogleOuathScriptLoaded = true
      this.authByGoogle()
    }
  }
}
</script>

<style scoped>
.auth__google-icon {
  cursor: pointer;
}
</style>
