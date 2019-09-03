<template>
  <v-btn
    v-show="!presidentAccess || $store.getters['user/IS_PRESIDENT']"
    fixed
    dark
    fab
    bottom
    right
    class="bg-primary-darken4"
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
    },

    /**
     * Флаг доступа только старосте
     * @type {Boolean}
     */
    presidentAccess: {
      type: Boolean,
      default: true
    }
  }
}
</script>
