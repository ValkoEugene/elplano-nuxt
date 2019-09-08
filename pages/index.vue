<template>
  <div>
    <Loader v-if="loading" :show-search="true" :show-cards="true" />

    <div v-else class="events">
      <div class="events__actions">
        <v-btn small dark fab class="bg-primary" @click="prevWeek">
          <v-icon>navigate_before</v-icon>
        </v-btn>

        <p class="title text-primary week-title px-6">
          {{ weekDates[0] }} - {{ weekDates[6] }}
        </p>
        <v-btn small dark fab class="bg-primary" @click="nextWeek">
          <v-icon>navigate_next</v-icon>
        </v-btn>
      </div>

      <template>
        <v-alert v-if="!haveEvents" type="info" prominent>
          <span>{{ $t('events.empty') }}</span>
        </v-alert>

        <template v-else>
          <template v-for="(day, dayIndex) in daysOfWeekList">
            <div v-if="weekEvents[day].length" :key="day" class="day__wrapper">
              <div class="day__date">
                <span class="day__date--ddd">{{
                  getDayView(weekDates[dayIndex], 'ddd')
                }}</span>
                <br />
                <span class="day__date--DD text-primary font-weight-medium">{{
                  getDayView(weekDates[dayIndex], 'DD')
                }}</span>
              </div>

              <div class="day__events">
                <template v-for="event in weekEvents[day]">
                  <Event-card
                    :id="event.id"
                    :key="event.id"
                    :event="event"
                    :updating="updating"
                    class="mb-3"
                    @edit="edit"
                    @delete="deleteEvent"
                  />
                </template>
              </div>
            </div>
          </template>
        </template>
      </template>

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
import clonedeep from 'lodash.clonedeep'
import { mapState } from 'vuex'
import Event from '../models/Event'
import Course from '../models/Course'
import moment, { setLocale } from '../plugins/moment'
import { namespace as i18nNamespace } from '../store/i18n'
import checkGroup from '../mixins/checkgroup'

export default {
  name: 'IndexPage',
  components: {
    EventCard: () =>
      import(
        '../components/events/event-card.vue' /* webpackChunkName: 'components/events/event-card' */
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
      course_id: '',
      title: '',
      description: '',
      start_at: '',
      end_at: '',
      eventable_type: '',
      eventable_id: '',
      by_day: []
    },

    editModel: {},

    weekDayItems: []
  }),
  computed: {
    /**
     * Флаг наличия событий на неделю
     * @type {Boolen}
     */
    haveEvents() {
      for (const day in this.weekEvents) {
        if (this.weekEvents[day].length > 0) return true
      }

      return false
    },

    ...mapState(i18nNamespace, [
      /**
       * Текушая локаль
       * @type {('ru' | 'en')}
       */
      'locale'
    ]),

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
    },

    /**
     * При изменениях переинициализируем расписание
     */
    updating() {
      this.initWeekData({
        startWeekDate: this.startWeekDate,
        endWeekDate: this.endWeekDate
      })
    }
  },
  mounted() {
    console.log('index mouneted')
    this.initWeekDayItems()
    Event.$apiFetch()
    Course.$apiFetch()
  },
  methods: {
    /**
     * Инициализация элментов выбора для дней недели
     * @type {Function}
     */
    initWeekDayItems() {
      const weekDayItems = []

      for (let i = 1; i < 7; i++) {
        weekDayItems.push({
          view: moment()
            .isoWeekday(i)
            .format('dddd'),
          value: this.daysOfWeekList[i - 1]
        })
      }

      this.weekDayItems = weekDayItems
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

      window.scrollTo(0, 0)
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
     * @param {Date} date - дата
     * @param {String} foramt - желаемый формат отображения даты
     * @return {String}
     */
    getDayView(date, format = 'dddd') {
      return moment(date, 'DD.MM.YYYY').format(format)
    }
  }
}
</script>

<style scoped>
.day__wrapper {
  display: flex;
  margin-bottom: 25px;
}

.day__date {
  margin-right: 10px;
}

.day__events {
  display: block;
  flex-grow: 1;
}

.events__actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.events__actions p {
  margin: 0;
}

.day__date--ddd {
  color: rgba(0, 0, 0, 0.25);
}

.day__date--DD {
  font-size: 1.5rem;
}

.mobile .week-title {
  text-align: center;
  font-size: 1rem !important;
}
</style>
