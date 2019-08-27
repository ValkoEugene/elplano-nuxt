<template>
  <v-menu left bottom>
    <template v-slot:activator="{ on }">
      <v-btn icon class="card__actions" v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list :min-width="200">
      <slot />
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'CardMenu'
}
</script>

<style scoped>
.card__actions {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
