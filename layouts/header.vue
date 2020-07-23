<template>
  <v-app-bar class="bg-primary" app dark>
    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>

    <v-toolbar-title class="page__title">{{
      currentPageTitle
    }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <task-statstics />

    <v-menu left bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>account_circle</v-icon>
        </v-btn>
      </template>

      <v-list :min-width="200">
        <v-list-item v-if="showA2hsButton" @click="addToHomeScreen">
          {{ $t('ui.a2hsButton') }}
        </v-list-item>

        <v-list-item
          v-for="link in links"
          :key="link.url"
          :to="link.url"
          nuxt
          >{{ link.text }}</v-list-item
        >
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TOGGLE_SIDEBAR_ROOT_LISTENER } from '~/layouts/sidebar.vue'

@Component({
  components: {
    TaskStatstics: () =>
      import(
        '~/components/tasks/task-statistics.vue' /* webpackChunkName: 'components/tasks/task-statistics' */
      )
  }
})
export default class Header extends Vue {
  /**
   * Заголовки страниц в i18n
   */
  pageTitlesI18n: { [key: string]: string } = {
    '/schedule': 'schedule',
    '/courses': 'lessons',
    '/lecturers': 'teachers',
    '/group': 'group',
    '/tasks': 'tasks',
    '/tasks-tabs': 'tasks',
    '/measure': 'measure',
    '/ratings': 'ratings',
    '/attachments': 'attachments',
    '/student': 'student',
    '/group/settings': 'groupSettings',
    '/group/preinstall-settings': 'preinstallSettings',
    '/accept-invite': 'acceptInvite'
  }

  /**
   * Флаг показа кнопки Добавить на главный экран
   */
  get showA2hsButton(): boolean {
    return this.$vuexModules.User.showA2hsButton
  }

  /**
   * Флаг что пользователь староста
   */
  get isPresident(): boolean {
    return this.$vuexModules.User.isPresident
  }

  /**
   * Флаг наличия группы
   */
  get haveGroup(): boolean {
    return this.$vuexModules.Group.haveGroup
  }

  /**
   * Ссылки для меню
   */
  get links() {
    const links = []

    if (this.haveGroup) {
      links.push({ url: '/student', text: this.$t('header.profile') })
    }

    if (this.isPresident)
      links.push({
        url: '/group/settings',
        text: this.$t('header.groupSettings')
      })

    links.push({ url: '/log-off', text: this.$t('header.logout') })

    return links
  }

  /**
   * Текущий путь
   */
  get currentPath(): string {
    return this.$route.path
  }

  /**
   * Текущий заголовок страницы
   */
  get currentPageTitle() {
    if (!this.pageTitlesI18n[this.currentPath]) return 'unkwnown page'

    return this.$t(`sidebar.${this.pageTitlesI18n[this.currentPath]}`)
  }

  /**
   * Открыть/закрыть боковую панель
   */
  toggleSidebar() {
    this.$root.$emit(TOGGLE_SIDEBAR_ROOT_LISTENER)
  }

  /**
   * Добавить приложение на главный экран
   */
  addToHomeScreen() {
    const { deferredPrompt } = window as any

    if (!deferredPrompt) return

    // Show the prompt
    deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
      .then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          this.$vuexModules.User.SET_SHOW_A2HS_BUTTON(false)
        } else {
          // eslint-disable-next-line no-console
          console.log('User dismissed the A2HS prompt')
        }
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.log(err)
      })
  }
}
</script>

<style scoped>
.mobile .page__title {
  font-size: 1rem;
  padding-left: 0;
}
</style>
