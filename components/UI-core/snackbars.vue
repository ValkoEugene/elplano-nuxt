<!-- Из-за того что vuetify не поддерживает множественый показ v-snackbar показываем только первый и удаляем его в vuex -->

<template>
  <div>
    <template v-if="haveSnackbars">
      <!-- eslint-disable -->
      <v-snackbar
        v-for="(snackbar, index) in snackbars"
        v-if="index === 0"
        :key="snackbars.text"
        v-model="active"
        :color="snackbar.color"
        :timeout="0"
      >
        {{ snackbar.text }}
        <v-btn text @click="close">Закрыть</v-btn>
      </v-snackbar>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SnackbarsModule, Snackbar } from '~/store/snackbars.ts'

@Component
export default class Snackbars extends Vue {
  /**
   * Флаг активности
   */
  active: boolean = false

  /**
   * Id таймера
   */
  timer: NodeJS.Timeout | null = null

  /**
   * Время до авто-закрытия
   */
  timeout: number = 3000

  /**
   * Список сообщений
   */
  get snackbars(): Snackbar[] {
    return SnackbarsModule.snackbars
  }

  /**
   * Флаг наличия сообщений
   */
  get haveSnackbars(): boolean {
    return Boolean(this.snackbars.length)
  }

  /**
   * При изменении флага активности на false удаляем первое сообщение
   */
  @Watch('active')
  onActiveChange(value: boolean) {
    if (value) return
    if (this.timer) clearTimeout(this.timer)

    const snackbars = [...this.snackbars]
    snackbars.shift()

    this.setSnackbars(snackbars)

    // Если еще есть сообщения - проставляем флаг активности для следующего сообщения
    // И устанавливаем для него закрытие по таймеру
    if (snackbars.length) {
      this.active = true
      this.closeSnackbarByTimeout()
    }
  }

  /**
   * При повлении сообщений устанавливаем закрытие по таймауту
   */
  @Watch('haveSnackbars')
  onHaveSnackbarsChange() {
    this.active = this.haveSnackbars

    if (this.haveSnackbars) this.closeSnackbarByTimeout()
  }

  /**
   * Установить сообщения
   */
  setSnackbars(snackbars: Snackbar[]) {
    SnackbarsModule.SET_SNACKBARS(snackbars)
  }

  /**
   * Закрыть сообщение
   */
  close() {
    this.active = false
  }

  /**
   * Закрыть сообщение по таймауте
   */
  closeSnackbarByTimeout() {
    this.timer = setTimeout(() => {
      this.active = false
    }, this.timeout)
  }
}
</script>
