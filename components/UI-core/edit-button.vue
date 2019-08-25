<template>
  <v-btn
    v-show="!presidentAccess || $store.getters['user/IS_PRESIDENT']"
    icon
    class="text-primary"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <v-icon>edit</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'EditButton',
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
