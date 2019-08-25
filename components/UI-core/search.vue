<template>
  <v-text-field
    v-model="localValue"
    class="search"
    :class="[$vuetify.breakpoint.smAndDown ? 'pa-3' : 'pa-6']"
    :label="$t('field.search')"
    :placeholder="$t('field.search')"
    type="text"
    prepend-inner-icon="search"
    clear-icon="clear"
    solo
    clearable
  />
</template>

<script>
import throttle from '../../utils/throttle'

export default {
  name: 'Search',
  model: {
    prop: 'value'
  },
  props: {
    /**
     * Значение для v-model
     * @type {String}
     */
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    /**
     * Локальная копия значения
     * @type {String}
     */
    localValue: ''
  }),
  computed: {
    /**
     * Обновляем значение с задержкой
     * @type {Functoin}
     */
    throttleEmitValue() {
      return throttle(this.emitValue, 300)
    }
  },
  watch: {
    localValue() {
      this.throttleEmitValue()
    }
  },
  mounted() {
    this.localValue = this.value
  },
  methods: {
    /**
     * Обновляем значение для v-model
     * @type {Function}
     */
    emitValue() {
      this.$emit('input', this.localValue)
    }
  }
}
</script>

<style scoped>
.search {
  margin: -16px 0;
  width: 100%;
}
</style>
