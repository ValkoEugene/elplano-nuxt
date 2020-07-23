// eslint-disable-next-line import/named
import { SetupContext, onMounted, onUnmounted } from '@vue/composition-api'

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

interface ConfigI {
  /** Текст подтверждения на удаление */
  text: string
  /** Уникальный идентификатор для открытия подтверждения на удаления */
  id: string
}

/**
 * Открыть подтверждение на удаление
 */
export const useConfirmDelete = (context: SetupContext, config: ConfigI) => {
  const { text, id } = config

  /** Подтверждение на удаление предмета */
  const confirmDelete = () => {
    const data: ConfirmData = {
      text,
      id
    }

    context.root.$emit(ModalConfirmRootEvent.SHOW_CONFIRM, data)
  }

  /** Удаление */
  const onDelete = () => {
    context.emit('onDelete', id)
  }

  onMounted(() => {
    context.root.$on(`${ModalConfirmRootEvent.CONFIRM_SUCCESS}_${id}`, onDelete)
  })

  onUnmounted(() => {
    context.root.$off(
      `${ModalConfirmRootEvent.CONFIRM_SUCCESS}_${id}`,
      onDelete
    )
  })

  return { confirmDelete }
}
