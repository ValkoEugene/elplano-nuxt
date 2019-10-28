import { UserModule } from '~/store/user.ts'

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later.
  window.deferredPrompt = e
  UserModule.SET_SHOW_A2HS_BUTTON(true)
})
