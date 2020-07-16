// Middleware для проверки является ли пользователь старостой

// eslint-disable-next-line import/no-unresolved
import { Context } from '@nuxt/types'

export default ({ redirect, app }: Context) => {
  if (!app.$vuexModules.User.isPresident) {
    return redirect('/schedule')
  }
}
