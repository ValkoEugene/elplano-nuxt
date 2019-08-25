<template>
  <v-row class="fill-height" align-content="center" justify="center">
    <v-col v-if="!hideText" class="title text-center" cols="12">{{
      text || $t('ui.loading')
    }}</v-col>
    <v-col cols="6">
      <v-progress-linear color="primary" indeterminate height="6" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    /**
     * Кастомный текст к лоудеру
     * @type {String}
     */
    text: {
      type: String,
      default: ''
    },

    /**
     * Не показывать текст
     * @type {Boolean}
     */
    hideText: {
      type: Boolean,
      default: false
    }
  }
}
</script>
