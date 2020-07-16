<template>
  <ModalWrapper
    v-model="visible"
    :action-type="actionType"
    :updating="updating"
    @action="onActionHandler"
    @close="onModalClose"
  >
    <template v-if="contentComponentName" #content>
      <TaskForm
        v-if="contentComponentName === 'TaskForm'"
        ref="taskForm"
        :task="taskModel"
        :events="events"
        @createdTask="closeModal"
        @onSave="visible = false"
      />

      <TaskPreview
        v-if="contentComponentName === 'TaskPreview'"
        :task="taskModel"
        :events="events"
        :completed="completed"
      />
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Prop } from 'vue-property-decorator'
import { Task } from '~/api/tasks.ts'
import TaskEventBusMixin from '~/components/tasks/task-event-bus-mixin.ts'
import TaskForm from '~/components/tasks/task-form.vue'
import { Event } from '~/api/events.ts'

@Component({
  components: {
    ModalWrapper: () =>
      import(
        '~/components/modal/modal-wrapper.vue' /* webpackChunkName: 'components/modal/modal-wrapper' */
      ),
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
   * Флаг что задача выполненна
   */
  @Prop({ type: Boolean, default: false })
  readonly completed: boolean

  /**
   * Флаг показа модального окна
   */
  visible: boolean = false

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

  /**
   * Флаг обновления
   */
  get updating(): boolean {
    return this.$vuexModules.Tasks.updating
  }

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
    this.visible = true
  }

  /**
   * Флаг что задание назначенно студентом самому себе
   */
  checkIsOwnTask(task: Task): boolean {
    const event = this.events.find((event) => event.id === task.event_id)

    if (!event) return false

    return event.creator_student_id === this.$vuexModules.User.studentInfo.id
  }

  /**
   * Посмотреть задание
   */
  viewTask(task: Task) {
    const isOwnTask = this.checkIsOwnTask(task)
    // Для выполненных и назначенных старостой заданий не показываем кнопку редактирования
    const actionType = !this.completed && isOwnTask ? 'edit' : ''

    this.setContent(task, 'TaskPreview', actionType)
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

  /**
   * Закрыть модальное окно
   */
  closeModal() {
    this.visible = false
  }
}
</script>
