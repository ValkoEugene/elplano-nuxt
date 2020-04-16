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
        :disabled="appending"
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

    <template v-if="appending">
      <v-skeleton-loader
        v-for="i in 2"
        :key="i"
        height="104"
        type="list-item-two-line"
        class="task-card-loader"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ref,
  watch,
  onMounted,
  defineComponent,
  // eslint-disable-next-line import/named
  SetupContext
} from '@vue/composition-api'
import { Task } from '~/api/tasks.ts'
import eventApi, { Event } from '~/api/events.ts'
import { TaskQuery } from '~/components/tasks/task-tabs.vue'
import cardScroll from '~/directives/card-scroll.js'
import TaskComplete from '~/components/tasks/task-complete.vue'
import { VuexModules } from '~/plugins/VuexDecaratorsModules.ts'
import { useTaskEventBus } from '~/components/tasks/useTaskEventBus.ts'

const components = {
  TaskModal: () =>
    import(
      '~/components/tasks/task-modal.vue' /* webpackChunkName: 'components/tasks/task-modal' */
    ),
  TaskComplete: () =>
    import(
      '~/components/tasks/task-complete.vue' /* webpackChunkName: 'components/tasks/task-complete'  */
    ),
  TaskCard: () =>
    import(
      '~/components/tasks/TaskCard.vue' /* webpackChunkName: 'components/tasks/TaskCard' */
    ),
  AddNew: () =>
    import(
      '~/components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
    )
}

const directives = {
  'card-scroll': cardScroll
}

/** Информация о флагах для задач */
const useTaskFlags = (vuexModules: VuexModules) => {
  /** Флаг загрузки данных  */
  const taskLoading = computed(() => vuexModules.Tasks.loading)
  /** Флаг обновления */
  const updating = computed(() => vuexModules.Tasks.updating)
  /** Флаг подгрузки данных */
  const appending = computed(() => vuexModules.Tasks.appending)
  /** Флаг что все задачи загружены */
  const allTasksLoaded = computed(() => vuexModules.Tasks.allTaskLoaded)

  return {
    taskLoading,
    updating,
    appending,
    allTasksLoaded
  }
}

/** Информация о типах задач */
const useTaskTypes = (context: SetupContext) => {
  /** Выбранный тип задач  */
  const taskType = computed(() => {
    const tab = context.root.$route.query.tab

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
  })

  /** Флаг что активный фильтр - Выполненные */
  const isCompleted = computed(() => taskType.value === TaskQuery.comleted)
  /** Флаг что активный фильтр - Выполненные */
  const isOutdated = computed(() => taskType.value === TaskQuery.outdated)

  return {
    taskType,
    isCompleted,
    isOutdated
  }
}

export default defineComponent({
  name: 'TaskPage',
  components,
  directives,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    const { addNewTaskEmit } = useTaskEventBus(context)
    const vuexModules = context.root.$vuexModules

    const { taskLoading, updating, appending, allTasksLoaded } = useTaskFlags(
      vuexModules
    )
    const { taskType, isCompleted, isOutdated } = useTaskTypes(context)

    /** Список событий */
    const events = ref<Event[]>([])
    /** Выбранный евент для фильтрации */
    const filtredEventId = ref<string>('')
    /** Страница для пагинации */
    const page = ref<number>(1)

    /** Список заданий  */
    const tasks = computed(() => vuexModules.Tasks.tasks)

    /** Фильтры для api */
    const apiFilters = computed(() => {
      const filters: any = { limit: 15, page: page.value, appointed: true }

      if (filtredEventId.value) filters.event_id = Number(filtredEventId.value)
      if (!isCompleted.value) filters.expiration = taskType.value
      filters.accomplished = isCompleted.value

      return { filters }
    })

    /** Подгрузить задания */
    const appendTasks = () => {
      page.value += 1
      vuexModules.Tasks.loadTasks(apiFilters.value)
    }
    /** При изменении типа задачи или евента перезагружаем данные */
    watch([taskType, filtredEventId], () => {
      vuexModules.Tasks.SET_TASKS([])
      page.value = 0
      appendTasks()
    })
    /**
     * Проверить необходимость подгрузки данных
     * (При скроле если весь список еще не загружен и запрос еще не отправлен подгружаем)
     */
    const checkDataAppending = () => {
      if (appending.value || allTasksLoaded.value) return

      appendTasks()
    }

    /** Ссылка на экземпляр компонента с выполнением задания */
    const taskCompleteComponent = ref<TaskComplete>(null)
    /** Инициализация выполнения задания */
    const intiTaskComplete = (id: string) => {
      if (!taskCompleteComponent.value) return

      taskCompleteComponent.value.initAssigment(id)
    }

    /** Отображения элемента расписания задачи */
    const getTaskEventTitle = (task: Task) => {
      const event = events.value.find((event) => event.id === task.event_id)
      return event ? event.title : ''
    }

    /**
     * Загрузить данные
     */
    const loadData = async () => {
      try {
        const [eventsData] = await Promise.all([
          eventApi.loadData(),
          vuexModules.Tasks.loadTasks(apiFilters.value)
        ])
        events.value = eventsData.data
      } catch (error) {
        vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      }
    }
    onMounted(() => loadData())

    /** Инициализация создания нового задания */
    const initAddingTask = () => {
      addNewTaskEmit()
    }

    return {
      events,
      filtredEventId,
      tasks,
      taskLoading,
      appending,
      updating,
      taskType,
      isOutdated,
      isCompleted,
      intiTaskComplete,
      getTaskEventTitle,
      checkDataAppending,
      initAddingTask,
      appendTasks,
      apiFilters,
      taskCompleteComponent
    }
  }
})
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
