<template>
  <div>
    <EditGroup :load-in-mounted="true" class="mb-6" />

    <InvitesAdmin ref="invites" class="mb-6" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Компонент с настройками группы
 */
@Component({
  middleware: ['auth', 'president'],
  components: {
    EditGroup: () =>
      import(
        '~/components/group/edit-group.vue' /*  webpackChunkName: 'components/group' */
      ),
    InvitesAdmin: () =>
      import(
        '~/components/group/invites-admin.vue' /*  webpackChunkName: 'components/group' */
      )
  }
})
export default class GroupSettings extends Vue {}
</script>
