<template>
  <loader-full-page />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'empty',
  components: {
    LoaderFullPage: () =>
      import(
        '~/components/UI-core/loaders/loader-full-page.vue' /* webpackChunkName: 'components/UI-core/loaders/loader-full-page' */
      )
  }
})
export default class IndexPage extends Vue {
  mounted() {
    this.$router.push('/schedule')
  }
}
</script>
