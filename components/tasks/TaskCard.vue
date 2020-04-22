<!-- Карточка с заданием -->

<template>
  <div class="task-card__wrapper">
    <Card class="mb-5 task__card" small @click.native="viewTaskEmit(task)">
      <template #title>
        {{ task.title }}
      </template>

      <template #badges>
        <span v-if="isOwnTask">
          {{ $t('events.own') }}
        </span>
      </template>

      <template v-if="taskEventTitle" #content>
        <p class="mb-0">
          <span v-if="showDayTag" class="bold">{{ dayTagDate + ' | ' }}</span>
          {{ taskEventTitle }}
        </p>
      </template>

      <template #menu>
        <v-list-item
          class="text-primary"
          :disabled="updating"
          icon
          @click.stop="viewTaskEmit(task)"
        >
          <v-icon class="pr-2">visibility</v-icon>
          {{ $t('actions.preview') }}
        </v-list-item>

        <v-list-item
          v-if="!completed"
          class="text-primary"
          :disabled="updating"
          icon
          @click.stop="completeTask(task.id)"
        >
          <v-icon class="pr-2">done</v-icon>
          {{ $t('ui.complete') }}
        </v-list-item>

        <v-list-item
          v-else
          class="text-primary"
          :disabled="updating"
          icon
          @click.stop="retrieveTask(task.id)"
        >
          <v-icon class="pr-2">undo</v-icon>
          {{ $t('actions.retrieve') }}
        </v-list-item>

        <EditButton
          v-if="isOwnTask"
          :disabled="updating"
          :president-access="false"
          @click.stop="editTaskEmit(task)"
        />

        <DeleteButton
          v-if="isOwnTask"
          :id="task.id"
          :disabled="updating"
          :president-access="false"
          :confirm-text="$t('tasks.confirm')"
          @click.native.stop="() => {}"
          @delete="deleteTask(task.id)"
        />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { Task, Assignment, taskApi } from '~/api/tasks.ts'
import { Event } from '~/api/events.ts'
import moment from '~/plugins/moment.js'
import { useTaskEventBus } from '~/components/tasks/useTaskEventBus.ts'

const components = {
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

interface PropsI {
  /** Задание  */
  task: Task
  /** Элементы расписания */
  events: Event[]
  /** Флаг процесса обновления  */
  updating: boolean
  /** Флаг показа тега с датой  */
  showDayTag: boolean
  /** Флаг что задача выполненна  */
  completed: boolean
}

export default defineComponent({
  name: 'TaskCard',
  components,
  props: {
    task: {
      type: Object as () => Task,
      required: true
    },
    events: {
      type: Array as () => Event[],
      required: true
    },
    updating: {
      type: Boolean,
      required: true
    },
    showDayTag: {
      type: Boolean,
      default: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  setup(props: PropsI, context) {
    const { viewTaskEmit, editTaskEmit } = useTaskEventBus(context)

    /** Дата для тега */
    const dayTagDate = computed(() =>
      moment(props.task.expired_at).format('DD.MM.YYYY')
    )
    /** Отображения элемента расписания задачи */
    const taskEventTitle = computed(() => {
      const event = props.events.find(
        (event) => event.id === props.task.event_id
      )
      return event ? event.title : ''
    })
    /** Флаг что задание назначенно студентом самому себе */
    const isOwnTask = computed(() => {
      const event = props.events.find(
        (event) => event.id === props.task.event_id
      )

      if (!event) return false

      return (
        event.creator_student_id ===
        context.root.$vuexModules.User.studentInfo.id
      )
    })

    /** Удалить задание */
    const deleteTask = (id: string) => {
      context.root.$vuexModules.Tasks.deleteTask(id)
    }

    /** Выполнить задание */
    const completeTask = (id: string) => {
      context.emit('taskComplete', id)
    }

    /**
     * Вернуть в работу
     */
    const retrieveTask = async (id: string) => {
      try {
        const assignment: Assignment = await taskApi.getCompletedInfo(id)
        assignment.accomplished = false

        await taskApi.complete(id, assignment)

        if (
          context.root.$vuexModules.Tasks.tasks.some((task) => task.id === id)
        ) {
          context.root.$vuexModules.Tasks.REMOVE_TASK(id)
        }
      } catch (error) {
        context.root.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      }
    }

    return {
      dayTagDate,
      taskEventTitle,
      isOwnTask,
      viewTaskEmit,
      editTaskEmit,
      deleteTask,
      completeTask,
      retrieveTask
    }
  }
})
</script>

<style scoped>
.task-card__wrapper {
  /* min-height: 200px; */
  display: flex;
  /* margin-left: 25px; */
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
