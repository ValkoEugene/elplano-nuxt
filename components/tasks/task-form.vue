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

    <v-radio-group
      v-if="isPresident && !localModel.id && !isOwnSelectedEvent"
      v-model="studentsType"
      row
    >
      <v-radio
        v-for="sudentsType in sudentsTypes"
        :key="sudentsType.value"
        :label="sudentsType.view"
        :value="sudentsType.value"
      />
    </v-radio-group>

    <StudentsSelect
      v-if="isPresident && studentsType && !localModel.id"
      v-show="studentsType === 'selectStudents'"
      ref="studentsSelect"
      v-model="localModel.student_ids"
    />

    <TextEditor v-model="localModel.description" />

    <extra-links v-model="localModel.extra_links" class="mt-6" />
  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop, Watch } from 'vue-property-decorator'
import { Task } from '~/api/tasks.ts'
import { Event } from '~/api/events.ts'
import { TaskQuery } from '~/components/tasks/task-tabs.vue'
import moment from '~/plugins/moment'
import StudentsSelect from '~/components/UI-core/students-select.vue'

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
      ),
    ExtraLinks: () =>
      import(
        '~/components/UI-core/fields/extra-links.vue' /* webpackChunkName: 'components/UI-core/fields/extra-links'  */
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
   * Ссылка на компонент с выбором сотрудников
   */
  @Ref()
  readonly studentsSelect: StudentsSelect

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
   * Тип выбранных студентов
   */
  studentsType: string = 'own'

  /**
   * Флаг что текущий пользователь староста
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

  /**
   * Типы для выбора студентов
   */
  get sudentsTypes() {
    return [
      { value: 'own', view: this.$t('ui.own') },
      { value: 'selectStudents', view: this.$t('ui.studentSelection') }
    ]
  }

  /**
   * Флаг что выбранный евент собственный
   */
  get isOwnSelectedEvent(): boolean {
    if (!this.localModel.event_id) return false

    const event = this.events.find(
      (item) => item.id === this.localModel.event_id
    )
    if (!event) return false

    return event.eventable_type === 'student'
  }

  /**
   * При изменении типа актуализируем список студентов
   */
  @Watch('studentsType', { immediate: true })
  onGroupedChange() {
    switch (this.studentsType) {
      case 'selectStudents':
        this.localModel.student_ids = []
        return
      case 'own':
      default:
        this.localModel.student_ids = [this.$vuexModules.User.studentInfo.id]
    }
  }

  mounted() {
    if (!this.localModel.id) {
      if (this.isPresident) this.studentsType = 'own'
      else this.localModel.student_ids = [this.$vuexModules.User.studentInfo.id]
    }
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
