import {
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie
} from '../utils/auth'
import { namespace, Types } from '../store/user'

// Middleware для проверки авторизован ли пользователь
export default ({ store, redirect, req, route }) => {
  console.log('auth')
  // Флаг что выполняется серверная генерация
  const isServer = process.server

  // Получаем и сохраняем токены
  if (isServer) {
    const access_token = getAccessTokenFromCookie(req)
    const refresh_token = getRefreshTokenFromCookie(req)

    if (access_token && refresh_token) {
      store.commit(
        `${namespace}/${Types.mutations.SET_ACCESS_TOKEN}`,
        access_token
      )
      store.commit(
        `${namespace}/${Types.mutations.SET_REFRESH_TOKEN}`,
        refresh_token
      )
    }
  }

  // Проверяем авторизован ли пользователь
  // если пользователя не было, то выше ничего и не сохранилось
  if (!store.getters[`${namespace}/${Types.getters.IS_AUTH}`]) {
    return redirect('/login')
  }
}
