<template>
  <div>
    <v-text-field
      :value="value"
      :label="label"
      :rules="rules"
      outlined
      readonly
      @focus="active = true"
    />

    <v-dialog :value="active" persistent full-width width="290px">
      <v-date-picker v-model="localDate" scrollable>
        <v-btn text color="primary" @click="cancel">{{
          $t('ui.cancel')
        }}</v-btn>
        <v-btn text color="primary" :disabled="!localDate" @click="save"
          >OK</v-btn
        >
      </v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Date',
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
     * Локальная дата
     * @type {String}
     */
    localDate: '',

    /**
     * Флаг показа выбора
     * @type {Boolean}
     */
    active: false
  }),
  mounted() {
    this.localDate = this.value
  },
  methods: {
    /**
     * Отменить выбор
     */
    cancel() {
      this.active = false
    },

    /**
     * Сохранить выбор
     */
    save() {
      this.$emit('input', this.localDate)
      this.active = false
    }
  }
}
</script>
