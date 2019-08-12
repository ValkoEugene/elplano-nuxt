<!-- Из-за того что vuetify не поддерживает множественый показ v-snackbar показываем только первый и удаляем его в vuex -->

<template>
  <div>
    <!-- eslint-disable -->
    <template v-if="haveSnackbars">
      <v-snackbar
        v-for="(snackbar, index) in snackbars"
        v-if="index === 0"
        :color="snackbar.color"
        :key="snackbars.text"
        v-model="active"
        :timeout="0"
      >
        {{ snackbar.text }}
        <v-btn text @click="close">Закрыть</v-btn>
      </v-snackbar>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {
  Types as snackbarsTypes,
  namespace as snackbarsNamespace
} from '../../store/snackbars'

export default {
  name: 'Snackbars',
  data: () => ({
    /**
     * Флаг активности
     * @type {Boolean}
     */
    active: false,

    /**
     * Id таймера
     * @type {Number}
     */
    timer: null,

    /**
     * Время до авто-закрытия
     * @type {Number}
     */
    timeout: 3000
  }),
  computed: {
    /**
     * Список сообщений
     * @type {[
     *  {
     *    text: String,
     *    color: ('success'|'info' | 'error')
     *  }
     * ]}
     */
    snackbars() {
      return this.$store.state.snackbars.snackbars
    },

    /**
     * Флаг наличия сообщений
     * @type {Boolean}
     */
    haveSnackbars() {
      return Boolean(this.snackbars.length)
    }
  },
  watch: {
    /**
     * При изменении флага активности на false удаляем первое сообщение
     */
    active(value) {
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
    },

    /**
     * При повлении сообщений устанавливаем закрытие по таймауту
     */
    haveSnackbars() {
      this.active = this.haveSnackbars

      if (this.haveSnackbars) this.closeSnackbarByTimeout()
    }
  },
  methods: {
    ...mapMutations({
      /**
       * Установить сообщения
       */
      setSnackbars: `${snackbarsNamespace}/${snackbarsTypes.mutations.SET_SNACKBARS}`
    }),

    /**
     * Закрыть сообщение
     */
    close() {
      this.active = false
    },

    /**
     * Закрыть сообщение по таймауте
     */
    closeSnackbarByTimeout() {
      this.timer = setTimeout(() => {
        this.active = false
      }, this.timeout)
    }
  }
}
</script>
