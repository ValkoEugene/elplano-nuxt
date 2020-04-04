<template>
  <Loader v-if="loading" :show-search="true" :show-cards="true" />

  <div v-else>
    <v-layout row wrap>
      <Search v-model="search" />

      <v-flex v-if="!filtredStudents.length" xs12 class="pa-3">
        <v-alert type="info" prominent>
          <span>{{ $t('group.empty') }}</span>
        </v-alert>
      </v-flex>

      <v-flex
        v-for="student in filtredStudents"
        :key="student.id"
        xs12
        sm12
        md4
        class="pa-3"
      >
        <Card avatar-url="/images/writer.png">
          <template v-slot:badges>
            <span v-if="student.president">
              {{ $t('students.president') }}
            </span>
          </template>

          <template v-slot:title>
            {{ student.full_name }}
          </template>

          <template v-slot:content>
            <div>
              <p>Email: {{ student.email || '-' }}</p>
              <p>{{ $t('field.number') }}: {{ student.phone || '-' }}</p>

              <template
                v-for="(social_network, name) in student.social_networks"
              >
                <p v-if="social_network" :key="name">
                  {{ name }}: {{ social_network }}
                </p>
              </template>

              <p>{{ $t('field.about') }}: {{ student.about || '-' }}</p>
            </div>
          </template>
        </Card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { reactive, computed, onMounted, toRefs } from '@vue/composition-api'
import { getGroupUsers, Student } from '~/api/group-users.ts'
import { search } from '~/utils/helpers.ts'

interface GroupState {
  search: string
  loading: Boolean
  students: Student[]
}

export default {
  components: {
    Loader: () =>
      import(
        '~/components/UI-core/loaders/loader.vue' /* webpackChunkName: 'components/UI-core/loaders/loader' */
      ),
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    Search: () =>
      import(
        '~/components/UI-core/search.vue' /* webpackChunkName: 'components/UI-core/search' */
      )
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    const state = reactive<GroupState>({
      search: '',
      loading: true,
      students: []
    })

    const filtredStudents = computed<Student[]>(() => {
      if (!state.search) return state.students

      return state.students.filter((student) =>
        search(student.full_name || '', state.search)
      )
    })

    const loadData = async () => {
      try {
        state.students = await getGroupUsers()
        state.loading = false
      } catch (error) {
        context.root.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      }
    }

    onMounted(() => loadData())

    return { ...toRefs(state), filtredStudents }
  }
}
</script>
