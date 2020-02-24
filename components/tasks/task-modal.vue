<template>
  <ModalWrapper
    ref="modalWrapper"
    :action-type="actionType"
    @action="onActionHandler"
    @close="onModalClose"
  >
    <template v-if="contentComponentName" #content>
      <TaskForm
        v-if="contentComponentName === 'TaskForm'"
        ref="taskForm"
        :task="taskModel"
        :events="events"
      />

      <TaskPreview
        v-if="contentComponentName === 'TaskPreview'"
        :task="taskModel"
        :events="events"
      />
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Prop } from 'vue-property-decorator'
import { Task } from '~/api/tasks.ts'
import TaskEventBusMixin from '~/components/tasks/task-event-bus-mixin.ts'
import ModalWrapper from '~/components/modal/modal-wrapper.vue'
import TaskForm from '~/components/tasks/task-form.vue'

@Component({
  components: {
    ModalWrapper,
    TaskForm: () =>
      import(
        '~/components/tasks/task-form.vue' /* webpackChunkName: 'components/tasks/task-form' */
      ),
    TaskPreview: () =>
      import(
        '~/components/tasks/task-preview.vue' /* webpackChunkName: 'components/tasks/task-preview' */
      )
  }
})
export default class TaskModal extends Mixins(TaskEventBusMixin) {
  /**
   * Ссылка на экземпляр компонента ModalWrapper
   */
  @Ref('modalWrapper')
  readonly modalWrapper!: ModalWrapper

  /**
   * Компонент с формой
   */
  @Ref()
  readonly taskForm: TaskForm

  /**
   * Элементы расписания
   */
  @Prop({ type: Array as () => Event[], required: true })
  readonly events!: Event[]

  /**
   * Название текущего компонента для отображения контента
   */
  contentComponentName: string = ''

  /**
   * Тип действия для модального окна
   */
  actionType: string = 'save'

  /**
   * Модель текущего задания
   */
  taskModel: Task | null = null

  mounted() {
    this.subscribeViewTask(this.viewTask)
    this.subscribeEditTask(this.editTask)
  }

  destroyed() {
    this.unsubscribeViewTask(this.viewTask)
    this.unsubscribeEditTask(this.editTask)
  }

  /**
   * Установить контент модельного окна
   */
  async setContent(
    task: Task,
    contentComponentName: string,
    actionType: string
  ) {
    await this.$nextTick()
    this.actionType = actionType
    this.taskModel = { ...task }
    this.contentComponentName = contentComponentName
    this.modalWrapper.open()
  }

  /**
   * Посмотреть задание
   */
  viewTask(task: Task) {
    this.setContent(task, 'TaskPreview', 'edit')
  }

  /**
   * Редактировать задание
   */
  editTask(task: Task) {
    this.setContent(task, 'TaskForm', 'save')
  }

  /**
   * Обработчик кнопки действия в модальном окне
   */
  onActionHandler() {
    if (this.actionType === 'save') this.taskForm.save()
    if (this.actionType === 'edit' && this.taskModel)
      this.editTask(this.taskModel)
  }

  /**
   * Обработчик закрытия модального окна
   */
  onModalClose() {
    this.contentComponentName = ''
    this.taskModel = null
  }
}
</script>
