<template>
  <v-dialog v-model="localActive" max-width="290">
    <Card actions-justify-content="end">
      <template v-slot:title class="headline">
        <slot name="title">Are you sure?</slot>
      </template>

      <template v-if="haveContentSlot" v-slot:content>
        <slot name="content" />
      </template>

      <template v-slot:actions>
        <v-btn text @click="cancel">{{ $t('ui.cancel') }}</v-btn>

        <v-btn text @click="confirm">{{ $t('ui.confirm') }}</v-btn>
      </template>
    </Card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Confirm',
  components: {
    Card: () =>
      import('./card.vue' /* webpackChunkName: 'components/UI-core/card' */)
  },
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
