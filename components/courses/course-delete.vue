<template>
  <v-icon small @click.stop="confirmDeleteCourse">
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
  /** ID предмета */
  courseId: string
}

export default defineComponent({
  name: 'CourseDelete',
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  setup(props: PropsI, context) {
    /** Подтверждение на удаление предмета */
    const confirmDeleteCourse = () => {
      const text: string = context.root.$t('lesson.confirm') as string
      const data: ConfirmData = {
        text,
        id: props.courseId
      }

      context.root.$emit(ModalConfirmRootEvent.SHOW_CONFIRM, data)
    }

    /** Удаление предмета */
    const deleteCourse = () => {
      context.emit('deleteCourse', props.courseId)
    }

    onMounted(() => {
      context.root.$on(
        `${ModalConfirmRootEvent.CONFIRM_SUCCESS}_${props.courseId}`,
        deleteCourse
      )
    })

    onUnmounted(() => {
      context.root.$off(
        `${ModalConfirmRootEvent.CONFIRM_SUCCESS}_${props.courseId}`,
        deleteCourse
      )
    })

    return { confirmDeleteCourse }
  }
})
</script>
