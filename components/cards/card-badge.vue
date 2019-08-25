<template>
  <v-chip class="custom-badge elevation-5" color="primary" small label>
    <slot />
  </v-chip>
</template>

<script>
export default {
  name: 'CardBadge'
}
</script>
