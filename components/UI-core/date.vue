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
      <v-date-picker
        v-model="localDate"
        :locale="$store.state.i18n.locale"
        scrollable
      >
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

<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator'
import { Rule } from '~/plugins/rules.ts'

/**
 * Компонент выбора даты
 */
@Component
export default class Date extends Vue {
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
   * @type {Array}
   */
  @Prop({ type: Array as () => Rule[], default: () => [] })
  readonly rules!: Rule[]

  /**
   * Локальная дата
   * @type {String}
   */
  localDate: string = ''

  /**
   * Флаг показа выбора
   * @type {Boolean}
   */
  active: boolean = false

  mounted() {
    this.localDate = this.value
  }

  /**
   * Отменить выбор
   * @function
   * @return {void}
   */
  cancel(): void {
    this.active = false
  }

  /**
   * Сохранить выбор
   * @function
   * @return {void}
   */
  save() {
    this.$emit('input', this.localDate)
    this.active = false
  }
}
</script>
