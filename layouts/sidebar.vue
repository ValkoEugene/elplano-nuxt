<template>
  <v-navigation-drawer v-model="sidebarStatus" app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Elplano</v-list-item-title>
        <v-list-item-subtitle>ValkoEugene</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" :to="item.url" nuxt>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
/**
 * Слушатель для открытие/закрытия боковой панели
 * @type {String}
 */
export const TOGGLE_SIDEBAR_ROOT_LISTENER = 'TOGGLE_SIDEBAR_ROOT_LISTENER'

export default {
  name: 'Sidebar',
  data: () => ({
    /**
     * Статус боковой панели
     * @type {Boolean}
     */
    sidebarStatus: true
  }),
  computed: {
    /**
     * Пункты меню
     * @type {Array}
     */
    items() {
      return [
        {
          title: this.$t('sidebar.schedule'),
          icon: 'mdi-view-dashboard',
          url: '/'
        },
        {
          title: this.$t('sidebar.lessons'),
          icon: 'mdi-library-books',
          url: '/lessons'
        },
        {
          title: this.$t('sidebar.tasks'),
          icon: 'mdi-briefcase',
          url: '/tasks'
        },
        {
          title: this.$t('sidebar.teachers'),
          icon: 'mdi-account-supervisor',
          url: '/teachers'
        },
        {
          title: this.$t('sidebar.group'),
          icon: 'mdi-account-group',
          url: '/group'
        },
        {
          title: this.$t('sidebar.measure'),
          icon: 'mdi-help-box',
          url: '/measure'
        },
        {
          title: this.$t('sidebar.ratings'),
          icon: 'mdi-star-half',
          url: '/ratings'
        },
        {
          title: this.$t('sidebar.attachments'),
          icon: 'mdi-briefcase-download',
          url: '/attachments'
        }
      ]
    }
  },
  mounted() {
    /**
     * Слушаем событие через root для открытия/закрытия боковой панели
     */
    this.$root.$on(TOGGLE_SIDEBAR_ROOT_LISTENER, this.toggleSidebar)
  },
  methods: {
    /**
     * Сменить статус боковой панели
     */
    toggleSidebar() {
      this.sidebarStatus = !this.sidebarStatus
    }
  }
}
</script>
