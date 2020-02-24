<template>
  <div class="day__date">
    <span class="day__date--ddd">{{ getDayView(date, 'ddd') }}</span>
    <br />
    <span class="day__date--DD text-primary font-weight-medium">{{
      getDayView(date, 'DD')
    }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from '~/plugins/moment.js'

@Component
export default class DayTag extends Vue {
  /**
   * Дата для отображения
   */
  @Prop({ type: String, required: true })
  private readonly date!: string

  /**
   * Формат даты
   */
  @Prop({ type: String, default: 'DD.MM.YYYY' })
  private readonly dateFormate: string

  /**
   * Получить отображение дня
   */
  getDayView(date: string, format = 'dddd'): string {
    return moment(date, this.dateFormate).format(format)
  }
}
</script>

<style scoped>
.day__date {
  margin-right: 10px;
}

.day__date--ddd {
  color: rgba(0, 0, 0, 0.25);
}

.day__date--DD {
  font-size: 1.5rem;
}
</style>
