import { User } from '~/store/user.ts'
import { getVuexDecaratorModuleByWindow } from '~/utils/getVuexDecaratorModuleByWindow.ts'

declare global {
  interface Window {
    deferredPrompt: any
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later.
  window.deferredPrompt = e
  getVuexDecaratorModuleByWindow(User).SET_SHOW_A2HS_BUTTON(true)
})
