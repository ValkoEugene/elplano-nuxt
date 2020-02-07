import VueRouter from 'vue-router'

/**
 * Получить инстанс роутера через window
 */
const getRouter = (): VueRouter => {
  const { $nuxt } = window as any
  return $nuxt.$router
}

export default getRouter
