<template>
  <v-card-title
    class="title custom-title"
    :class="[$vuetify.breakpoint.smAndDown ? 'custom-title-mobile' : '']"
  >
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

.custom-title.custom-title-mobile {
  font-size: 1rem !important;
  padding-top: 20px;
}
</style>
