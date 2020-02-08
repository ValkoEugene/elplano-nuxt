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
import { Component, Mixins } from 'vue-property-decorator'
import { getGroupUsers, Student } from '~/api/group-users.ts'
import CheckGroup from '~/mixins/CheckGroup.ts'

/**
 * Компонент вывода списка студентов группы
 */
@Component({
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
  }
})
export default class GroupPage extends Mixins(CheckGroup) {
  /**
   * Строка поиска
   */
  search: string = ''

  /**
   * Флаг загрузки
   */
  loading: boolean = true

  /**
   * Список студентов
   */
  students: Student[] = []

  /**
   * Отфильтрованные по строке поиска студенты
   */
  get filtredStudents(): Student[] {
    if (!this.search) return this.students

    return this.students.filter((student) =>
      this.$customHelpers.search(student.full_name || '', this.search)
    )
  }

  mounted() {
    this.loadData()
  }

  /**
   * Загрузить данные
   */
  async loadData() {
    try {
      this.students = await getGroupUsers()
      this.loading = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
</script>
