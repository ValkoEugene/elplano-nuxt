<template>
  <v-app light :style="cssVariblesFromTheme">
    <Sidebar />

    <Header />

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <nuxt></nuxt>
        <Snackbars />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  components: {
    Sidebar: () => import('./sidebar.vue'),
    Header: () => import('./header.vue'),
    Snackbars: () => import('../components/UI-core/snackbars.vue')
  },
  data: () => ({
    test: ''
  }),
  computed: {
    /**
     * Стили с css переменными из темы
     * @type {Object}
     */
    cssVariblesFromTheme() {
      return {
        '--secondary-color': this.$vuetify.theme.currentTheme.secondary,
        '--primary-color': this.$vuetify.theme.currentTheme.primary
      }
    }
  }
}
</script>

<style>
.text-secondary {
  color: var(--secondary-color) !important;
}

.text-primary {
  color: var(--primary-color) !important;
}
</style>
