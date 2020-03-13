<template>
  <div v-card-scroll:200="checkDataAppending">
    <!-- <client-only> -->
    <!-- <div
        v-infinite-scroll="loadTasks"
        infinite-scroll-disabled="disabledInfinitScroll"
        infinite-scroll-distance="10"
        infinite-scroll-throttle-delay="500"
        infinite-scroll-immediate-check="false"
      > -->
    <div>
      <template v-if="tasks.length">
        <template v-if="isToday">
          <div class="date-title">{{ todayDate }}</div>

          <TaskCard
            v-for="task in todayTasks"
            :key="task.id"
            :show-day-tag="false"
            :task="task"
            :events="events"
            :updating="updating"
          />
        </template>

        <template v-if="isTomorrow">
          <div class="date-title">{{ tomorrowDate }}</div>

          <TaskCard
            v-for="task in tomorrowTasks"
            :key="task.id"
            :show-day-tag="false"
            :task="task"
            :events="events"
            :updating="updating"
          />
        </template>

        <template v-if="isSoon">
          <TaskCard
            v-for="task in soonTasks"
            :key="task.id"
            :task="task"
            :events="events"
            :updating="updating"
          />
        </template>

        <template v-if="isCompleted">
          <TaskCard
            v-for="task in comletedTasks"
            :key="task.id"
            :task="task"
            :events="events"
            :updating="updating"
          />
        </template>

        <template v-if="isPastDue">
          <TaskCard
            v-for="task in pastDueTasks"
            :key="task.id"
            :task="task"
            :events="events"
            :updating="updating"
          />
        </template>
      </template>

      <TaskModal :events="events" />

      <AddNew :president-access="false" @click="initAddingTask" />
    </div>

    <Loader v-if="taskLoading" :show-form="true" :form-inputs-count="9" />
    <!-- </client-only> -->
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Watch } from 'vue-property-decorator'
// import infiniteScroll from 'vue-infinite-scroll'
import moment from '~/plugins/moment.js'
import { Task } from '~/api/tasks.ts'
import eventApi, { Event } from '~/api/events.ts'
import CheckGroup from '~/mixins/CheckGroup.ts'
import ModalEditComponent from '~/components/modal/modal-edit.vue'
import TaskEventBusMixin from '~/components/tasks/task-event-bus-mixin.ts'
import { TaskQuery } from '~/components/tasks/task-tabs.vue'
import cardScroll from '~/directives/card-scroll.js'

@Component({
  components: {
    TaskModal: () =>
      import(
        '~/components/tasks/task-modal.vue' /* webpackChunkName: 'components/tasks/task-modal' */
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
    // infiniteScroll
  }
})
export default class TasksPage extends Mixins(CheckGroup, TaskEventBusMixin) {
  /**
   * Ссылка на экземпляр компонента ModalEdit
   */
  @Ref()
  readonly modalEdit!: ModalEditComponent

  /**
   * Список евентов
   */
  events: Event[] = []

  /**
   * Флаг загрузки
   */
  loading: boolean = true

  /**
   *
   */
  event_id: string = ''

  /**
   *
   */
  page: number = 1

  /**
   * Список заданий
   */
  get tasks(): Task[] {
    return this.$vuexModules.Tasks.tasks
  }

  /**
   * Флаг
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

  get appending(): boolean {
    return this.$vuexModules.Tasks.appending
  }

  get todayDate(): string {
    return moment().format('dddd: DD MMMM YYYY')
  }

  get tomorrowDate(): string {
    return moment()
      .add(1, 'day')
      .format('dddd: DD MMMM YYYY')
  }

  /**
   *
   */
  get taskType(): TaskQuery {
    const tab = this.$route.query.tab

    switch (tab) {
      case TaskQuery.today:
        return TaskQuery.today
      case TaskQuery.tomorrow:
        return TaskQuery.tomorrow
      case TaskQuery.pastDue:
        return TaskQuery.pastDue
      case TaskQuery.soon:
        return TaskQuery.soon
      case TaskQuery.comleted:
        return TaskQuery.comleted
      default:
        return TaskQuery.today
    }
  }

  get apiFilters() {
    const filters: any = { limit: 15, page: this.page, appointed: true }
    if (this.event_id) filters.event_id = this.event_id
    if (this.isPastDue) filters.outdated = true
    if (this.isCompleted) filters.accomplished = true

    return { filters }
  }

  get isToday(): boolean {
    return this.taskType === TaskQuery.today
  }

  get isTomorrow(): boolean {
    return this.taskType === TaskQuery.tomorrow
  }

  get isSoon(): boolean {
    return this.taskType === TaskQuery.soon
  }

  get isCompleted(): boolean {
    return this.taskType === TaskQuery.comleted
  }

  get isPastDue(): boolean {
    return this.taskType === TaskQuery.pastDue
  }

  /**
   * Просроченные задачи
   */
  get pastDueTasks() {
    return this.tasks.filter((task) =>
      moment(task.expired_at).isBefore(moment(), 'day')
    )
  }

  /**
   * Задачи на сегодня
   */
  get todayTasks(): Task[] {
    return this.tasks.filter((task) =>
      moment(task.expired_at).isSame(moment(), 'day')
    )
  }

  get tomorrowTasks(): Task[] {
    return this.tasks.filter((task) =>
      moment(task.expired_at).isSame(moment().add(1, 'day'), 'day')
    )
  }

  /**
   * Задачи на неделе
   */
  get soonTasks(): Task[] {
    return this.tasks.filter((task) =>
      moment(task.expired_at).isAfter(moment().add(2, 'day'), 'day')
    )
  }

  /**
   * Завершенные задачи за неделю
   * TODO
   */
  get comletedTasks(): Task[] {
    return []
  }

  /**
   *
   */
  get allTasksLoaded(): boolean {
    return this.$vuexModules.Tasks.allTaskLoaded
  }

  @Watch('event_id')
  onEventidChange() {
    this.page = 0
    this.appendTasks()
  }

  @Watch('taskType')
  onTaskTypeChange() {
    this.$vuexModules.Tasks.SET_TASKS([])
    this.page = 0
    this.appendTasks()
  }

  mounted() {
    this.loadData()
  }

  /**
   * Отображения элемента расписания задачи
   */
  getTaskEventTitle(task: Task): string {
    const event = this.events.find((event) => event.id === task.event_id)
    return event ? event.title : ''
  }

  checkDataAppending() {
    console.log('checkDataAppending')
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

      this.loading = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   *
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
