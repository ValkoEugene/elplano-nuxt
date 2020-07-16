<template>
  <v-icon small @click.stop="confirmDelete">
    delete
  </v-icon>
</template>

<script lang="ts">
import { onMounted, onUnmounted, defineComponent } from '@vue/composition-api'
import {
  ModalConfirmRootEvent,
  ConfirmData
} from '~/components/modal/modal-confirm.vue'

interface PropsI {
  /** ID строки */
  rowId: string
  /** Текст подтверждения на удаление */
  confirmText: string
}

export default defineComponent({
  name: 'TableDeleteIcon',
  props: {
    rowId: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      required: true
    }
  },
  setup(props: PropsI, context) {
    /** Подтверждение на удаление предмета */
    const confirmDelete = () => {
      const data: ConfirmData = {
        text: props.confirmText,
        id: props.rowId
      }

      context.root.$emit(ModalConfirmRootEvent.SHOW_CONFIRM, data)
    }

    /** Удаление */
    const onDelete = () => {
      context.emit('onDelete', props.rowId)
    }

    onMounted(() => {
      context.root.$on(
        `${ModalConfirmRootEvent.CONFIRM_SUCCESS}_${props.rowId}`,
        onDelete
      )
    })

    onUnmounted(() => {
      context.root.$off(
        `${ModalConfirmRootEvent.CONFIRM_SUCCESS}_${props.rowId}`,
        onDelete
      )
    })

    return { confirmDelete }
  }
})
</script>
