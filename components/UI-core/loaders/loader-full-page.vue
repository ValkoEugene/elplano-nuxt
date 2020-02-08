<template>
  <div class="loader__wrapper">
    <v-progress-circular :size="50" color="primary" indeterminate />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class LoaderFullPage extends Vue {}
</script>

<style scoped>
.loader__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  padding: 50px;
}
</style>
