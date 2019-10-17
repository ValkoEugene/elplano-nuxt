<template>
  <v-text-field
    v-model="localValue"
    class="custom-search px-3 mb-4"
    :label="$t('field.search')"
    :placeholder="$t('field.search')"
    type="text"
    prepend-inner-icon="search"
    clear-icon="clear"
    solo
    clearable
  />
</template>

<script lang="ts">
import { Vue, Component, Model, Watch } from 'vue-property-decorator'
import throttle from '~/utils/throttle'

@Component
export default class Search extends Vue {
  /**
   * Значение для v-model
   * @type {string}
   */
  @Model('input', { type: String }) private readonly value!: string

  /**
   * Локальная копия значения
   * @type {string}
   */
  localValue: string = ''

  /**
   * Функция для обновления значения с задержкой
   * @type {Functoin}
   */
  get throttleEmitValue(): (value: string) => void {
    return throttle(this.emitValue, 300)
  }

  /**
   * Обновляем значение для v-model
   * @type {Function}
   */
  emitValue(): void {
    this.$emit('input', this.localValue)
  }

  /**
   * Инициализация значения
   */
  mounted() {
    this.localValue = this.value
  }

  /**
   * Следим за изменением локального значения
   * @param {string} val - новое локальное значение
   */
  @Watch('localValue')
  onLocalValueChange(val: string) {
    this.throttleEmitValue(val)
  }
}
</script>

<style>
.custom-search {
  margin: -16px 0;
  width: 100%;
  overflow: hidden;
}

.custom-search .v-input__control {
  height: 50px;
}
</style>
