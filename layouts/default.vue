<template>
  <v-app
    light
    :style="cssVariblesFromTheme"
    :class="[
      $vuetify.breakpoint.smAndDown ? 'mobile' : '',
      haveHeadersTabs ? 'have-header-tabs' : ''
    ]"
    class="default-layout"
  >
    <Sidebar :have-group="haveGroup" />

    <Header class="mobile__header" />

    <!-- Sizes your content based upon application components -->
    <v-main class="mobile__content">
      <!-- Provides the application the proper gutter -->
      <!-- <v-container fluid> -->
      <!-- If using vue-router -->
      <div
        class="nuxt-wrapper"
        :class="[$vuetify.breakpoint.smAndDown ? 'pa-3' : 'pa-6']"
      >
        <Loader v-if="loading" />

        <nuxt v-else />
      </div>
      <Snackbars />

      <ModalConfirm />
      <!-- </v-container> -->
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { User as UserI } from '~/api/admin-user.ts'
import SyncLogin from '~/mixins/SyncLogin.ts'

@Component({
  // Проверяем что пользователь авторизован
  middleware: ['auth'],
  components: {
    Loader: () =>
      import(
        '~/components/UI-core/loaders/loader.vue' /* webpackChunkName: 'components/UI-core/loaders/loader' */
      ),
    Sidebar: () =>
      import('./sidebar.vue' /* webpackChunkName: 'layouts/sidebar' */),
    Header: () =>
      import('./header.vue' /* webpackChunkName: 'layouts/header' */),
    Snackbars: () =>
      import(
        '~/components/UI-core/snackbars.vue' /* webpackChunkName: 'components/UI-core/snackbars' */
      ),
    ModalConfirm: () =>
      import(
        '~/components/modal/modal-confirm.vue' /* webpackChunkName: 'components/modal/modal-confirm' */
      )
  }
})
export default class DefaultLayout extends Mixins(SyncLogin) {
  /**
   * Флаг загрузки
   */
  get loading(): boolean {
    return this.$vuexModules.User.loading
  }

  /**
   * Пользователь
   */
  get userInfo(): UserI {
    return this.$vuexModules.User.userInfo
  }

  /**
   * Флаг наличия группы
   */
  get haveGroup(): boolean {
    return this.$vuexModules.Group.haveGroup
  }

  /**
   * Флаг наличия табов в хэдере
   */
  get haveHeadersTabs(): boolean {
    const tabsRoutes = ['/tasks-tabs']

    return tabsRoutes.includes(this.$route.path)
  }

  /**
   * Флаг использования темной темы
   */
  get useDarkTheme(): boolean {
    return this.$vuexModules.User.useDarkTheme
  }

  @Watch('useDarkTheme')
  onUseDarkTheme() {
    this.$vuetify.theme.dark = this.useDarkTheme
  }

  beforeCreate() {
    this.$vuetify.theme.dark = this.$vuexModules.User.useDarkTheme
  }

  /**
   * Стили с css переменными из темы
   */
  get cssVariblesFromTheme() {
    const { currentTheme } = this.$vuetify.theme as any

    return {
      '--secondary-color': currentTheme.secondary,
      '--primary-base': currentTheme.primary.base,
      '--primary-lighten1': currentTheme.primary.lighten1,
      '--primary-lighten2': currentTheme.primary.lighten2,
      '--primary-lighten3': currentTheme.primary.lighten3,
      '--primary-lighten4': currentTheme.primary.lighten4,

      '--primary-darken1': currentTheme.primary.darken1,
      '--primary-darken2': currentTheme.primary.darken2,
      '--primary-darken3': currentTheme.primary.darken3,
      '--primary-darken4': currentTheme.primary.darken4,

      '--primary-accent1': currentTheme.primary.accent1,
      '--primary-accent2': currentTheme.primary.accent2,
      '--primary-accent3': currentTheme.primary.accent3,
      '--primary-accent4': currentTheme.primary.accent4
    }
  }

  async mounted() {
    console.log('mounted loyout')

    window.document.body.classList.add('default-layout')
    window.document.documentElement.classList.add('default-layout')

    await this.$vuexModules.User.getUserInfo()
    this.$vuexModules.Tasks.loadStatistics()
  }

  beforeDestroy() {
    window.document.body.classList.remove('default-layout')
    window.document.documentElement.classList.remove('default-layout')
  }
}
</script>

<style>
.default-layout {
  /* html */
  /* { */
  overflow: hidden;
}

.v-main__wrap {
  background: #000ef30a;
  max-height: calc(100vh - 64px);
  overflow: auto;
  overflow-y: scroll;
}

@media (max-width: 960px) {
  .v-main__wrap {
    max-height: calc(100vh - 56px);
  }
}

.nuxt-wrapper {
  max-width: 1280px;
  margin: auto;
}

.mobile .mobile__header {
  max-width: 100vw;
}

.mobile .mobile__content {
  overflow-x: hidden;
}

/* Создаем css классы на основе цветовой схемы указанной в nuxt-config */
.text-secondary {
  color: var(--secondary-color) !important;
}

.text-primary {
  color: var(--primary-base) !important;
}

.text-primary-lighten1 {
  color: var(--primary-lighten1) !important;
}
.text-primary-lighten2 {
  color: var(--primary-lighten2) !important;
}
.text-primary-lighten3 {
  color: var(--primary-lighten3) !important;
}
.text-primary-lighten4 {
  color: var(--primary-lighten4) !important;
}

.text-primary-darken1 {
  color: var(--primary-darken1) !important;
}
.text-primary-darken2 {
  color: var(--primary-darken2) !important;
}
.text-primary-darken3 {
  color: var(--primary-darken3) !important;
}
.text-primary-darken4 {
  color: var(--primary-darken4) !important;
}

.text-primary-accent1 {
  color: var(--primary-accent1) !important;
}
.text-primary-accent2 {
  color: var(--primary-accent2) !important;
}
.text-primary-accent3 {
  color: var(--primary-accent3) !important;
}
.text-primary-accent4 {
  color: var(--primary-accent4) !important;
}

.bg-primary {
  background: var(--primary-base) !important;
}

.bg-primary-lighten1 {
  background: var(--primary-lighten1) !important;
}
.bg-primary-lighten2 {
  background: var(--primary-lighten2) !important;
}
.bg-primary-lighten3 {
  background: var(--primary-lighten3) !important;
}
.bg-primary-lighten4 {
  background: var(--primary-lighten4) !important;
}

.bg-primary-darken1 {
  background: var(--primary-darken1) !important;
}
.bg-primary-darken2 {
  background: var(--primary-darken2) !important;
}
.bg-primary-darken3 {
  background: var(--primary-darken3) !important;
}
.bg-primary-darken4 {
  background: var(--primary-darken4) !important;
}

.bg-primary-accent1 {
  background: var(--primary-accent1) !important;
}
.bg-primary-accent2 {
  background: var(--primary-accent2) !important;
}
.bg-primary-accent3 {
  background: var(--primary-accent3) !important;
}
.bg-primary-accent4 {
  background: var(--primary-accent4) !important;
}
</style>
