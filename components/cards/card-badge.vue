<template>
  <v-chip class="custom-badge elevation-5" color="info" small label>
    <slot />
  </v-chip>
</template>

<script>
export default {
  name: 'CardBadge'
}
</script>
