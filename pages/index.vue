<template>
  <div>
    <div class="d-flex justify-center pa-6">
      <v-btn color="primary" @click="prevWeek">-</v-btn>
      <!-- eslint-disable -->
      <p class="title text-primary px-6">{{ weekDates[0] }} - {{ weekDates[6] }}</p>
      <v-btn color="primary" @click="nextWeek">+</v-btn>
    </div>

    <v-timeline v-if="!loading" dense>
      <template v-for="(day, dayIndex) in daysOfWeekList">
        <v-timeline-item v-if="weekEvents[day].length" :key="day" small>
          <p>{{ getDayView(weekDates[dayIndex]) }}</p>
          <p>{{ weekDates[dayIndex] }}</p>

          <template v-for="event in weekEvents[day]">
            <Event-card
              :id="event.id"
              :key="event.id"
              :event="event"
              :course-id="event.course_id"
              :courses="courses"
              class="ma-6"
              @edit="edit"
            />
          </template>
        </v-timeline-item>
      </template>
    </v-timeline>

    <AddNew @click="edit({ id: '' })" />
  </div>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import { mapState, mapActions } from 'vuex'
import moment, { setLocale } from '../plugins/moment'
import {
  namespace as eventsNamespace,
  Types as eventsTypes
} from '../store/events'
import {
  namespace as coursesNamespace,
  Types as coursesTypes
} from '../store/courses'
import { namespace as i18nNamespace } from '../store/i18n'
import {
  namespace as modalNamespace,
  Types as modalTypes
} from '../store/modal'

