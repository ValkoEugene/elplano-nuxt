<template>
  <div class="events">
    <div class="events__actions">
      <v-btn small dark fab class="white text-primary" @click="prevWeek">
        <v-icon>navigate_before</v-icon>
      </v-btn>

      <p class="title week-title px-6">
        {{ weekDates[0] }} - {{ weekDates[6] }}
      </p>
      <v-btn small dark fab class="white text-primary" @click="nextWeek">
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
                <Card :key="event.id" small class="mb-5">
                  <template
                    v-if="event.eventable_type === 'student'"
                    v-slot:badges
                  >
                    <span>
                      {{ $t('events.own') }}
                    </span>
                  </template>

                  <template v-slot:title>
                    <span class="event__time"
                      >{{ getTime(event.start_at) }} |</span
                    >
                    {{ event.title }}
                  </template>

                  <template v-slot:menu>
                    <v-list-item :disabled="true">
                      <v-icon class="pr-2">star_half</v-icon>
                      {{ $t('ratings.add') }}
                    </v-list-item>
                    <v-list-item :disabled="true">
                      <v-icon class="pr-2">work</v-icon>
                      {{ $t('tasks.add') }}
                    </v-list-item>

                    <EditButton
                      v-if="event.eventable_type === 'student' || isPresidents"
                      :president-access="false"
                      :disabled="updating"
                      @click="edit(event)"
                    />

                    <DeleteButton
                      v-if="event.eventable_type === 'student' || isPresidents"
                      :id="event.id"
                      :disabled="updating"
                      :president-access="false"
                      :confirm-text="$t('events.confirm')"
                      @delete="deleteEvent(event.id)"
                    />
                  </template>
                </Card>
              </template>
            </div>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import { mapState } from 'vuex'
import moment, { setLocale } from '~/plugins/moment'
import { namespace as i18nNamespace } from '~/store/i18n'

export default {
  name: 'Events',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    DeleteButton: () =>
      import(
        '~/components/UI-core/delete-button.vue' /* webpackChunkName: 'components/UI-core/delete-button' */
      ),
    EditButton: () =>
      import(
        '~/components/UI-core/edit-button.vue' /* webpackChunkName: 'components/UI-core/edit-button' */
      )
  },
  props: {
    /**
     * Список эвентов
     * @type {Array}
     */
    events: {
      type: Array,
      required: true
    },

    /**
     * Флаг процесса обновления
     * @type {Boolean}
     */
    updating: {
      type: Boolean,
      required: true
    }
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
     *
     */
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
     * Флаг является ли студент старостой
     * @type {Boolean}
     */
    isPresidents() {
      return this.$store.getters['user/IS_PRESIDENT']
    }
  },
  watch: {
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
    events() {
      this.initWeekData({
        startWeekDate: this.startWeekDate,
        endWeekDate: this.endWeekDate
      })
    }
  },
  mounted() {
    this.initWeekDayItems()
    this.initWeekData({
      startWeekDate: this.startWeekDate,
      endWeekDate: this.endWeekDate
    })
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
      this.$emit('initWeekDayItems', this.weekDayItems)
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

      // Сортируем по времени
      this.daysOfWeekList.forEach((day) => {
        weekEvents[day] = this.sortByTime(weekEvents[day])
      })

      const weekDates = this.getWeekDates(startWeekDate)

      this.endWeekDate = endWeekDate
      this.startWeekDate = startWeekDate
      this.weekEvents = weekEvents
      this.weekDates = weekDates

      window.scrollTo(0, 0)
    },

    /**
     * Сортировать события по времени
     * @param {Array} event
     * @return {Array}
     */
    sortByTime(events) {
      return [...events].sort((a, b) => {
        return (
          this.getTimeInMinutes(this.getTime(a.start_at)) -
          this.getTimeInMinutes(this.getTime(b.start_at))
        )
      })
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
    },

    /**
     * Получить время
     * @param {Date} date - дата
     * @returns {String}
     */
    getTime(date) {
      return moment(date).format('HH:mm')
    },

    /**
     * Получить время в минутах
     * @param {String} time
     * @returns {Number}
     */
    getTimeInMinutes(time) {
      const times = time.split(':').map((item) => Number(item))
      return times[0] * 60 + time[1]
    },

    /**
     * Редактировать эвент
     * @type {Function}
     * @param {Object} event
     */
    edit(event) {
      this.$emit('edit', event)
    },

    /**
     * Удалить эвент
     * @type {Function}
     * @param {String} id
     */
    deleteEvent(id) {
      this.$emit('deleteEvent', id)
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

.event__time {
  margin: 0;
  font-weight: 500;
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
