<template>
  <!-- eslint-disable -->
  <v-card-title
    class="text-primary-darken3"
    :class="[$vuetify.breakpoint.width > 900 ? 'title' : 'subtitle-1 font-weight-black']"
  >
    <slot />
  </v-card-title>
</template>

<script>
export default {
  name: 'CardTitle'
}
</script>
