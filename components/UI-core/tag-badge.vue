<template>
  <span v-if="title" :title="description" :style="labelStyles">
    {{ title }}
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Label } from '~/api/labels.ts'

@Component
export default class TagBadge extends Vue {
  /**
   * ID тега
   */
  @Prop({ type: String, required: true })
  private readonly labelId!: string

  /**
   * Информация о теге
   */
  get label(): Label {
    return this.$vuexModules.Labels.labels[this.labelId] || {}
  }

  /**
   * Заголовок тега
   */
  get title(): string {
    return this.label.title || ''
  }

  /**
   * Описание тега
   */
  get description(): string {
    return this.label.description || ''
  }

  /**
   * Стили для тега
   */
  get labelStyles() {
    return {
      color: this.label.text_color,
      background: this.label.color
    }
  }
}
</script>
