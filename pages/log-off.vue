<template>
  <loader-full-page />
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { useAcceptInviteToken } from '~/components/group/useAcceptInviteToken.ts'

export default defineComponent({
  layout: 'emptyWithLogo',
  components: {
    LoaderFullPage: () =>
      import(
        '~/components/UI-core/loaders/loader-full-page.vue' /* webpackChunkName: 'components/UI-core/loaders/loader-full-page' */
      )
  },
  setup(_, context) {
    const { resetAcceptInviteTokenInLocalStorage } = useAcceptInviteToken()
    onMounted(async () => {
      await context.root.$vuexModules.User.resetUser()
      resetAcceptInviteTokenInLocalStorage()

      // Используем location чтобы страница перезагрузилась и все состояние vuex сбросилось
      // window.location.replace('/login')
      context.root.$router.push('/login')
    })
  }
})
</script>
