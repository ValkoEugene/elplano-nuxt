<template>
  <Loader v-if="loading" :show-search="true" :show-cards="true" />

  <div v-else>
    <div>
      <WeekInterval @setWeekDates="setWeekDates" />

      <template v-if="isCurrentWeek">
        <p
          class="title task__title"
          :class="[!todayTasks.length ? 'task__title--empty' : '']"
        >
          Сегодня ({{ todayTasks.length }})
        </p>

        <TaskCard
          v-for="task in todayTasks"
          :key="task.id"
          :task="task"
          :events="events"
          :updating="updating"
        />
      </template>

      <p
        class="title task__title"
        :class="[!weekTasks.length ? 'task__title--empty' : '']"
      >
        На неделе ({{ weekTasks.length }})
      </p>

      <TaskCard
        v-for="task in weekTasks"
        :key="task.id"
        :task="task"
        :events="events"
        :updating="updating"
      />

      <p
        class="title task__title"
        :class="[!pastDueTasks.length ? 'task__title--empty' : '']"
      >
        Просроченные ({{ pastDueTasks.length }})
      </p>

      <TaskCard
        v-for="task in pastDueTasks"
        :key="task.id"
        :task="task"
        :events="events"
        :updating="updating"
      />

      <p
        class="title task__title"
        :class="[!comletedTasks.length ? 'task__title--empty' : '']"
      >
        Выполненные ({{ comletedTasks.length }})
      </p>

      <TaskCard
        v-for="task in comletedTasks"
        :key="task.id"
        :task="task"
        :events="events"
        :updating="updating"
      />
    </div>

    <TaskModal :events="events" />

    <AddNew @click="initAddingTask" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Ref } from 'vue-property-decorator'
import moment from '~/plugins/moment.js'
import { Task } from '~/api/tasks.ts'
import eventApi, { Event } from '~/api/events.ts'
import CheckGroup from '~/mixins/CheckGroup.ts'
import ModalEditComponent from '~/components/modal/modal-edit.vue'
import { setWeekDatesPayload } from '~/components/UI-core/week-interal.vue'
import TaskEventBusMixin from '~/components/tasks/task-event-bus-mixin.ts'

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
  }
})
export default class TasksPage extends Mixins(CheckGroup, TaskEventBusMixin) {
  /**
   * Ссылка на экземпляр компонента ModalEdit
   */
  @Ref()
  readonly modalEdit!: ModalEditComponent

  /**
   * Дата начала недели
   */
  startWeek: string = ''

  /**
   * Дата конца недели
   */
  endWeek: string = ''

  /**
   * Список евентов
   */
  events: Event[] = []

  /**
   * Флаг загрузки
   */
  loading: boolean = true

  get startWeekMoment() {
    return moment(this.startWeek, 'DD.MM.YYYY')
  }

  get endWeekMoment() {
    return moment(this.endWeek, 'DD.MM.YYYY')
  }

  /**
   * Список заданий
   */
  get tasks(): Task[] {
    return this.$vuexModules.Tasks.tasks
  }

  /**
   * Флаг обновления
   */
  get updating(): boolean {
    return this.$vuexModules.Tasks.updating
  }

  /**
   * Флаг что сейчас выбрана текущая неделя
   */
  get isCurrentWeek(): boolean {
    const today = moment()

    return today.isSame(this.startWeekMoment, 'week')
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

  /**
   * Задачи на неделе
   */
  get weekTasks(): Task[] {
    return this.tasks.filter(
      (task) =>
        moment(task.expired_at).isAfter(this.startWeekMoment, 'day') &&
        moment(task.expired_at).isBefore(
          this.endWeekMoment.clone().add(1, 'day'),
          'day'
        )
    )
  }

  /**
   * Завершенные задачи за неделю
   * TODO
   */
  get comletedTasks(): Task[] {
    return []
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

  /**
   * Загрузить данные
   */
  async loadData() {
    try {
      const [eventsData] = await Promise.all([
        eventApi.loadData(),
        this.$vuexModules.Tasks.loadTasks()
      ])
      this.events = eventsData.data

      this.loading = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Инициализация создания нового задания
   */
  initAddingTask() {
    this.addNewTaskEmit()
  }

  /**
   * Установить данные о недели
   */
  setWeekDates(weekDates: setWeekDatesPayload) {
    this.startWeek = weekDates.startWeek
    this.endWeek = weekDates.endWeek
  }
}
</script>

<style scoped>
.task__title {
  font-weight: 500;
  color: var(--primary-base) !important;
}

.task__title.task__title--empty {
  color: rgba(0, 0, 0, 0.25) !important;
}
</style>
