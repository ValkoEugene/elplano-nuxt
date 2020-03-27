<template>
  <div v-card-scroll:200="checkDataAppending">
    <div>
      <v-select
        v-model="filtredEventId"
        :items="events"
        item-value="id"
        item-text="title"
        :label="$t('events.eventsLabel')"
        :chips="false"
        :multiple="false"
        :disabled="taskLoading"
        attach
        solo
        clearable
      />

      <template v-if="tasks.length">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :events="events"
          :updating="updating"
          :disabled="updating"
          :show-day-tag="isOutdated || isCompleted"
          :completed="isCompleted"
          @taskComplete="intiTaskComplete"
        />
      </template>

      <v-alert v-if="!tasks.length && !taskLoading" type="info" prominent>
        <span>{{ $t('tasks.empty') }}</span>
      </v-alert>

      <TaskModal :events="events" :completed="isCompleted" />

      <TaskComplete ref="taskCompleteComponent" />

      <AddNew :president-access="false" @click="initAddingTask" />
    </div>

    <template v-if="taskLoading">
      <v-skeleton-loader
        v-for="i in 7"
        :key="i"
        height="104"
        type="list-item-two-line"
        class="task-card-loader"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Watch } from 'vue-property-decorator'
import { Task } from '~/api/tasks.ts'
import eventApi, { Event } from '~/api/events.ts'
import CheckGroup from '~/mixins/CheckGroup.ts'
import ModalEditComponent from '~/components/modal/modal-edit.vue'
import TaskEventBusMixin from '~/components/tasks/task-event-bus-mixin.ts'
import { TaskQuery } from '~/components/tasks/task-tabs.vue'
import cardScroll from '~/directives/card-scroll.js'
import TaskComplete from '~/components/tasks/task-complete.vue'

@Component({
  components: {
    TaskModal: () =>
      import(
        '~/components/tasks/task-modal.vue' /* webpackChunkName: 'components/tasks/task-modal' */
      ),
    TaskComplete: () =>
      import(
        '~/components/tasks/task-complete.vue' /* webpackChunkName: 'components/tasks/task-complete'  */
      ),
    WeekInterval: () =>
      import(
        '~/components/UI-core/week-interal.vue' /* webpackChunkName: 'components/UI-core/week-interal' */
      ),
    Loader: () =>
      import(
        '~/components/UI-core/loaders/loader.vue' /* webpackChunkName: 'components/UI-core/loaders/loader' */
      ),
    TaskCard: () =>
      import(
        '~/components/tasks/TaskCard.vue' /* webpackChunkName: 'components/tasks/TaskCard' */
      ),
    Search: () =>
      import(
        '~/components/UI-core/search.vue' /* webpackChunkName: 'components/UI-core/search' */
      ),
    AddNew: () =>
      import(
        '~/components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
      ),
    ModalEdit: () =>
      import(
        '~/components/modal/modal-edit.vue' /*  webpackChunkName: 'components/modal/modal-edit' */
      )
  },
  directives: {
    'card-scroll': cardScroll
  }
})
export default class TasksPage extends Mixins(CheckGroup, TaskEventBusMixin) {
  /**
   * Ссылка на экземпляр компонента ModalEdit
   */
  @Ref()
  readonly modalEdit!: ModalEditComponent

  /**
   * Ссылка на экземпляр компонента с выполнением задания
   */
  @Ref()
  readonly taskCompleteComponent!: TaskComplete

  /**
   * Список евентов
   */
  events: Event[] = []

  /**
   * Выбранный евент для фильтрации
   */
  filtredEventId: string = ''

  /**
   * Страница для пагинации
   */
  page: number = 1

  /**
   * Список заданий
   */
  get tasks(): Task[] {
    return this.$vuexModules.Tasks.tasks
  }

  /**
   * Флаг загрузки данных
   */
  get taskLoading(): boolean {
    return this.$vuexModules.Tasks.loading
  }

  /**
   * Флаг обновления
   */
  get updating(): boolean {
    return this.$vuexModules.Tasks.updating
  }

  /**
   * Флаг подгрузки данных
   */
  get appending(): boolean {
    return this.$vuexModules.Tasks.appending
  }

  /**
   * Выбранный тип задач
   */
  get taskType(): TaskQuery {
    const tab = this.$route.query.tab

    switch (tab) {
      case TaskQuery.today:
        return TaskQuery.today
      case TaskQuery.tomorrow:
        return TaskQuery.tomorrow
      case TaskQuery.outdated:
        return TaskQuery.outdated
      case TaskQuery.upcoming:
        return TaskQuery.upcoming
      case TaskQuery.comleted:
        return TaskQuery.comleted
      default:
        return TaskQuery.today
    }
  }

  /**
   * Фильтры для запросов к api
   */
  get apiFilters() {
    const filters: any = { limit: 15, page: this.page, appointed: true }
    if (this.filtredEventId) filters.event_id = Number(this.filtredEventId)
    if (!this.isCompleted) filters.expiration = this.taskType
    filters.accomplished = this.isCompleted

    return { filters }
  }

  /**
   * Флаг что активный фильтр - Выполненные
   */
  get isCompleted(): boolean {
    return this.taskType === TaskQuery.comleted
  }

  /**
   * Флаг что активный фильтр - Просроченные
   */
  get isOutdated(): boolean {
    return this.taskType === TaskQuery.outdated
  }

  /**
   * Флаг что все задачи загружены
   */
  get allTasksLoaded(): boolean {
    return this.$vuexModules.Tasks.allTaskLoaded
  }

  /**
   * При смене евента сбрасываем задачи и подгружаем актуальный список
   */
  @Watch('filtredEventId')
  onEventidChange() {
    this.$vuexModules.Tasks.SET_TASKS([])
    this.page = 0
    this.appendTasks()
  }

  /**
   * При смене типа задачи сбрасываем задачи и подгружаем актуальный список
   */
  @Watch('taskType', { immediate: true })
  onTaskTypeChange() {
    this.$vuexModules.Tasks.SET_TASKS([])
    this.page = 0
    this.appendTasks()
  }

  mounted() {
    this.loadData()
  }

  /**
   * Инициализация выполнения задания
   */
  intiTaskComplete(id: string) {
    this.taskCompleteComponent.initAssigment(id)
  }

  /**
   * Отображения элемента расписания задачи
   */
  getTaskEventTitle(task: Task): string {
    const event = this.events.find((event) => event.id === task.event_id)
    return event ? event.title : ''
  }

  /**
   * Проверить необходимость подгрузки данных
   * (При скроле если весь список еще не загружен и запрос еще не отправлен подгружаем)
   */
  checkDataAppending() {
    if (this.appending || this.allTasksLoaded) return

    this.appendTasks()
  }

  /**
   * Загрузить данные
   */
  async loadData() {
    try {
      const [eventsData] = await Promise.all([
        eventApi.loadData(),
        this.$vuexModules.Tasks.loadTasks(this.apiFilters)
      ])
      this.events = eventsData.data
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Подгрузить задания
   */
  appendTasks() {
    this.page += 1
    this.$vuexModules.Tasks.loadTasks(this.apiFilters)
  }

  /**
   * Инициализация создания нового задания
   */
  initAddingTask() {
    this.addNewTaskEmit()
  }
}
</script>

<style scoped>
.date-title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.54);
}

.mobile .date-title {
  font-size: 1rem;
}
</style>

<style>
.task-card-loader .v-skeleton-loader__list-item-two-line {
  height: 84px;
  padding-left: 10px;
  border-radius: 4px;
}
</style>