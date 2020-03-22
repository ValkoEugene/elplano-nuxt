<!-- Карточка с заданием -->

<template>
  <div class="task-card__wrapper">
    <DayTag v-if="showDayTag" :date="dayTagDate" />

    <Card class="mb-5 task__card" small @click.native="showPreview(task)">
      <template #title>
        {{ task.title }}
      </template>

      <template v-if="taskEventTitle" #content>
        <p class="mb-0">{{ taskEventTitle }}</p>
      </template>

      <template #menu>
        <v-list-item
          v-if="!completed"
          class="text-primary"
          :disabled="updating"
          icon
          @click="completeTask(task.id)"
        >
          <v-icon class="pr-2">done</v-icon>
          {{ $t('ui.complete') }}
        </v-list-item>
        <EditButton :disabled="updating" @click="edit(task)" />
        <DeleteButton
          :id="task.id"
          :disabled="updating"
          :confirm-text="$t('tasks.confirm')"
          @delete="deleteTask(task.id)"
        />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Task } from '~/api/tasks.ts'
import { Event } from '~/api/events.ts'
import moment from '~/plugins/moment.js'
import TaskEventBusMixin from '~/components/tasks/task-event-bus-mixin.ts'

@Component({
  components: {
    DayTag: () =>
      import(
        '~/components/UI-core/day-tag.vue' /* webpackChunkName: 'components/UI-core/day-tag' */
      ),
    TextEditorView: () =>
      import(
        '~/components/UI-core/text-editor-view.vue' /* webpackChunkName: 'components/UI-core/text-editor-view' */
      ),
    DeleteButton: () =>
      import(
        '~/components/UI-core/delete-button.vue' /* webpackChunkName: 'components/UI-core/delete-button' */
      ),
    EditButton: () =>
      import(
        '~/components/UI-core/edit-button.vue' /* webpackChunkName: 'components/UI-core/edit-button' */
      ),
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class TaskCard extends Mixins(TaskEventBusMixin) {
  /**
   * Задание
   */
  @Prop({ type: Object as () => Task, required: true })
  readonly task!: Task

  /**
   * Элементы расписания
   */
  @Prop({ type: Array as () => Event[], required: true })
  readonly events!: Event[]

  /**
   * Флаг процесса обновления
   * (При обновление какого либа задания блокируем кнопки)
   */
  @Prop({ type: Boolean, required: true })
  readonly updating!: boolean

  /**
   * Флаг показа тега с датой
   */
  @Prop({ type: Boolean, default: true })
  readonly showDayTag: boolean

  /**
   * Флаг что задача выполненна
   */
  @Prop({ type: Boolean, default: false })
  readonly completed: boolean

  /**
   * Дата для тега
   */
  get dayTagDate(): string {
    return moment(this.task.expired_at).format('DD.MM.YYYY')
  }

  /**
   * Отображения элемента расписания задачи
   */
  get taskEventTitle(): string {
    const event = this.events.find((event) => event.id === this.task.event_id)
    return event ? event.title : ''
  }

  /**
   * Показать превью задачи
   */
  showPreview(task: Task) {
    this.viewTaskEmit(task)
  }

  /**
   * Удалить задание
   */
  deleteTask(id: string) {
    this.$vuexModules.Tasks.deleteTask(id)
  }

  /**
   * Редактировать задание
   */
  edit(task: Task) {
    this.editTaskEmit(task)
  }

  /**
   * Выполнить задание
   */
  completeTask(id: string) {
    this.$emit('taskComplete', id)
  }
}
</script>

<style scoped>
.task-card__wrapper {
  /* min-height: 200px; */
  display: flex;
  margin-left: 25px;
}

.mobile .task-card__wrapper {
  margin-left: 0;
}

.task__card {
  flex-grow: 1;
  transition: 0.2s;
  cursor: pointer;
}

.task__card:hover {
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12) !important;
}
</style>
