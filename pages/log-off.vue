<template>
  <div>log-off</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Страница для разлогина
 */
@Component({
  layout: 'empty'
})
export default class LogOff extends Vue {
  async mounted() {
    await this.$vuexModules.User.resetUser()

    // Используем location чтобы страница перезагрузилась и все состояние vuex сбросилось
    window.location.replace('/login')
  }
}
</script>
