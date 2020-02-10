<template>
  <div>
    <v-alert type="info" class="ma-6" prominent>
      <span>{{ $t('group.infoline1') }}</span>
      <br />
      <span>{{ $t('group.infoline2') }}</span>
    </v-alert>

    <EditGroup :load-in-mounted="false" class="ma-6" />
    <InvitesList class="ma-6" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Компонент выбора/создания группы если пользователь еще не состоит ни в одной
 */
@Component({
  middleware: ['auth'],
  components: {
    EditGroup: () => import('~/components/group/edit-group.vue'),
    InvitesList: () => import('~/components/group/invites-list.vue')
  }
})
export default class Ungrouped extends Vue {
  mounted() {
    if (this.$vuexModules.Group.haveGroup) {
      this.$router.push('/')
    }
  }
}
</script>
