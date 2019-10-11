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

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import { namespace, Types } from '../store/i18n'
import { namespace as userNamespace, Types as userTypes } from '../store/user'
import {
  namespace as groupNamespace,
  Types as groupTypes
} from '../store/group'
import { TOGGLE_SIDEBAR_ROOT_LISTENER } from './sidebar.vue'

export default {
  name: 'Header',
  data: () => ({
    /**
     * Загодовки страниц в i18n
     * @type {String}
     */
    pageTitlesI18n: {
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
  }),
  computed: {
    ...mapState(namespace, [
      /**
       * Текущая локаль
       * @type {String}
       */
      'locale'
    ]),

    ...mapState(userNamespace, [
      /**
       * Флаг показа кнопки Добавить на главный экран
       * @type {Boolean}
       */
      'showA2hsButton'
    ]),

    ...mapGetters(userNamespace, {
      /**
       * Флаг что пользователь староста
       * @type {Boolean}
       */
      isPresident: userTypes.getters.IS_PRESIDENT
    }),

    ...mapGetters(groupNamespace, {
      /**
       * Флаг наличия группы
       * @type {Boolean}
       */
      haveGroup: groupTypes.getters.HAVE_GROUP
    }),

    /**
     * Ссылки для меню
     * @type {[ { url: String, text: String } ]}
     */
    links() {
      const links = [
        // { url: '/settings', text: this.$t('header.settings') }
      ]

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
    },

    /**
     * Текущий путь
     * @type {String}
     */
    currentPath() {
      return this.$route.path
    },

    /**
     * Текущий заголовок страницы
     * @type {String}
     */
    currentPageTitle() {
      return this.$t(`sidebar.${this.pageTitlesI18n[this.currentPath]}`)
    }
  },
  methods: {
    ...mapMutations(namespace, {
      /**
       * Установить локаль
       */
      setLang: Types.mutations.SET_LANG
    }),

    /**
     * Сменить локаль
     */
    switchLocale() {
      const newLocale = this.locale === 'en' ? 'ru' : 'en'
      this.setLang(newLocale)
    },

    /**
     * Открыть/закрыть боковую панель
     */
    toggleSidebar() {
      this.$root.$emit(TOGGLE_SIDEBAR_ROOT_LISTENER)
    },

    /**
     * Добавить приложение на главный экран
     */
    addToHomeScreen() {
      const deferredPrompt = window.deferredPrompt

      if (!deferredPrompt) return

      // Show the prompt
      deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.$store.commit(
              `${userNamespace}/${userTypes.mutations.SET_SHOW_A2HS_BUTTON}`,
              false
            )
          } else {
            console.log('User dismissed the A2HS prompt')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.mobile .page__title {
  font-size: 1rem;
  padding-left: 0;
}
</style>
