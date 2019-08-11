<template>
  <v-app light>
    <Sidebar />

    <v-app-bar color="deep-purple accent-4" app dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Elplano</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

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
    Snackbars: () => import('../components/UI-core/snackbars.vue')
  },
  data: () => ({
    test: ''
  })
}
</script>
