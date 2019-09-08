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
        ref="modal"
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

<script>
import Event from '../models/Event'
import Course from '../models/Course'
import checkGroup from '../mixins/checkgroup'

export default {
  name: 'EventsPage',
  components: {
    Events: () =>
      import(
        '../components/events/events.vue' /* webpackChunkName: 'components/events/events' */
      ),
    Loader: () =>
      import(
        '../components/UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      ),
    ModalEdit: () =>
      import(
        '../components/modal/modal-edit.vue' /*  webpackChunkName: 'components/modal/modal-edit' */
      ),
    AddNew: () =>
      import(
        '../components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
      )
  },
  mixins: [checkGroup],
  data: () => ({
    /**
     * Модель элемента расписания
     * @type {Object}
     */
    eventEmptyTemplate: {
      id: '',
      course_id: '',
      title: '',
      description: '',
      start_at: '',
      end_at: '',
      eventable_type: '',
      eventable_id: '',
      by_day: []
    },

    /**
     * Редактируемая модель
     * @type {Object}
     */
    editModel: {},

    /**
     * Список дней недели
     * @type {Array}
     */
    weekDayItems: []
  }),
  computed: {
    /**
     * Список с расписанием
     * @type {Array}
     */
    events() {
      return Event.all()
    },

    /**
     * Предметы
     * @type {Array}
     */
    courses() {
      return Course.all()
    },

    /**
     * Флаг загрузки
     * @type {Boolean}
     */
    loading() {
      return Course.getFetchingStatus() || Event.getFetchingStatus()
    },

    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating() {
      return Event.getUpdatingStatus()
    },

    /**
     * Схема на редактирование
     * @type {Object}
     */
    editSchema() {
      return {
        fields: [
          {
            model: 'eventable_type',
            type: 'v-radio-group',
            row: true,
            options: [
              { label: 'Для всей группы', value: 'group' },
              { label: 'Собственное', value: 'student' }
            ]
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
  },
  mounted() {
    Event.$apiFetch()
    Course.$apiFetch()
  },
  methods: {
    /**
     * Инициализируем список дней
     * @type {Function}
     */
    initWeekDayItems(data) {
      this.weekDayItems = data
    },

    /**
     * Редактировать расписание
     * @type {Function}
     * @param {Object} model - модель редакртируемого эвента
     */
    edit(model) {
      this.editModel = { ...model }

      this.$refs.modal.open()
    },

    /**
     * Создать эвент
     * @type {Function}
     */
    async create(data) {
      const event = await Event.$apiCreate(data)

      this.editModel = event
    },

    /**
     * Обновить эвент
     * @type {Function}
     */
    update(data) {
      Event.$apiUpdate(data)
    },

    /**
     * Удалить эвент
     * @type {Function}
     * @param {String} id - id предмета
     */
    deleteEvent(id) {
      Event.$apiDelete(id)
    },

    /**
     * Следим за изменением модели редактируемого элемента расписания
     * (при изменение типа эвента подставляем id)
     */
    onModelChange(model) {
      const ids = {
        student: this.$store.state.user.userInfo.id,
        group: this.$store.state.group.groupId
      }

      const eventable_id = ids[model.eventable_type]

      if (model.eventable_id !== eventable_id) {
        model.eventable_id = eventable_id
      }
    }
  }
}
</script>
