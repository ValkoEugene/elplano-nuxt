<template>
  <div>
    <v-alert v-if="haveGroup" type="error">
      Вы уже состоите в группе.
    </v-alert>

    <v-alert v-else-if="!activeteToken" type="error">
      Проблема с токеном, повторите попытку.
    </v-alert>

    <loader-full-page v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api'
import { useSnackbars } from '~/compositions/useSnackbars.ts'
import { acceptInvite } from '~/api/user-invites.ts'

export default defineComponent({
  components: {
    LoaderFullPage: () =>
      import(
        '~/components/UI-core/loaders/loader-full-page.vue' /* webpackChunkName: 'components/UI-core/loaders/loader-full-page' */
      )
  },
  setup(_, context) {
    const { addErrorSnackbars } = useSnackbars(context)

    /** Токен для вступления в группу */
    const activeteToken = computed(
      () => context.root.$route.query.invitation_token || ''
    )

    /** Флаг что пользователь уже состоит в группе */
    const haveGroup = computed(() => context.root.$vuexModules.Group.haveGroup)

    /** Принять приглашение */
    const accept = async () => {
      try {
        console.log('----accept')
        await acceptInvite(activeteToken.value as string)
        await context.root.$vuexModules.User.getUserInfo()
        // context.root.$router.replace('/group/preinstall-settings')
      } catch (error) {
        addErrorSnackbars(error.snackbarErrors)
      }
    }

    onMounted(() => {
      if (!activeteToken.value || haveGroup.value) {
        console.log('-----return')
        return
      }

      accept()
    })

    return { haveGroup, activeteToken }
  }
})
</script>
