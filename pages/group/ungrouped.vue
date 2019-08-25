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

<script>
export default {
  name: 'Ungrouped',
  middleware: ['auth'],
  components: {
    EditGroup: () => import('../../components/group/edit-group.vue'),
    InvitesList: () => import('../../components/group/invites-list.vue')
  }
}
</script>
