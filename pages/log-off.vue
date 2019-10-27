<template>
  <div>log-off</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserState } from '~/store/user.ts'

/**
 * Страница для разлогина
 */
@Component({
  layout: 'empty'
})
export default class LogOff extends Vue {
  userState = new UserState(this.$store)

  async mounted() {
    await this.userState.resetUserAction()

    // Используем location чтобы страница перезагрузилась и все состояние vuex сбросилось
    window.location.replace('/login')
  }
}
</script>
