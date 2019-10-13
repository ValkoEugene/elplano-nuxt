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
            <v-date-picker v-model="localDate" scrollable @change="tab = 1" />
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

<script>
import moment from '~/plugins/moment'

export default {
  name: 'Datepicker',
  model: {
    prop: 'value'
  },
  props: {
    /**
     * Текущее значение
     * @type {String}
     */
    value: {
      type: String,
      default: ''
    },

    /**
     * Описание поля
     * @type {String}
     */
    label: {
      type: String,
      required: true
    },

    /**
     * Правила валидации
     * @type {Array}
     */
    rules: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    /**
     * Флаг активности выбора
     * @type {Boolean}
     */
    active: false,

    /**
     * Активный таб
     * @type {Number | Null}
     */
    tab: null,

    /**
     * Локальная дата
     * @type {String}
     */
    localDate: '',

    /**
     * Локальное время
     * @type {String}
     */
    localTime: ''
  }),
  computed: {
    /**
     * Дата на отображение
     * @type {String}
     */
    formatedDate() {
      return this.value ? moment(this.value).format('YYYY-MM-DD HH:mm') : ''
    }
  },
  watch: {
    value() {
      if (this.value) {
        this.localTime = moment(this.value).format('HH:mm')
        this.localDate = moment(this.value).format('YYYY-MM-DD')
      }
    }
  },
  mounted() {
    if (this.value) {
      this.localTime = moment(this.value).format('HH:mm')
      this.localDate = moment(this.value).format('YYYY-MM-DD')
    }
  },
  methods: {
    /**
     * Закрыть выбор
     * @type {Function}
     */
    close() {
      this.active = false
      this.tab = null
    },

    /**
     * Сохранение новой даты
     * @type {Function}
     */
    save() {
      const date = moment(
        `${this.localDate} ${this.localTime}`,
        'YYYY-MM-DD HH:mm'
      ).toISOString()

      this.active = false
      this.$emit('input', date)
    }
  }
}
</script>

<style scoped>
.v-picker.v-card {
  box-shadow: none !important;
}
</style>
