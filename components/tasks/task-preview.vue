<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Task } from '~/api/tasks.ts'
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
}
</script>
