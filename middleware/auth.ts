import {
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie
} from '~/utils/auth'
import { Context } from '@nuxt/types'

// Middleware для проверки авторизован ли пользователь
export default ({ redirect, req, route, store, app }: Context) => {
  const UserModule = app.$vuexModules.User
  const GroupModule = app.$vuexModules.Group

  console.log('auth middleware')
  // Флаг что выполняется серверная генерация
  const isServer = process.server

  // Получаем и сохраняем токены
  if (isServer) {
    const access_token = getAccessTokenFromCookie(req)
    const refresh_token = getRefreshTokenFromCookie(req)

    if (access_token && refresh_token) {
      UserModule.setTokens({ refresh_token, access_token })
    }
  }

  // Проверяем авторизован ли пользователь
  // если пользователя не было, то выше ничего и не сохранилось
  if (!UserModule.isAuth) {
    return redirect('/login')
  }

  // Проверяем является ли пользователь админом
  if (UserModule.isAdmin) {
    return redirect('/admin')
  }

  // Проверяем состоит ли пользователь в группе
  if (
    !isServer &&
    route.path !== '/group/ungrouped' &&
    !UserModule.loading &&
    !GroupModule.haveGroup
  ) {
    console.log('auth /group/ungrouped')
    return redirect('/group/ungrouped')
  }
}
