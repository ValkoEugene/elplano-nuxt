import {
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie
} from '../utils/auth'

// Middleware для проверки авторизован ли пользователь
export default ({ store, redirect, req, route }) => {
  // Флаг что выполняется серверная генерация
  const isServer = process.server

  // Получаем и сохраняем токены
  if (isServer) {
    const access_token = getAccessTokenFromCookie(req)
    const refresh_token = getRefreshTokenFromCookie(req)

    if (access_token && refresh_token) {
      store.commit('user/setAccessToken', access_token)
      store.commit('user/setRefreshToken', refresh_token)
    }
  }

  // Проверяем авторизован ли пользователь
  // если пользователя не было, то выше ничего и не сохранилось
  if (!store.getters['user/isAuth']) {
    return redirect('/login')
  }
}
