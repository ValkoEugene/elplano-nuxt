<template>
  <div>
    <v-overlay v-if="visible" :value="visible" z-index="99" />

    <transition name="modal">
      <v-card v-if="visible" class="modal-edit">
        <v-toolbar dark color="primary">
          <v-btn icon dark :disabled="disableButtons" @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
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
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class ModalWrapper extends Vue {
  /**
   * Флаг блокировки кнопок
   */
  @Prop({ type: Boolean, default: false })
  private readonly disableButtons: boolean

  /**
   * Тип действия
   */
  @Prop({ type: String, default: 'save' })
  private readonly actionType: string

  /**
   * Флаг показа модального окна
   */
  visible: boolean = false

  /**
   * Открыть модальное окно
   */
  open() {
    this.visible = true
  }

  /**
   * Закрыть модально окно
   */
  close() {
    this.visible = false
    this.$emit('close')
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

<style>
.modal-edit {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
  width: 35vw;
  height: 100vh;
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
