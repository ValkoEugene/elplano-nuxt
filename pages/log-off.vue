<template>
  <loader-full-page />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Страница для разлогина
 */
@Component({
  layout: 'empty',
  components: {
    LoaderFullPage: () =>
      import(
        '~/components/UI-core/loaders/loader-full-page.vue' /* webpackChunkName: 'components/UI-core/loaders/loader-full-page' */
      )
  }
})
export default class LogOff extends Vue {
  async mounted() {
    await this.$vuexModules.User.resetUser()

    // Используем location чтобы страница перезагрузилась и все состояние vuex сбросилось
    // window.location.replace('/login')
    this.$router.push('/login')
  }
}
</script>
