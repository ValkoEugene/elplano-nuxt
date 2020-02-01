<template>
  <v-dialog v-model="localActive" max-width="290">
    <Card actions-justify-content="end">
      <template v-slot:title class="headline">
        <slot name="title">Are you sure?</slot>
      </template>

      <template v-if="haveContentSlot" v-slot:content>
        <slot name="content" />
      </template>

      <template v-slot:actions>
        <v-btn text @click="cancel">{{ $t('ui.cancel') }}</v-btn>

        <v-btn text @click="confirm">{{ $t('ui.confirm') }}</v-btn>
      </template>
    </Card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from 'vue-property-decorator'
import Card from './card.vue'

/**
 * Слоты компонента
 */
export enum ConfirmSlots {
  title = 'title',
  content = 'content',
  actions = 'actions'
}

/**
 * Компонент с окном подтверждения
 */
@Component({
  components: {
    Card
    // Card: () =>
    //   import(
    //     '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
    //   )
  }
})
export default class Confirm extends Vue {
  /**
   * Флаг показа окна подтверждения
   * @type {boolean}
   */
  @Prop({ type: Boolean, required: true })
  private readonly active!: boolean

  /**
   * Локальное значение показа окна
   * @type {boolean}
   */
  localActive: boolean = false

  /**
   * Флаг наличия слота с контентом
   * @type {boolean}
   */
  get haveContentSlot(): boolean {
    return this.$slots[ConfirmSlots.content] !== undefined
  }

  /**
   * Событие на закрытие окна подтверждения
   */
  cancel() {
    this.$emit('cancel')
  }

  /**
   * Событие на подтверждение
   */
  confirm() {
    this.$emit('confirm')
  }

  /**
   * Обработчик изменения флага показа окна подтверждения
   */
  @Watch('active')
  onActiveChange() {
    if (this.active === this.localActive) return

    this.localActive = this.active
  }

  /**
   * Обработчик изменения локального значения флага показа окна
   */
  @Watch('localActive')
  onLocalActiveChange() {
    if (!this.localActive) this.cancel()
  }
}
</script>
