<template>
  <v-app-bar color="deep-purple accent-4" app dark>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>

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
        <!-- eslint-disable -->
        <v-list-item v-for="link in links" :key="link.url" :to="link.url" nuxt>{{ link.text }}</v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { namespace, Types } from '../store/i18n'

export default {
  name: 'Header',
  computed: {
    /**
     * Текущая локаль
     * @type {String}
     */
    ...mapState(namespace, ['locale']),

    /**
     * Флаг что пользователь админ
     * @type {Boolean}
     */
    isAdmin() {
      return this.$store.state.user.admin
    },

    /**
     * Ссылки для меню
     * @type {[ { url: String, text: String } ]}
     */
    links() {
      const links = [
        { url: '/student', text: this.$t('header.profile') },
        { url: '/settings', text: this.$t('header.settings') }
      ]

      if (this.isAdmin)
        links.push({
          url: '/group-settings',
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
    }
  }
}
</script>
