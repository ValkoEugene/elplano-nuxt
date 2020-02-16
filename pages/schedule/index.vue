<template>
  <div>
    <Loader v-if="loading" :show-search="true" :show-cards="true" />

    <div v-else>
      <Events
        :events="events"
        :updating="updating"
        @edit="edit"
        @deleteEvent="deleteEvent"
        @initWeekDayItems="initWeekDayItems"
      />

      <ModalEdit
        ref="modalEdit"
        :edit-model="editModel"
        :edit-schema="editSchema"
        :updating="updating"
        :watch-model-change="true"
        @create="create"
        @update="update"
        @modelChange="onModelChange"
      />

      <AddNew :president-access="false" @click="edit(eventEmptyTemplate)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Ref } from 'vue-property-decorator'
import eventApi, { Event } from '~/api/events.ts'
import CoursesList from '~/mixins/CoursesList.ts'
import CheckGroup from '~/mixins/CheckGroup.ts'
import { WeekDayItem } from '~/components/events/events.vue'
import ModalEditComponent from '~/components/modal/modal-edit.vue'
import { Label } from '~/api/labels.ts'

interface IncludedData {
  id: string
  type: string
  attributes: Label
}

@Component({
  components: {
    Events: () =>
      import(
        '~/components/events/events.vue' /* webpackChunkName: 'components/events/events' */
      ),
    Loader: () =>
      import(
        '~/components/UI-core/loaders/loader.vue' /* webpackChunkName: 'components/UI-core/loaders/loader' */
      ),
    ModalEdit: () =>
      import(
        '~/components/modal/modal-edit.vue' /*  webpackChunkName: 'components/modal/modal-edit' */
      ),
    AddNew: () =>
      import(
        '~/components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
      )
  }
})
export default class EventsPage extends Mixins(CoursesList, CheckGroup) {
  /**
   * Ссылка на экземпляр компонента ModalEdit
   * @type {ModalEditComponent}
   */
  @Ref()
  readonly modalEdit!: ModalEditComponent

  /**
   * Модель элемента расписания
   */
  eventEmptyTemplate: Event = {
    id: '',
    course_id: '',
    title: '',
    description: '',
    start_at: '',
    end_at: '',
    eventable_type: 'student',
    eventable_id: '',
    label_ids: [],
    by_day: [],
    recurrence: [],
    timezone: ''
  }

  /**
   * Редактируемая модель
   */
  editModel: Event = { ...this.eventEmptyTemplate }

  /**
   * Список дней недели
   */
  weekDayItems: WeekDayItem[] = []

  /**
   * Список с расписанием
   */
  events: Event[] = []

  /**
   * Флаг загрузки расписания
   */
  loadingEvents: boolean = true

  /**
   * Флаг обновления
   */
  updating: boolean = false

  /**
   * Флаг загрузки
   */
  get loading() {
    return this.loadingCourses || this.loadingEvents
  }

  /**
   * Типы событий
   */
  get eventableTypeOptions() {
    const types: { label: string; value: string }[] = []

    if (this.$vuexModules.User.isPresident) {
      types.push({ label: 'Для всей группы', value: 'group' })
    }

    types.push({ label: 'Собственное', value: 'student' })

    return types
  }

  /**
   * Схема на редактирование
   * @type {Object}
   */
  get editSchema() {
    return {
      fields: [
        {
          model: 'eventable_type',
          type: 'v-radio-group',
          row: true,
          options: this.eventableTypeOptions
        },
        {
          type: 'tags',
          model: 'label_ids'
        },
        {
          type: 'v-text-field',
          model: 'title',
          label: this.$t('field.title'),
          placeholder: this.$t('field.title'),
          rules: [this.$rules.required],
          inputType: 'text'
        },
        {
          model: 'course_id',
          type: 'v-select',
          multiple: false,
          items: this.courses,
          itemValue: 'id',
          itemText: 'title',
          rules: [this.$rules.required],
          label: this.$t('lesson.lesson')
        },
        {
          type: 'v-text-field',
          model: 'description',
          label: this.$t('field.description'),
          placeholder: this.$t('field.description'),
          inputType: 'text'
        },
        {
          type: 'datepicker',
          model: 'start_at',
          label: this.$t('field.startAt'),
          rules: [this.$rules.required]
        },
        {
          type: 'datepicker',
          model: 'end_at',
          label: this.$t('field.endAt'),
          rules: [this.$rules.required]
        },
        // Вариант с выбором даты и время отдельно
        // {
        //   type: 'time',
        //   model: 'time',
        //   label: this.$t('field.time'),
        //   rules: [this.$rules.required]
        // },
        // {
        //   type: 'date',
        //   model: 'start_at',
        //   label: this.$t('field.startAt'),
        //   rules: [this.$rules.required]
        // },
        // {
        //   type: 'date',
        //   model: 'end_at',
        //   label: this.$t('field.endAt'),
        //   rules: [this.$rules.required]
        // },
        {
          model: 'by_day',
          type: 'v-select',
          items: this.weekDayItems,
          rules: [this.$rules.required],
          multiple: true,
          itemValue: 'value',
          itemText: 'view',
          label: this.$t('field.daysOfWeek')
        }
      ]
    }
  }

  mounted() {
    if (!this.$vuexModules.User.isAdmin) {
      this.loadEvents()
    }
  }

  /**
   * Инициализируем список дней
   */
  initWeekDayItems(weekDayItems: WeekDayItem[]) {
    this.weekDayItems = weekDayItems
  }

  /**
   * Редактировать расписание
   */
  edit(model: Event) {
    const data = { ...model }

    if (!data.id) {
      data.eventable_id = this.$vuexModules.User.userInfo.id
    }

    this.editModel = data

    this.modalEdit.open()
  }

  /**
   * Сохранить эвент
   */
  save(data: Event) {
    data.id ? this.update(data) : this.create(data)
  }

  /**
   * Загрузить расписание
   */
  async loadEvents() {
    try {
      const response = await eventApi.loadData()

      const events = response.data
      const included = response.included as IncludedData[]
      const labels = included.map(({ id, attributes }) => ({
        id,
        ...attributes
      }))

      this.events = events
      this.$vuexModules.Labels.SET_LABELS(labels)
      this.loadingEvents = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Создать эвент
   */
  async create(data: Event) {
    try {
      this.updating = true

      const event = await eventApi.create(data)
      this.events.push(event)
      this.editModel = event
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Обновить эвент
   */
  async update(data: Event) {
    if (!data.id) return

    try {
      this.updating = true

      const event = await eventApi.update(data, data.id)
      this.events = this.events.map((item) =>
        item.id === event.id ? event : item
      )
      this.editModel = event
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Удалить эвент
   * @type {Function}
   * @param {String} id - id предмета
   */
  async deleteEvent(id: string) {
    try {
      this.updating = true

      await eventApi.deleteById(id)
      this.events = this.events.filter((item) => item.id !== id)
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Следим за изменением модели редактируемого элемента расписания
   * (при изменение типа эвента подставляем id)
   */
  onModelChange(model: Event) {
    const ids = {
      student: this.$vuexModules.User.userInfo.id,
      group: this.$vuexModules.Group.groupId
    } as { student: string; group: string }

    const eventable_id = ids[model.eventable_type]

    if (model.eventable_id !== eventable_id) {
      model.eventable_id = eventable_id
    }
  }
}
</script>
