<template>
  <v-navigation-drawer app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Elplano</v-list-item-title>
        <v-list-item-subtitle>ValkoEugene</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" link>
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
export default {
  name: 'Sidebar',
  computed: {
    /**
     * Пункты меню
     * @type {Array}
     */
    items() {
      return [
        { title: this.$t('sidebar.schedule'), icon: 'mdi-view-dashboard' },
        { title: this.$t('sidebar.lessons'), icon: 'mdi-library-books' },
        { title: this.$t('sidebar.tasks'), icon: 'mdi-briefcase' },
        { title: this.$t('sidebar.teachers'), icon: 'mdi-account-supervisor' },
        { title: this.$t('sidebar.group'), icon: 'mdi-account-group' },
        { title: this.$t('sidebar.measure'), icon: 'mdi-help-box' },
        { title: this.$t('sidebar.ratings'), icon: 'mdi-star-half' },
        {
          title: this.$t('sidebar.attachments'),
          icon: 'mdi-briefcase-download'
        }
      ]
    }
  }
}
</script>
