import { Component, Vue } from 'vue-property-decorator'
import { namespace as groupNamespace, Types as groupTypes } from '~/store/group'

@Component
export default class CheckGroup extends Vue {
  /**
   * Флаг наличия группы
   */
  get haveGroup(): boolean {
    return this.$store.getters[
      `${groupNamespace}/${groupTypes.getters.HAVE_GROUP}`
    ]
  }

  mounted() {
    // Если пользователь не состоит в группе не отправляем запросы в mounted
    // eslint-disable-next-line no-useless-return
    if (!this.haveGroup) return
  }
}
