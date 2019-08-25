<template>
  <v-card-title class="title custom-title">
    <slot />
  </v-card-title>
</template>

<script>
export default {
  name: 'CardTitle'
}
</script>

<style>
.custom-title {
  font-weight: normal !important;
  line-height: normal !important;
}
</style>
