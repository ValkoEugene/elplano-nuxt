<template>
  <div class="events">
    <div class="events__actions">
      <v-btn small fab class="text-primary" @click="prevWeek">
        <v-icon>navigate_before</v-icon>
      </v-btn>

      <p class="title week-title px-6">
        {{ weekDates[0] }} - {{ weekDates[6] }}
      </p>
      <v-btn small fab class="text-primary" @click="nextWeek">
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
            <DayTag :date="weekDates[dayIndex]" />

            <div class="day__events">
              <template v-for="event in weekEvents[day]">
                <Card :key="event.id" card-height="auto" small class="mb-5">
                  <template #badges>
                    <span v-if="event.eventable_type === 'student'">
                      {{ $t('events.own') }}
                    </span>

                    <template v-if="event.label_ids.length">
                      <tag-badge
                        v-for="label_id in event.label_ids"
                        :key="label_id"
                        :label-id="label_id"
                      />
                    </template>
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
                    <v-list-item
                      v-if="event.eventable_type === 'student' || isPresidents"
                      @click="addNewTaskInit(event.id)"
                    >
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

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import clonedeep from 'lodash.clonedeep'
import { Moment } from 'moment'
import moment, { setLocale } from '~/plugins/moment'
import { Event } from '~/api/events.ts'
import TaskEventBusMixin from '~/components/tasks/task-event-bus-mixin.ts'

export type DaysOfWeeks = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

export type Day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'

export type WeekDayItem = {
  value: string
  view: string
}

export type WeekEvents = {
  MO: Event[]
  TU: Event[]
  WE: Event[]
  TH: Event[]
  FR: Event[]
  SA: Event[]
  SU: Event[]
}

@Component({
  components: {
    DayTag: () =>
      import(
        '~/components/UI-core/day-tag.vue' /* webpackChunkName: 'components/UI-core/day-tag' */
      ),
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
      ),
    TagBadge: () =>
      import(
        '~/components/UI-core/tag-badge.vue' /* webpackChunkName: 'components/UI-core/tag-badge' */
      )
  }
})
export default class Events extends Mixins(TaskEventBusMixin) {
  /**
   * Список эвентов
   */
  @Prop({ type: Array as () => Event[], required: true })
  readonly events!: Event[]

  /**
   * Флаг процесса обновления
   */
  @Prop({ type: Boolean, required: true })
  readonly updating!: boolean

  /**
   * Шаблон для событий по дням недели
   * @type {Object}
   */
  weekEventsTemplate: WeekEvents = {
    MO: [],
    TU: [],
    WE: [],
    TH: [],
    FR: [],
    SA: [],
    SU: []
  }

  /**
   * События недели
   * @type {Object}
   */
  weekEvents: WeekEvents = {
    MO: [],
    TU: [],
    WE: [],
    TH: [],
    FR: [],
    SA: [],
    SU: []
  }

  /**
   * Список дней недели (нужен т.к. объект не гарантирует порядок прохода по свойствам)
   */
  daysOfWeekList: DaysOfWeeks = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

  /**
   * Список с датами на неделю
   */
  weekDates: string[] = []

  /**
   * Дата начала недели
   */
  startWeekDate: Moment = moment().startOf('week')

  /**
   * Дата завершения недели
   */
  endWeekDate: Moment = moment().endOf('week')

  /**
   *
   */
  weekDayItems: WeekDayItem[] = []

  /**
   * Флаг наличия событий на неделю
   */
  get haveEvents() {
    let haveEvents: boolean = false

    const days = Object.keys(this.weekEvents) as Day[]

    days.forEach((day) => {
      if (this.weekEvents[day] && this.weekEvents[day].length > 0)
        haveEvents = true
    })

    return haveEvents
  }

  /**
   * Текушая локаль
   */
  get locale(): string {
    return this.$vuexModules.I18n.locale
  }

  /**
   * Флаг является ли студент старостой
   */
  get isPresidents(): boolean {
    return this.$vuexModules.User.isPresident
  }

  @Watch('locale')
  onLocaleChange() {
    setLocale(this.locale)
    this.initWeekDayItems()
    this.$forceUpdate()
  }

  /**
   * При изменениях переинициализируем расписание
   */
  @Watch('events')
  onEventsChange() {
    this.initWeekData({
      startWeekDate: this.startWeekDate,
      endWeekDate: this.endWeekDate
    })
  }

  mounted() {
    this.initWeekDayItems()
    this.initWeekData({
      startWeekDate: this.startWeekDate,
      endWeekDate: this.endWeekDate
    })
  }

  /**
   * Добавить задание
   */
  addNewTaskInit(event_id: string) {
    this.addNewTaskEmit(event_id)
  }

  /**
   * Инициализация элментов выбора для дней недели
   * @type {Function}
   */
  initWeekDayItems() {
    const weekDayItems: WeekDayItem[] = []

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
  }

  /**
   * Получить список дат для недели
   */
  getWeekDates(startWeekDate: Moment): string[] {
    const weekDates: Moment[] = [startWeekDate]

    for (let i = 1; i < 7; i++) {
      weekDates.push(weekDates[weekDates.length - 1].clone().add(1, 'days'))
    }

    return weekDates.map((date) => date.format('DD.MM.YYYY'))
  }

  /**
   * Инициализация данных по недели
   */
  initWeekData({
    startWeekDate,
    endWeekDate
  }: {
    startWeekDate: Moment
    endWeekDate: Moment
  }) {
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
  }

  /**
   * Сортировать события по времени
   */
  sortByTime(events: Event[]): Event[] {
    return [...events].sort((a, b) => {
      return (
        this.getTimeInMinutes(this.getTime(a.start_at)) -
        this.getTimeInMinutes(this.getTime(b.start_at))
      )
    })
  }

  /**
   * Перейти на неделю назад
   * @type {Funciotn}
   */
  prevWeek() {
    this.setNewWeek(this.startWeekDate.clone().subtract(7, 'days'))
  }

  /**
   * Перейти на неделю вперёд
   * @type {Funciotn}
   */
  nextWeek() {
    this.setNewWeek(this.startWeekDate.clone().add(7, 'days'))
  }

  /**
   * Вычеслить расписание для заданной недели
   * @type {Funciotn}
   */
  setNewWeek(startWeekDate: Moment) {
    const endWeekDate = startWeekDate.clone().endOf('week')

    this.initWeekData({ startWeekDate, endWeekDate })
  }

  /**
   * Получить время
   */
  getTime(date: string): string {
    return moment(date).format('HH:mm')
  }

  /**
   * Получить время в минутах
   */
  getTimeInMinutes(time: string): number {
    const times: number[] = time.split(':').map((item) => Number(item))
    return Number(times[0] * 60 + time[1])
  }

  /**
   * Редактировать эвент
   */
  edit(event: Event) {
    this.$emit('edit', event)
  }

  /**
   * Удалить эвент
   */
  deleteEvent(id: string) {
    this.$emit('deleteEvent', id)
  }
}
</script>

<style scoped>
.day__wrapper {
  display: flex;
  margin-bottom: 25px;
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

.theme--dark .events__actions {
  color: #aeaeae;
}

.events__actions p {
  margin: 0;
}

.event__time {
  margin: 0;
  font-weight: 500;
}

.mobile .week-title {
  text-align: center;
  font-size: 1rem !important;
}
</style>
