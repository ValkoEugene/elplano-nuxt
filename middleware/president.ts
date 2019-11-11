// Middleware для проверки является ли пользователь старостой

import { Context } from '@nuxt/types'

export default ({ redirect, app }: Context) => {
  if (!app.$vuexModules.User.isPresident) {
    return redirect('/')
  }
}
