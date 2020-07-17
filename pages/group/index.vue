<template>
  <div v-if="loading">
    <v-skeleton-loader
      v-for="i in 10"
      :key="i"
      :height="48"
      type="list-item"
      class="elevation-2 mb-2"
    />
  </div>

  <div v-else>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="student in students"
        :key="student.id"
        class="mb-2"
      >
        <v-expansion-panel-header>{{
          student.full_name || student.email
        }}</v-expansion-panel-header>

        <v-expansion-panel-content>
          <div class="group__info">
            <v-img src="/images/writer.png" width="100" max-width="100" />

            <div class="group__contact">
              <div>Email: {{ student.email || '-' }}</div>
              <div>{{ $t('field.about') }}: {{ student.about || '-' }}</div>
              <div>{{ $t('field.phone') }}: {{ student.phone || '-' }}</div>
              <template v-for="social_network in student.social_networks">
                <div v-if="social_network" :key="social_network.network">
                  {{ social_network.network }}: {{ social_network.url }}
                </div>
              </template>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  onMounted,
  toRefs,
  defineComponent
} from '@vue/composition-api'
import { getGroupUsers, Student } from '~/api/group-users.ts'

const components = {
  Card: () =>
    import(
      '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
    ),
  ModalWrapper: () =>
    import(
      '~/components/modal/modal-wrapper.vue' /*  webpackChunkName: 'components/modal/modal-wrapper' */
    )
}

interface StateI {
  /** Флаг загрузки */
  loading: Boolean
  /** Список студентов */
  students: Student[]
}

export default defineComponent({
  name: 'GroupPage',
  components,
  setup(_, context) {
    /** Состояние */
    const state = reactive<StateI>({
      loading: true,
      students: []
    })

    /** Загрузить список студентов */
    const loadData = async () => {
      try {
        state.students = await getGroupUsers()
        state.loading = false
      } catch (error) {
        context.root.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      }
    }

    onMounted(() => loadData())

    return { ...toRefs(state) }
  }
})
</script>

<style scoped>
.group__info {
  padding: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.mobile .group__info {
  flex-direction: column;
}

.group__contact {
  margin-left: 15px;
}
.mobile .group__contact {
  margin-left: 0;
  margin-top: 15px;
}
</style>
