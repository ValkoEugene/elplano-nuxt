<template>
  <Confirm
    :active="showingConfirmation"
    @cancel="showingConfirmation = false"
    @confirm="onConfirm"
  >
    <template v-slot:title>{{ text }}</template>
  </Confirm>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Данные для показа окна подтверждения
 */
export type ConfirmData = {
  text: string
  id: string
}

/**
 * Слушатели для показа окна и подтверждения
 */
export enum ModalConfirmRootEvent {
  SHOW_CONFIRM = 'SHOW_CONFIRM',
  CONFIRM_SUCCESS = 'CONFIRM_SUCCESS'
}

/**
 * Компонент окна подтверждения
 */
@Component({
  components: {
    Confirm: () =>
      import(
        '~/components/UI-core/confirm.vue' /* webpackChunkName: 'components/UI-core/confirm' */
      )
  }
})
export default class ModalConfirm extends Vue {
  /**
   * Флаг показа окна подтверждения
   * @type {boolean}
   */
  showingConfirmation: boolean = false

  /**
   * Текст окна подтвержения
   * @type {boolean}
   */
  text: string = ''

  /**
   * Уникальный идентификатор окна подтверждения
   * (т.к. используем $root.$emit id нужен чтобы не отрабатывали сразу все слушаюшие это событие компоненты)
   * @type {string}
   */
  confirmId: string = ''

  /**
   * Показать окно подтверждения
   * @param {{ text: String }}
   * @type {function}
   */
  showConfirmation({ text, id }: ConfirmData) {
    this.text = text
    this.confirmId = id
    this.showingConfirmation = true
  }

  /**
   * Обработчик подтверждения
   * @type {Function}
   */
  onConfirm() {
    this.$root.$emit(
      `${ModalConfirmRootEvent.CONFIRM_SUCCESS}_${this.confirmId}`
    )
    this.showingConfirmation = false
  }

  mounted() {
    this.$root.$on(ModalConfirmRootEvent.SHOW_CONFIRM, this.showConfirmation)
  }

  destroyed() {
    this.$root.$off(ModalConfirmRootEvent.SHOW_CONFIRM, this.showConfirmation)
  }
}
</script>
