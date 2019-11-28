import { getModule } from 'vuex-module-decorators'
import { Group } from '~/store/group.ts'
import { I18n } from '~/store/i18n.ts'
import { Snackbars } from '~/store/snackbars.ts'
import { User } from '~/store/user.ts'
import { Context } from '@nuxt/types'
import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $vuexModules: {
      Group: Group
      User: User
      Snackbars: Snackbars
      I18n: I18n
    }
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $vuexModules: {
      Group: Group
      User: User
      Snackbars: Snackbars
      I18n: I18n
    }
  }
}

const vuexDecaratorsModules: Plugin = (context, inject) => {
  const { store } = context
  const vuexModules = {
    Group: getModule(Group, store),
    User: getModule(User, store),
    Snackbars: getModule(Snackbars, store),
    I18n: getModule(I18n, store)
  }

  inject('vuexModules', vuexModules)
}

export default vuexDecaratorsModules
