// Для использования router из vuex
import VueRouter from 'vue-router'
declare global {
  interface Window {
    $nuxt: {
      $router: VueRouter
    }
  }
}
export default () => window.$nuxt.$router
