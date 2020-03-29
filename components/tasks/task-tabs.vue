<template>
  <v-tabs v-model="tab" :show-arrows="$vuetify.breakpoint.smAndDown" centered>
    <v-tab v-for="tab in taskTabs" :key="tab.view">
      {{ tab.view }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

export enum TaskQuery {
  outdated = 'outdated',
  today = 'today',
  tomorrow = 'tomorrow',
  upcoming = 'upcoming',
  comleted = 'comleted'
}

@Component
export default class TaskTabs extends Vue {
  tab = 1

  get taskTabs() {
    return [
      { view: this.$t('tasks.outdated'), query: TaskQuery.outdated },
      { view: this.$t('tasks.today'), query: TaskQuery.today },
      { view: this.$t('tasks.tomorrow'), query: TaskQuery.tomorrow },
      { view: this.$t('tasks.upcoming'), query: TaskQuery.upcoming },
      { view: this.$t('tasks.comleted'), query: TaskQuery.comleted }
    ]
  }

  @Watch('tab', { immediate: true })
  onTabChanged() {
    this.$router.replace({ query: { tab: this.taskTabs[this.tab].query } })
  }
}
</script>
