<template>
  <div>
    <EditGroup :load-in-mounted="true" class="mb-6" />
    <SendInvite class="mb-6" @sendInvite="reloadInvites" />
    <InvitesAdmin ref="invites" class="mb-6" />
  </div>
</template>

<script>
export default {
  name: 'GroupSettings',
  middleware: ['auth', 'president'],
  components: {
    EditGroup: () => import('../../components/group/edit-group.vue'),
    InvitesAdmin: () => import('../../components/group/invites-admin.vue'),
    SendInvite: () => import('../../components/group/send-invite.vue')
  },
  methods: {
    /**
     * Перезагрузить список приглашений
     */
    reloadInvites() {
      this.$refs.invites.loadData()
    }
  }
}
</script>