export default {
  name: 'IndexPage',
  components: {
    EventCard: () =>
      import(
        '../components/events/event-card.vue' /* webpackChunkName: 'components/events/event-card' */
      ),
    AddNew: () =>
      import(
        '../components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
      )
  },
  data: () => ({
    /**
     * Шаблон для событий по дням недели
     * @type {Object}
     */
    weekEventsTemplate: {
      MO: [],
      TU: [],
      WE: [],
      TH: [],
      FR: [],
      SA: [],
      SU: []
    },

    /**
     * События недели
     * @type {Object}
     */
    weekEvents: {
      MO: [],
      TU: [],
      WE: [],
      TH: [],
      FR: [],
      SA: [],
      SU: []
    },

    /**
     * Список дней недели (нужен т.к. объект не гарантирует порядок прохода по свойствам)
     * @type {[String]}
     */
    daysOfWeekList: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],

    /**
     * Список с датами на неделю
     * @type {[Date]}
     */
    weekDates: [],

    /**
     * Дата начала недели
     * @type {import('moment').Moment}
     */
    startWeekDate: moment().startOf('week'),

    /**
     * Дата завершения недели
     * @type {import('moment').Moment}
     */
    endWeekDate: moment().endOf('week'),

    /**
     * Модель элемента расписания
     * @type {Object}
     */
    eventEmptyTemplate: {
      id: '',
      title: '',
      description: '',
      start_at: '',
      end_at: ''
    },

    weekDayItems: []
  }),
  computed: {
    ...mapState(i18nNamespace, [
      /**
       * Текушая локаль
       * @type {('ru' | 'en')}
       */
      'locale'
    ]),

    ...mapState(eventsNamespace, {
      /**
       * Флаг загркзки
       * @type {Boolean}
       */
      loadingEvents: 'loading',
      /**
       * Список с расписанием
       * @type {Array}
       */
      events: 'events'
    }),

    ...mapState(coursesNamespace, {
      /**
       * Предметы
       * @type {Array}
       */
      courses: 'courses',
      /**
       * Флаг загрузки предметов
       * @type {Boolean}
       */
      loadingCources: 'loading'
    }),

    /**
     * Флаг загрузки
     * @type {Boolean}
     */
    loading() {
      return this.loadingCources || this.loadingEvents
    },

    /**
     *
     */
    editSchema() {
      return {
        fields: [
          {
            type: 'v-text-field',
            model: 'title',
            label: this.$t('field.title'),
            placeholder: this.$t('field.title'),
            rules: [this.$rules.required],
            inputType: 'text'
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
            itemValue: 'value',
            itemText: 'view',
            label: this.$t('field.daysOfWeek')
          }
        ]
      }
    }
  },
  watch: {
    /**
     * Ждем пока все данные загрузятся
     */
    loading() {
      this.initWeekData({
        startWeekDate: this.startWeekDate,
        endWeekDate: this.endWeekDate
      })
    },

    /**
     * При смене локали устанавливаем ее для moment.js
     */
    locale() {
      setLocale(this.locale)
      this.initWeekDayItems()
      this.$forceUpdate()
    }
  },
  mounted() {
    this.initWeekDayItems()
    this.loadEvents()
    this.loadCourses()
  },
  methods: {
    moment,
    /**
     * Инициализация элментов выбора для дней недели
     * @type {Function}
     */
    initWeekDayItems() {
      const weekDayItems = []

      for (let i = 1; i < 8; i++) {
        weekDayItems.push({
          view: moment()
            .isoWeekday(i)
            .format('dddd'),
          value: this.daysOfWeekList[i]
        })
      }

      this.weekDayItems = weekDayItems
    },

    ...mapActions(modalNamespace, {
      /**
       * Инициализация редактирования (открывает модальное окно)
       * @type {Function}
       */
      initEdit: modalTypes.actions.INIT_EDIT
    }),

    ...mapActions(eventsNamespace, {
      /**
       * Загрузить расписание
       * @type {Fucntion}
       */
      loadEvents: eventsTypes.actions.LOAD_EVENTS
    }),

    ...mapActions(coursesNamespace, {
      /**
       * Загрузить предметы
       * @type {Function}
       */
      loadCourses: coursesTypes.actions.LOAD_COURSES
    }),

    /**
     * Редактировать расписание
     * @type {Function}
     * @param {String} id
     */
    edit({ id, model }) {
      this.initEdit({
        id,
        namespace: eventsNamespace,
        editModel: model || this.eventEmptyTemplate,
        editSchema: this.editSchema,
        updateAction: eventsTypes.actions.EDIT_EVENT,
        createAction: eventsTypes.actions.CREATE_EVENT
      })
    },

    /**
     * Получить список дат для недели
     * @param {import('moment').Moment} startWeekDate - начальная дата
     * @return {[String]}
     */
    getWeekDates(startWeekDate) {
      let weekDates = [startWeekDate]

      for (let i = 1; i < 7; i++) {
        weekDates.push(weekDates[weekDates.length - 1].clone().add(1, 'days'))
      }

      weekDates = weekDates.map((date) => date.format('DD.MM.YYYY'))

      return weekDates
    },

    /**
     * Инициализация данных по недели
     * @param {Object} config
     * @param {moment} config.startWeekDate
     * @param {moment} config.endWeekDate
     */
    initWeekData({ startWeekDate, endWeekDate }) {
      // При каждой инициализации сбрасываем weekEvents
      const weekEvents = clonedeep(this.weekEventsTemplate)

      // Пробегаем по событиям и ищем актуальные
      this.events.forEach((event) => {
        const { start_at, end_at, by_day } = event

        // Проверяем актуальность событий
        if (
          moment(start_at).isAfter(endWeekDate) ||
          moment(end_at).isBefore(startWeekDate)
        ) {
          return
        }

        by_day.forEach((day) => {
          weekEvents[day].push(event)
        })
      })

      const weekDates = this.getWeekDates(startWeekDate)

      this.endWeekDate = endWeekDate
      this.startWeekDate = startWeekDate
      this.weekEvents = weekEvents
      this.weekDates = weekDates
    },

    /**
     * Перейти на неделю назад
     * @type {Funciotn}
     */
    prevWeek() {
      this.setNewWeek(this.startWeekDate.clone().subtract(7, 'days'))
    },

    /**
     * Перейти на неделю вперёд
     * @type {Funciotn}
     */
    nextWeek() {
      this.setNewWeek(this.startWeekDate.clone().add(7, 'days'))
    },

    /**
     * Вычеслить расписание для заданной недели
     * @type {Funciotn}
     */
    setNewWeek(startWeekDate) {
      const endWeekDate = startWeekDate.clone().endOf('week')

      this.initWeekData({ startWeekDate, endWeekDate })
    },

    /**
     * Получить отображение дня
     * @param {Date} date
     * @return {String}
     */
    getDayView(date) {
      return moment(date, 'DD.MM.YYYY').format('dddd')
    }
  }
}
</script>
