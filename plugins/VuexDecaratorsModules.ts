import { Plugin } from '@nuxt/types'
import { getModule } from 'vuex-module-decorators'
import { Group } from '~/store/group.ts'
import { I18n } from '~/store/i18n.ts'
import { Snackbars } from '~/store/snackbars.ts'
import { User } from '~/store/user.ts'
import { Labels } from '~/store/labels.ts'
import { Tasks } from '~/store/tasks.ts'

declare module 'vue/types/vue' {
  interface Vue {
    $vuexModules: {
      Group: Group
      User: User
      Snackbars: Snackbars
      I18n: I18n
      Labels: Labels
      Tasks: Tasks
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
      Labels: Labels
      Tasks: Tasks
    }
  }
}

const vuexDecaratorsModules: Plugin = (context, inject) => {
  const { store } = context
  const vuexModules = {
    Group: getModule(Group, store),
    User: getModule(User, store),
    Snackbars: getModule(Snackbars, store),
    I18n: getModule(I18n, store),
    Labels: getModule(Labels, store),
    Tasks: getModule(Tasks, store)
  }

  inject('vuexModules', vuexModules)
}

export default vuexDecaratorsModules
