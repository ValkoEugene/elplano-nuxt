<template>
  <!-- eslint-disable -->
  <v-btn
    fixed
    dark
    fab
    bottom
    right
    class="bg-primary-darken1"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <v-icon>add</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'AddNew',
  props: {
    /**
     * Флаг отключения кнопки
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
