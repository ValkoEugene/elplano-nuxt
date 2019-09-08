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

<script>
import { SHOW_CONFIRM, CONFIRM_SUCCESS } from '../modal/modal-confirm.vue'

export default {
  name: 'DeleteButton',
  props: {
    /**
     * ID удаляемого элемента
     * @type {String}
     */
    id: {
      type: String,
      required: true
    },

    /**
     * Флаг доступности только для старосты
     * @type {Boolean}
     */
    presidentAccess: {
      type: Boolean,
      default: true
    },

    /**
     * Флаг блокировки
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Текст подтверждения на удаление
     * @type {String}
     */
    confirmText: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.$root.$on(`${CONFIRM_SUCCESS}_${this.id}`, this.onConfirm)
  },
  destroyed() {
    this.$root.$off(`${CONFIRM_SUCCESS}_${this.id}`, this.onConfirm)
  },
  methods: {
    /**
     * Показать окно подтверждения
     * @type {Function}
     */
    showConfirm() {
      this.$root.$emit(SHOW_CONFIRM, { text: this.confirmText, id: this.id })
    },

    /**
     * Обработчик подтверждения удаления
     * @type {Function}
     */
    onConfirm() {
      this.$emit('delete')
    }
  }
}
</script>
