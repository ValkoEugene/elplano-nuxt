<template>
  <div class="custom-title">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomTitle'
})
</script>

<style scoped>
.custom-title {
  font-size: 1.25rem;
  font-family: 'Roboto', sans-serif;
}

.mobile .custom-title {
  font-size: 1rem;
}
</style>
