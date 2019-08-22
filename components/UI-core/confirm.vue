<template>
  <v-dialog v-model="localActive" max-width="290">
    <v-card>
      <!-- eslint-disable-next-line -->
      <v-card-title class="headline">
        <slot name="title">Are you sure?</slot>
      </v-card-title>

      <v-card-text v-if="haveContentSlot">
        <slot name="content" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="cancel">{{ $t('ui.cancel') }}</v-btn>

        <v-btn text @click="confirm">{{ $t('ui.confirm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    /**
     * Флаг показа окна подтверждения
     * @type {Boolean}
     */
    active: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    /**
     * Локальное значение показа окна
     * @type {Boolean}
     */
    localActive: false
  }),
  computed: {
    /**
     * Флаг наличия слота с контентом
     * @type {Boolean}
     */
    haveContentSlot() {
      return Boolean(this.$slots.content)
    }
  },
  watch: {
    active() {
      if (this.active === this.localActive) return

      this.localActive = this.active
    },

    localActive() {
      if (!this.localActive) this.cancel()
    }
  },
  methods: {
    /**
     * Отмена
     * @type {Function}
     */
    cancel() {
      this.$emit('cancel')
    },

    /**
     * Подтверждение
     * @type {Function}
     */
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>
