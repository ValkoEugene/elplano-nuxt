<template>
  <Confirm
    :active="showingConfirmation"
    @cancel="showingConfirmation = false"
    @confirm="onConfirm"
  >
    <template v-slot:title>{{ text }}</template>
  </Confirm>
</template>

<script>
/**
 * Слушатель для показа окна подтверждения
 * @type {String}
 */
export const SHOW_CONFIRM = 'SHOW_CONFIRM'

/**
 * Слушатель для подтверждения
 */
export const CONFIRM_SUCCESS = 'CONFIRM_SUCCESS'

export default {
  name: 'ModalConfirm',
  components: {
    Confirm: () =>
      import(
        '../UI-core/confirm.vue' /* webpackChunkName: 'components/UI-core/confirm' */
      )
  },
  data: () => ({
    /**
     * Флаг показа окна подтверждения
     * @type {Boolean}
     */
    showingConfirmation: false,

    /**
     * Текст окна подтвержения
     * @type {Boolean}
     */
    text: '',

    /**
     * Уникальный идентификатор окна подтверждения
     * (т.к. используем $root.$emit id нужен чтобы не отрабатывали сразу все слушаюшие это событие компоненты)
     * @type {String}
     */
    confirmId: ''
  }),
  mounted() {
    this.$root.$on(SHOW_CONFIRM, this.showConfirmation)
  },
  destroyed() {
    this.$root.$off(SHOW_CONFIRM, this.showConfirmation)
  },
  methods: {
    /**
     * Показать окно подтверждения
     * @param {{ text: String }}
     * @type {Function}
     */
    showConfirmation({ text, id }) {
      this.text = text
      this.confirmId = id
      this.showingConfirmation = true
    },

    /**
     * Обработчик подтверждения
     * @type {Function}
     */
    onConfirm() {
      this.$root.$emit(`${CONFIRM_SUCCESS}_${this.confirmId}`)
      this.showingConfirmation = false
    }
  }
}
</script>
