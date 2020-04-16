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

    <v-dialog :value="active" persistent width="290px">
      <v-time-picker
        v-model="localTime"
        :locale="$store.state.i18n.locale"
        format="24hr"
        scrollable
      >
        <v-btn text color="primary" @click="cancel">{{
          $t('ui.cancel')
        }}</v-btn>
        <v-btn text color="primary" :disabled="!localTime" @click="save"
          >OK</v-btn
        >
      </v-time-picker>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator'
import { Rule } from '~/plugins/rules.ts'

/**
 * Компонет для выбора время
 */
@Component
export default class Time extends Vue {
  /**
   * Текущее значение
   * @type {String}
   */
  @Model('input', { type: String })
  readonly value!: string

  /**
   * Описание поля
   * @type {String}
   */
  @Prop({ type: String, required: true })
  readonly label!: string

  /**
   * Правила валидации
   * @type {Rule[]}
   */
  @Prop({ type: Array as () => Rule[], default: () => [] })
  readonly rules!: Rule[]

  /**
   * Локальная время
   * @type {String}
   */
  localTime: string = ''

  /**
   * Флаг показа выбора
   * @type {Boolean}
   */
  active: boolean = false

  /**
   * Отменить выбор
   */
  cancel() {
    this.active = false
  }

  /**
   * Сохранить выбор
   */
  save() {
    this.$emit('input', this.localTime)
    this.active = false
  }

  mounted() {
    this.localTime = this.value
  }
}
</script>
