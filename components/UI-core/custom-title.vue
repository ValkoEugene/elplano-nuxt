<template>
  <div class="custom-title">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CustomTitle'
}
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
