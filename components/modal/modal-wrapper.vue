<template>
  <div>
    <v-overlay :value="visible" z-index="99" />

    <transition name="modal">
      <v-card v-if="visible" class="modal-edit">
        <v-toolbar class="bg-primary-lighten1">
          <v-btn icon dark :disabled="disableButtons" @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <slot v-if="$scopedSlots.action" name="action" />

            <v-btn
              v-else-if="actionType && !hideDefaultAction"
              dark
              text
              :loading="updating"
              :disabled="disableButtons"
              @click="$emit('action')"
              >{{ $t(`actions.${actionType}`) }}</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text v-if="visible" class="pa-6 card-edit__content">
          <slot name="content" />
        </v-card-text>
      </v-card>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'

interface PathItemI {
  className: String
}

interface ClickOutsideEventI {
  path: PathItemI[]
}

@Component({
  components: {}
})
export default class ModalWrapper extends Vue {
  @Model('input', { type: Boolean, required: true })
  readonly visible!: boolean

  /**
   * Флаг блокировки кнопок
   */
  @Prop({ type: Boolean, default: false })
  private readonly disableButtons: boolean

  /**
   * Флаг обновления
   */
  @Prop({ type: Boolean, default: false })
  private readonly updating: boolean

  /**
   * Тип действия
   */
  @Prop({ type: String, default: 'save' })
  private readonly actionType: string

  /**
   * Флаг скрытия кнопки действий по умолчанию
   */
  @Prop({ type: Boolean, default: false })
  private readonly hideDefaultAction: boolean

  mounted() {
    window.document.addEventListener('keydown', this.escHandler)
  }

  beforeDestroy() {
    window.document.removeEventListener('keydown', this.escHandler)
  }

  /**
   * Открыть модальное окно
   */
  open() {
    this.$emit('input', true)
  }

  /**
   * Закрыть модально окно
   */
  close() {
    this.$emit('input', false)
    this.$emit('close')
  }

  /**
   * Проверка закртия модального окна по клику вне области
   * TODO добавить проверку на клик вне области
   */
  checkCloseByClickOutside(e: ClickOutsideEventI) {
    let clickInDatepicker = false

    e.path.forEach((item) => {
      if (item && item.className && item.className.includes('date-picker')) {
        clickInDatepicker = true
      }
    })

    if (clickInDatepicker) return

    this.close()
  }

  /**
   * Сигнализировать о нажатие кнопки действия
   */
  action() {
    this.$emit('action')
  }

  /**
   * Обработчик нажатия на esc
   */
  escHandler(event: KeyboardEvent) {
    if (event.code === 'Escape' && !this.disableButtons) this.close()
  }
}
</script>

<style scoped>
.modal-edit {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
  width: 35vw;
  height: 100vh;
}

@media (max-width: 1280px) {
  .modal-edit {
    width: 50vw;
  }
}

.card-edit__content {
  max-height: calc(100vh - 64px);
  overflow: auto;
  height: 100%;
}

.modal-enter-active,
.modal-leave-active {
  transition: 0.3s;
}
.modal-enter,
.modal-leave-to {
  transform: translateX(100%);
}

.mobile .modal-edit {
  width: 100vw;
}
</style>
