<template>
  <v-tabs v-model="tab" centered>
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

  taskTabs = [
    { view: 'Просроченные', query: TaskQuery.outdated },
    { view: 'Сегодня', query: TaskQuery.today },
    { view: 'Завтра', query: TaskQuery.tomorrow },
    { view: 'Ближайшие', query: TaskQuery.upcoming },
    { view: 'Выполненные', query: TaskQuery.comleted }
  ]

  @Watch('tab', { immediate: true })
  onTabChanged() {
    this.$router.replace({ query: { tab: this.taskTabs[this.tab].query } })
  }
}
</script>
