<template>
  <div>
    <v-text-field
      :value="formatedDate"
      :label="label"
      :rules="rules"
      outlined
      readonly
      @focus="active = true"
    />

    <v-dialog :value="active" persistent full-width width="290px">
      <v-card>
        <v-tabs v-model="tab" right grow show-arrows>
          <v-tab>
            <v-icon>event</v-icon>
          </v-tab>
          <v-tab>
            <v-icon>schedule</v-icon>
          </v-tab>
          <v-tab-item>
            <v-date-picker
              v-model="localDate"
              :locale="$store.state.i18n.locale"
              scrollable
              @change="tab = 1"
            />
          </v-tab-item>

          <v-tab-item>
            <v-time-picker v-model="localTime" format="24hr" scrollable />
          </v-tab-item>
        </v-tabs>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="close">{{ $t('ui.cancel') }}</v-btn>

          <v-btn text :disabled="!localDate || !localTime" @click="save">{{
            $t('ui.confirm')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Watch } from 'vue-property-decorator'
import moment from '~/plugins/moment'

/**
 * Компонент выбора даты и время
 */
@Component
export default class Datepicker extends Vue {
  /**
   * Текущее значение
   * @type {string}
   */
  @Model('input', { type: String, default: '' }) readonly value!: string

  /**
   * Описание поля
   * @type {string}
   */
  @Prop({ type: String, required: true }) readonly label!: string

  /**
   * Правила валидации
   * TODO Типы для правил валидации
   * @type {Array}
   */
  @Prop({ type: Array, default: () => [] }) readonly rules!: any[]
  // rules: { type: Array, default: () => [] }

  /**
   * Флаг активности выбора
   * @type {Boolean}
   */
  active: boolean = false

  /**
   * Активный таб
   * @type {Number | Null}
   */
  tab: number | null = null

  /**
   * Локальная дата
   * @type {String}
   */
  localDate: string = ''

  /**
   * Локальное время
   * @type {String}
   */
  localTime: string = ''

  /**
   * Дата на отображение
   * @type {String}
   */
  get formatedDate(): string {
    return this.value ? moment(this.value).format('YYYY-MM-DD HH:mm') : ''
  }

  mounted() {
    if (this.value) {
      this.localTime = moment(this.value).format('HH:mm')
      this.localDate = moment(this.value).format('YYYY-MM-DD')
    }
  }

  /**
   * Закрыть выбор
   * @function
   */
  close(): void {
    this.active = false
    this.tab = null
  }

  /**
   * Сохранение новой даты
   * @function
   */
  save(): void {
    const date = moment(
      `${this.localDate} ${this.localTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString()

    this.active = false
    this.$emit('input', date)
  }

  @Watch('value')
  onValueChange() {
    if (this.value) {
      this.localTime = moment(this.value).format('HH:mm')
      this.localDate = moment(this.value).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
.v-picker.v-card {
  box-shadow: none !important;
}
</style>
