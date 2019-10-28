<template>
  <v-app-bar class="bg-primary" app dark>
    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>

    <v-toolbar-title class="page__title">{{
      currentPageTitle
    }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn text small @click="switchLocale">{{ locale }}</v-btn>

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
import { I18nModule, Locales } from '~/store/i18n.ts'
import { UserModule } from '~/store/user.ts'
import { GroupModule } from '~/store/group.ts'
import { TOGGLE_SIDEBAR_ROOT_LISTENER } from '~/layouts/sidebar.vue'

@Component
export default class Header extends Vue {
  /**
   * Заголовки страниц в i18n
   */
  pageTitlesI18n: { [key: string]: string } = {
    '/': 'schedule',
    '/courses': 'lessons',
    '/lecturers': 'teachers',
    '/group': 'group',
    '/tasks': 'tasks',
    '/measure': 'measure',
    '/ratings': 'ratings',
    '/attachments': 'attachments',
    '/student': 'student',
    '/group/settings': 'groupSettings'
  }

  /**
   * Текущая локаль
   */
  get locale(): Locales {
    return I18nModule.locale
  }

  /**
   * Флаг показа кнопки Добавить на главный экран
   */
  get showA2hsButton(): boolean {
    return UserModule.showA2hsButton
  }

  /**
   * Флаг что пользователь староста
   */
  get isPresident(): boolean {
    return UserModule.isPresident
  }

  /**
   * Флаг наличия группы
   */
  get haveGroup(): boolean {
    return GroupModule.haveGroup
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
   * Сменить локаль
   */
  switchLocale() {
    const newLocale = this.locale === 'en' ? 'ru' : 'en'
    I18nModule.setLang(newLocale)
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
          UserModule.SET_SHOW_A2HS_BUTTON(false)
        } else {
          console.log('User dismissed the A2HS prompt')
        }
      })
      .catch((err: any) => {
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
