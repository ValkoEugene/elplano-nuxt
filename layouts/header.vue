<template>
  <v-app-bar class="bg-primary-darken4" app dark>
    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>

    <v-toolbar-title>Elplano</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn text small @click="switchLocale">{{ locale }}</v-btn>

    <v-menu left bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list :min-width="200">
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
import { TOGGLE_SIDEBAR_ROOT_LISTENER } from './sidebar.vue'

export default {
  name: 'Header',
  computed: {
    /**
     * Текущая локаль
     * @type {String}
     */
    ...mapState(namespace, ['locale']),

    ...mapGetters(userNamespace, {
      /**
       * Флаг что пользователь староста
       * @type {Boolean}
       */
      isPresident: userTypes.getters.IS_PRESIDENT
    }),

    /**
     * Ссылки для меню
     * @type {[ { url: String, text: String } ]}
     */
    links() {
      const links = [
        { url: '/student', text: this.$t('header.profile') },
        { url: '/settings', text: this.$t('header.settings') }
      ]

      if (this.isPresident)
        links.push({
          url: '/group/settings',
          text: this.$t('header.groupSettings')
        })

      links.push({ url: '/log-off', text: this.$t('header.logout') })

      return links
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
    }
  }
}
</script>
