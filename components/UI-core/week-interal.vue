<template>
  <div class="calendar-picker__wrapper">
    <v-btn small dark fab class="text-primary" @click="prevWeek">
      <v-icon>navigate_before</v-icon>
    </v-btn>

    <p class="title calendar-picker__interval px-6">
      {{ weekDates[0] }} - {{ weekDates[6] }}
    </p>
    <v-btn small dark fab class="text-primary" @click="nextWeek">
      <v-icon>navigate_next</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Moment } from 'moment'
import moment from '~/plugins/moment'

export interface setWeekDatesPayload {
  startWeek: string
  endWeek: string
}

@Component
export default class CalendarPicker extends Vue {
  /**
   * Список с датами на неделю
   */
  weekDates: string[] = []

  /**
   * Дата начала недели
   */
  startWeekDate: Moment = moment().startOf('week')

  @Watch('startWeekDate', { immediate: true })
  onStartWeekDateChange() {
    this.setWeekDates(this.startWeekDate)
  }

  /**
   * Получить список дат для недели
   */
  setWeekDates(startWeekDate: Moment): void {
    const weekDates: Moment[] = [startWeekDate]

    for (let i = 1; i < 7; i++) {
      weekDates.push(weekDates[weekDates.length - 1].clone().add(1, 'days'))
    }

    this.weekDates = weekDates.map((date) => date.format('DD.MM.YYYY'))

    this.$emit('setWeekDates', {
      startWeek: this.weekDates[0],
      endWeek: this.weekDates[6]
    } as setWeekDatesPayload)
  }

  /**
   * Перейти на неделю назад
   */
  prevWeek() {
    this.startWeekDate = this.startWeekDate.clone().subtract(7, 'days')
  }

  /**
   * Перейти на неделю вперёд
   */
  nextWeek() {
    this.startWeekDate = this.startWeekDate.clone().add(7, 'days')
  }
}
</script>

<style scope>
.calendar-picker__wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.calendar-picker__interval {
  margin: 0 !important;
}

.mobile .calendar-picker__interval {
  text-align: center;
  font-size: 1rem !important;
}
</style>
