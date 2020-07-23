<template>
  <div>
    <template v-if="!haveGroup">
      <v-alert type="info" class="ma-6" prominent>
        <span>{{ $t('group.infoline1') }}</span>
        <br />
        <span>{{ $t('group.infoline2') }}</span>
      </v-alert>

      <EditGroup :load-in-mounted="false" class="ma-6" />
      <InvitesList ref="invites-list" class="ma-6" />
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
import { useAcceptInviteToken } from '~/components/group/useAcceptInviteToken.ts'
import { acceptInvite } from '~/api/user-invites.ts'
import { useSnackbars } from '~/compositions/useSnackbars.ts'

const components = {
  InvitesList: () => import('~/components/group/invites-list.vue'),
  EditGroup: () => import('~/components/group/edit-group.vue'),
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
      if (!haveProfileInfo.value) return

      context.root.$router.push('/schedule')
    })

    const {
      acceptToken,
      resetAcceptInviteTokenInLocalStorage
    } = useAcceptInviteToken()

    const { addErrorSnackbars } = useSnackbars(context)

    /**
     * Проверить наличие сохраненного токена для вступления в группу
     * (проставляется на странице /accept-invite )
     */
    const checkSavedAcceptToken = async () => {
      try {
        if (!acceptToken.value) return

        await acceptInvite(acceptToken.value as string)
        resetAcceptInviteTokenInLocalStorage()
        await context.root.$vuexModules.User.getUserInfo()
      } catch (error) {
        addErrorSnackbars(error.snackbarErrors)
      }
    }

    onMounted(() => {
      if (haveGroup.value && haveProfileInfo.value) {
        context.root.$router.push('/schedule')
      }

      if (!haveGroup.value) checkSavedAcceptToken()
    })

    return { haveGroup, haveProfileInfo }
  }
})
</script>
