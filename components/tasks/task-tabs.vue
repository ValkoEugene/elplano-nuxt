<template>
  <v-tabs
    v-model="tab"
    :show-arrows="$vuetify.breakpoint.smAndDown"
    centered
    class="mb-3 task-tabs"
  >
    <template v-for="tab in taskTabs">
      <v-tab :key="tab.view" :disabled="loading">
        <v-badge :content="`${tasksStatistics[tab.type]}`">
          {{ tab.view }}
        </v-badge>
      </v-tab>
    </template>
  </v-tabs>
</template>

<script lang="ts">
import { computed, watch, defineComponent } from '@vue/composition-api'

export enum TaskQuery {
  outdated = 'outdated',
  today = 'today',
  tomorrow = 'tomorrow',
  upcoming = 'upcoming',
  comleted = 'comleted'
}

export default defineComponent({
  name: 'TaskTypes',
  setup(_, context) {
    /** Статистика по заданиям */
    const tasksStatistics = computed(
      () => context.root.$vuexModules.Tasks.taskStatistics
    )

    /** Список с фильтрами задач для табов */
    const taskTabs = computed(() => {
      return [
        {
          view: context.root.$t('tasks.outdated'),
          query: TaskQuery.outdated,
          type: 'outdated_count'
        },
        {
          view: context.root.$t('tasks.today'),
          query: TaskQuery.today,
          type: 'today_count'
        },
        {
          view: context.root.$t('tasks.tomorrow'),
          query: TaskQuery.tomorrow,
          type: 'tomorrow_count'
        },
        {
          view: context.root.$t('tasks.upcoming'),
          query: TaskQuery.upcoming,
          type: 'upcoming_count'
        },
        {
          view: context.root.$t('tasks.comleted'),
          query: TaskQuery.comleted,
          type: 'accomplished_count'
        }
      ]
    })

    /** Текущий тип задач */
    const currentTaskType = computed(() => context.root.$route.query.tab)

    /** Текущий таб */
    const tab = computed({
      get: (): number => {
        const index = taskTabs.value.findIndex(
          (tab) => tab.query === currentTaskType.value
        )

        return index !== -1 ? index : 1
      },
      set: (index: number) => {
        context.root.$router.replace({
          query: { tab: taskTabs.value[index].query }
        })
      }
    })

    /** При смене таба подставляем значение в роут */
    watch(tab, () => {
      const newTab = taskTabs.value[tab.value].query
      if (newTab === currentTaskType.value) return

      context.root.$router.replace({
        query: { tab: taskTabs.value[tab.value].query }
      })
    })

    /** Флаг загрузки данных */
    const loading = computed(() => context.root.$vuexModules.Tasks.loading)

    return {
      tab,
      taskTabs,
      loading,
      tasksStatistics
    }
  }
})
</script>

<style>
.task-tabs.v-tabs > .v-tabs-bar {
  background-color: inherit;
}
</style>
