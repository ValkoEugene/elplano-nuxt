<template>
  <v-list-item
    v-show="!presidentAccess || $store.getters['user/IS_PRESIDENT']"
    icon
    color="error"
    :disabled="disabled"
    @click="showConfirm"
  >
    <v-icon class="pr-2">delete</v-icon>
    {{ $t('ui.delete') }}
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import {
  SHOW_CONFIRM,
  CONFIRM_SUCCESS
} from '~/components/modal/modal-confirm.vue'

@Component
export default class DeleteButton extends Vue {
  /**
   * ID удаляемого элемента
   * @type {String}
   */
  @Prop({ type: String, required: true })
  readonly id!: string

  /**
   * Флаг доступности только для старосты
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: true })
  readonly presidentAccess!: boolean

  /**
   * Флаг блокировки
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: false })
  readonly disabled!: boolean

  /**
   * Текст подтверждения на удаление
   * @type {String}
   */
  @Prop({ type: String, required: true })
  readonly confirmText!: string

  /**
   * Показать окно подтверждения
   * @type {Function}
   */
  showConfirm(): void {
    this.$root.$emit(SHOW_CONFIRM, { text: this.confirmText, id: this.id })
  }

  /**
   * Обработчик подтверждения удаления
   * @type {Function}
   */
  onConfirm(): void {
    this.$emit('delete')
  }

  mounted() {
    this.$root.$on(`${CONFIRM_SUCCESS}_${this.id}`, this.onConfirm)
  }

  destroyed() {
    this.$root.$off(`${CONFIRM_SUCCESS}_${this.id}`, this.onConfirm)
  }
}
</script>
