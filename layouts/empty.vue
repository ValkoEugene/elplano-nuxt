<template>
  <v-app light>
    <nuxt />
    <Snackbars />
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  components: {
    Snackbars: () =>
      import(
        '~/components/UI-core/snackbars.vue' /* webpackChunkName: 'components/UI-core/snackbars' */
      )
  }
}
</script>
