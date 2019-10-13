import { mapGetters } from 'vuex'
import { namespace as groupNamespace, Types as groupTypes } from '~/store/group'

export default {
  computed: {
    ...mapGetters(groupNamespace, {
      /**
       * Флаг наличия группы
       * @type {Boolean}
       */
      haveGroup: groupTypes.getters.HAVE_GROUP
    })
  },
  mounted() {
    // Если пользователь не состоит в группе не отправляем запросы в mounted
    // eslint-disable-next-line no-useless-return
    if (!this.haveGroup) return
  }
}
