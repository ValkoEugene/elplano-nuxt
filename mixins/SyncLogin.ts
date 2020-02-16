import { Component, Vue, Watch } from 'vue-property-decorator'

/**
 * Миксин проверки авторизаванности пользователя
 */
@Component
export default class SyncLogin extends Vue {
  /**
   * Флаг того что пользователь авторизован
   */
  get isAuth(): boolean {
    return this.$vuexModules.User.isAuth
  }

  /**
   * Редиректим при смене статуса авторизаванности пользователя
   */
  @Watch('isAuth')
  onIsAuthChange() {
    this.$router.push(this.isAuth ? '/schedule' : '/log-off')
  }
}
