<template>
  <div>
    <template v-if="!haveGroup">
      <v-alert type="info" class="ma-6" prominent>
        <span>{{ $t('group.infoline1') }}</span>
        <br />
        <span>{{ $t('group.infoline2') }}</span>
      </v-alert>

      <EditGroup :load-in-mounted="false" class="ma-6" />
      <InvitesList class="ma-6" />
    </template>

    <template v-else-if="!haveProfileInfo">
      <profile-edit />
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  onMounted,
  computed
} from '@vue/composition-api'

const components = {
  EditGroup: () => import('~/components/group/edit-group.vue'),
  InvitesList: () => import('~/components/group/invites-list.vue'),
  ProfileEdit: () => import('~/components/student/profile-edit.vue')
}

export default defineComponent({
  name: 'PreinstallSettings',
  middleware: ['auth'],
  components,
  setup(_, context) {
    /** Флаг наличия группы */
    const haveGroup = computed(() => context.root.$vuexModules.Group.haveGroup)

    /** Флаг что заполненна информация о профиле */
    const haveProfileInfo = computed(
      () => context.root.$vuexModules.User.haveProfileInfo
    )

    /** При заполнении информации о профиле переводим на страницу с расписанием */
    watch(haveProfileInfo, () => {
      if (!haveProfileInfo) return

      context.root.$router.push('/schedule')
    })

    onMounted(() => {
      if (haveGroup && haveProfileInfo) {
        context.root.$router.push('/schedule')
      }
    })

    return { haveGroup, haveProfileInfo }
  }
})
</script>
