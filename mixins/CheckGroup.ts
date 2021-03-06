import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CheckGroup extends Vue {
  /**
   * Флаг наличия группы
   */
  get haveGroup(): boolean {
    return this.$vuexModules.Group.haveGroup
  }

  mounted() {
    // Если пользователь не состоит в группе не отправляем запросы в mounted
    // eslint-disable-next-line no-useless-return
    if (!this.haveGroup) return
  }
}
