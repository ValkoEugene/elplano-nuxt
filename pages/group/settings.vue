<template>
  <div>
    <EditGroup :load-in-mounted="true" class="mb-6" />

    <InvitesAdmin ref="invites" class="mb-6" />
  </div>
</template>

<script>
export default {
  name: 'GroupSettings',
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
}
</script>
