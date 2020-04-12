import Cookie from 'js-cookie'

/**
 * Сохранить токены в Cookie
 * @param {{ access_token: String, refresh_token: String }} tokens - токены
 */
export function setTokensInCookie({ access_token, refresh_token }) {
  Cookie.set('access_token', access_token, { expires: 7 })
  Cookie.set('refresh_token', refresh_token, { expires: 7 })
}

/**
 * Установить флаг использования темной темы в cookie
 */
export function setUseDarkThemeInCookie(useDarkTheme) {
  Cookie.set('use_dark_theme', useDarkTheme)
}

/**
 * Удалить токены в Cookie
 */
export function resetTokensInCookie() {
  Cookie.remove('access_token')
  Cookie.remove('refresh_token')
}

/**
 * Получить данные из Cookie
 * @param {Request} req
 * @param {String} name
 */
export function getFromCookieByName(req, name) {
  const cookie = req ? req.headers.cookie : window.document.cookie
  // Проверка наличия Cookies
  if (!cookie) return

  // Проверка наличия нужной
  const cookieByName = cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${name}=`))
  if (!cookieByName) return

  // Получение и парсинг токена
  return cookieByName.split('=')[1]
}

/**
 * Получить флаг использования темной темы из Cookie
 */
export const getUseDarkThemeFromCookie = (req) => {
  return getFromCookieByName(req, 'use_dark_theme') || true
}

/**
 * Получение токена из Cookie
 * @param {} req
 */
export const getAccessTokenFromCookie = (req) => {
  return getFromCookieByName(req, 'access_token')
}

/**
 * Получение рефрреш токена из Cookie
 * @param {} req
 */
export const getRefreshTokenFromCookie = (req) => {
  return getFromCookieByName(req, 'refresh_token')
}

/**
 * Установить информацию о регистрации в localStorage
 * @param {{ login: String, password: String }}
 */
export function setRegistrationInfo({ login, password }) {
  window.localStorage.setItem('registration-login', login)
  window.localStorage.setItem('registration-password', password)
}

/**
 * Получить инфорамцию о регистрации
 * @returns {{ login: String, password: String }}
 */
export function getRegistrationInfo() {
  const login = window.localStorage.getItem('registration-login')
  const password = window.localStorage.getItem('registration-password')

  if (!login || !password) return null

  return { login, password }
}
