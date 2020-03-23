<template>
  <div v-if="loading" class="content__progress">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <div>
      {{ formatedDate }}
    </div>

    <div class="title">
      {{ task.title }}
    </div>

    <div class="content__item">
      {{ taskEventTitle }}
    </div>

    <div v-if="task.description" class="mt-3">
      <v-divider />
      <TextEditorView :value="task.description" />
    </div>

    <div v-if="completed">
      <v-divider class="mt-3 mb-3" />

      <div class="content__item">
        {{ $t('field.report') }}: {{ completedInfo.report || '-' }}
      </div>

      <div v-if="completedInfo.extra_links.length">
        <div class="content__item mt-3">{{ $t('field.links') }}</div>

        <template v-for="(link, index) in completedInfo.extra_links">
          <a
            :key="link + `--${index}`"
            :href="link"
            target="_blank"
            class="item__link"
          >
            {{ link }}
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Task, Assignment, taskApi } from '~/api/tasks.ts'
import { Event } from '~/api/events.ts'
import moment from '~/plugins/moment'

@Component({
  components: {
    TextEditorView: () =>
      import(
        '~/components/UI-core/text-editor-view.vue' /* webpackChunkName: 'components/UI-core/text-editor-view' */
      )
  }
})
export default class TaskPreview extends Vue {
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
   * Флаг что задача выполненна
   */
  @Prop({ type: Boolean, default: false })
  readonly completed: boolean

  /**
   * Флаг загрузки
   */
  loading: boolean = false

  /**
   * Информация о завершение задачи
   */
  completedInfo: Assignment = {
    accomplished: true,
    report: '',
    extra_links: []
  }

  /**
   * Отображения элемента расписания задачи
   */
  get taskEventTitle(): string {
    const event = this.events.find((event) => event.id === this.task.event_id)
    return event ? event.title : ''
  }

  /**
   * Отображение даты завершения
   */
  get formatedDate(): string {
    return moment(this.task.expired_at).format('DD.MM.YYYY')
  }

  mounted() {
    if (this.completed) this.loadCompletedInfo()
  }

  /**
   * Загрузить информацию о выполненной задаче
   */
  async loadCompletedInfo() {
    try {
      this.loading = true
      this.completedInfo = await taskApi.getCompletedInfo(this.task.id!)
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.content__item {
  font-size: 1rem;
}

.item__link {
  display: block;
}

.content__progress {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
