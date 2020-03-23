<template>
  <v-form ref="form" :lazy-validation="true">
    <v-text-field
      v-model.trim="localModel.title"
      :label="$t('field.title')"
      :rules="[$rules.required]"
      type="text"
      outlined
    />
    <v-select
      v-model="localModel.event_id"
      :items="availableEvents"
      item-value="id"
      item-text="title"
      :label="$t('events.eventsLabel')"
      :rules="[$rules.required]"
      :chips="false"
      :multiple="false"
      outlined
      attach
    />

    <Date
      v-model.trim="localModel.expired_at"
      :label="$t('field.endAt')"
      :rules="[$rules.required]"
    />

    <v-radio-group v-if="isPresident" v-model="grouped" row>
      <v-radio :label="$t('ui.grouped')" :value="true" />
      <v-radio :label="$t('ui.own')" :value="false" />
    </v-radio-group>

    <StudentsSelect
      v-if="isPresident && grouped"
      v-model="localModel.student_ids"
    />

    <TextEditor v-model="localModel.description" />
  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop, Watch } from 'vue-property-decorator'
import { Task } from '~/api/tasks.ts'
import { Event } from '~/api/events.ts'
import { TaskQuery } from '~/components/tasks/task-tabs.vue'
import moment from '~/plugins/moment'

@Component({
  components: {
    StudentsSelect: () =>
      import(
        '~/components/UI-core/students-select.vue' /* webpackChunkName: 'components/UI-core/students-select' */
      ),
    TextEditor: () =>
      import(
        '~/components/UI-core/text-editor.vue' /* webpackChunkName: 'components/UI-core/text-editor' */
      ),
    Date: () =>
      import(
        '~/components/UI-core/date.vue' /* webpackChunkName: 'components/UI-core/date' */
      )
  }
})
export default class TaskForm extends Vue {
  /**
   * Ссылка на компонент формы из vuetify
   */
  @Ref()
  readonly form: { validate: () => boolean }

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
   * Локальная модель Задания
   */
  localModel: Task = { ...this.task }

  /**
   *
   */
  grouped: boolean = true

  /**
   * Флаг что текущий полььзователь староста
   */
  get isPresident(): boolean {
    return this.$vuexModules.User.isPresident
  }

  /**
   * Доступные для выбора элементы расписания
   * Для старосты все
   * Для студентов только собственные
   */
  get availableEvents() {
    if (this.$vuexModules.User.isPresident) return this.events

    const studentId = this.$vuexModules.User.studentInfo.id

    return this.events.filter(
      (event: Event): boolean =>
        event.eventable_type === 'student' || event.eventable_id === studentId
    )
  }

  @Watch('grouped')
  onGroupedChange() {
    if (!this.grouped)
      this.localModel.student_ids = [this.$vuexModules.User.studentInfo.id]
    else this.localModel.student_ids = []
  }

  mounted() {
    if (this.isPresident || this.localModel.id) return

    this.localModel.student_ids = [this.$vuexModules.User.studentInfo.id]
  }

  /**
   * Сохранение Задания
   */
  async save() {
    if (!this.form.validate()) return

    const savedTask = this.localModel.id
      ? await this.$vuexModules.Tasks.updateTask(this.localModel)
      : await this.$vuexModules.Tasks.createTask(this.localModel)

    if (!savedTask) return

    // Проверяем попадает ли созданное задание под текущий фильтр
    if (!this.localModel.id) {
      const taskType = this.$route.query.tab
      if (
        taskType === TaskQuery.today &&
        moment().isSame(savedTask.expired_at, 'day')
      ) {
        this.$vuexModules.Tasks.ADD_TASK(savedTask)
      } else if (
        taskType === TaskQuery.tomorrow &&
        moment()
          .add(1, 'd')
          .isSame(savedTask.expired_at, 'day')
      ) {
        this.$vuexModules.Tasks.ADD_TASK(savedTask)
      } else if (
        taskType === TaskQuery.upcoming &&
        moment()
          .add(1, 'd')
          .isBefore(moment(savedTask.expired_at))
      ) {
        this.$vuexModules.Tasks.ADD_TASK(savedTask)
      }
    }

    if (!this.localModel.id) this.$emit('createdTask')

    this.localModel = { ...savedTask }
  }
}
</script>
