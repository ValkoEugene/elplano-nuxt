<template>
  <v-app light>
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
  })
}
</script>
