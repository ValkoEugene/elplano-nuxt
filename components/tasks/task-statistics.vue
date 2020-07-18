<template>
  <v-menu left bottom>
    <template v-slot:activator="{ on }">
      <v-badge
        color="error"
        offset-x="20px"
        offset-y="20px"
        :content="activeTasksCount"
        overlap
      >
        <v-btn icon v-on="on">
          <v-icon>mdi-briefcase</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <v-list :min-width="200">
      <v-subheader>{{ $t('tasks.activeTask') }}</v-subheader>

      <v-list-item
        v-for="link in tasksStatisticsList"
        :key="link.url"
        :to="link.url"
        nuxt
        exact
        >{{ link.text }}: {{ tasksStatistics[link.type] }}</v-list-item
      >
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'TaskStatistics',
  setup(_, context) {
    /** Статистика по заданиям */
    const tasksStatistics = computed(
      () => context.root.$vuexModules.Tasks.taskStatistics
    )

    /** Количество активных заданий */
    const activeTasksCount = computed(() => {
      const activeTasksStatistics = { ...tasksStatistics.value }
      delete activeTasksStatistics.accomplished_count

      const countsArr = Object.values(activeTasksStatistics)

      return countsArr.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      )
    })

    /** Данные по типам заданий */
    const tasksStatisticsList = [
      {
        text: context.root.$t('tasks.outdated'),
        url: '/tasks-tabs?tab=outdated',
        type: 'outdated_count'
      },
      {
        text: context.root.$t('tasks.today'),
        url: '/tasks-tabs?tab=today',
        type: 'today_count'
      },
      {
        text: context.root.$t('tasks.tomorrow'),
        url: '/tasks-tabs?tab=tomorrow',
        type: 'tomorrow_count'
      },
      {
        text: context.root.$t('tasks.upcoming'),
        url: '/tasks-tabs?tab=upcoming',
        type: 'upcoming_count'
      }
    ]

    return {
      tasksStatisticsList,
      tasksStatistics,
      activeTasksCount
    }
  }
})
</script>
