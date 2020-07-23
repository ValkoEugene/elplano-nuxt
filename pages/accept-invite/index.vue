<template>
  <div class="accept__wrapper">
    <template v-if="!activeteToken">
      <v-alert type="error">
        {{ $t('auth.invalidToken') }}
      </v-alert>

      <div>
        <v-btn link to="/login" :block="false" class="accept__login-btn">
          {{ $t('auth.loginBtn') }} / {{ $t('auth.signUpLink') }}
        </v-btn>
      </div>
    </template>

    <template v-else-if="!isAuth">
      <v-alert type="info">
        {{ $t('group.acceptInvite.notAuthLine1') }}
        <br />
        {{ $t('group.acceptInvite.notAuthLine2') }}
      </v-alert>

      <div>
        <v-btn link to="/login" :block="false" class="accept__login-btn">
          {{ $t('auth.loginBtn') }} / {{ $t('auth.signUpLink') }}
        </v-btn>
      </div>
    </template>

    <v-alert v-else-if="haveGroup" type="info">
      {{ $t('group.acceptInvite.haveGroup') }}
    </v-alert>

    <loader-full-page v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api'
import { useSnackbars } from '~/compositions/useSnackbars.ts'
import { acceptInvite } from '~/api/user-invites.ts'
import { useAcceptInviteToken } from '~/components/group/useAcceptInviteToken.ts'

export default defineComponent({
  layout: 'empty',
  components: {
    Logo: () =>
      import('~/components/logo.vue' /* webpackChunkName: 'components/logo' */),
    LoaderFullPage: () =>
      import(
        '~/components/UI-core/loaders/loader-full-page.vue' /* webpackChunkName: 'components/UI-core/loaders/loader-full-page' */
      )
  },
  setup(_, context) {
    const { addErrorSnackbars } = useSnackbars(context)

    /** Флаг что пользователь залогинен */
    const isAuth = computed(() => context.root.$vuexModules.User.isAuth)

    /** Токен для вступления в группу */
    const activeteToken = computed(
      () => context.root.$route.query.invitation_token || ''
    )

    /** Флаг что пользователь уже состоит в группе */
    const haveGroup = computed(() => context.root.$vuexModules.Group.haveGroup)

    /** Принять приглашение */
    const accept = async () => {
      try {
        await acceptInvite(activeteToken.value as string)
        // В методе getUserInfo идёт перенаправление на страницу /group/preinstall-settings если не заполненна инф. о профиле
        await context.root.$vuexModules.User.getUserInfo()
      } catch (error) {
        addErrorSnackbars(error.snackbarErrors)
      }
    }

    const { setAcceptInviteTokenInLocalStorage } = useAcceptInviteToken()

    onMounted(() => {
      // Проверяем есть ли токен и не состоит ли пользователь уже в группе
      if (!activeteToken.value || haveGroup.value) {
        return
      }

      // Сохраняем токен если пользователь был неавторизован
      // Проверяем наличие токена на странице /group/preinstall-settings
      if (!isAuth.value) {
        setAcceptInviteTokenInLocalStorage(activeteToken.value as string)
        return
      }

      // Если есть токен, пользователь авторизован и не состоит в группе то принимаем приглашение
      accept()
    })

    return {
      haveGroup,
      activeteToken,
      isAuth,
      setAcceptInviteTokenInLocalStorage
    }
  }
})
</script>

<style scoped>
.accept__wrapper {
  padding: 50px;
}

.accept__login-btn {
  display: flex;
  justify-content: center;
}
</style>
