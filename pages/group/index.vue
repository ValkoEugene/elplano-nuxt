<template>
  <Loader v-if="loading" :show-search="true" :show-cards="true" />

  <div v-else>
    <template>
      <v-layout row wrap>
        <Search v-model="search" />

        <template v-for="student in students">
          <v-flex
            v-if="!search || $customHelpers.search(student.full_name, search)"
            :key="student.id"
            xs12
            sm12
            md4
            class="pa-3"
          >
            <Card avatar-url="/images/avatar.png">
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
        </template>
      </v-layout>
    </template>
  </div>
</template>

<script>
import Student from '../../models/Student'
import checkGroup from '../../mixins/checkgroup'

export default {
  name: 'GroupPage',
  components: {
    Loader: () =>
      import(
        '../../components/UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      ),
    Card: () =>
      import(
        '../../components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    Search: () =>
      import(
        '../../components/UI-core/search.vue' /* webpackChunkName: 'components/UI-core/search' */
      )
  },
  mixins: [checkGroup],
  data: () => ({
    /**
     * Строка поиска
     * @type {String}
     */
    search: ''
  }),
  computed: {
    /**
     * Флаг загрузки
     * @type {Boolean}
     */
    loading() {
      return Student.getFetchingStatus()
    },

    /**
     * Список студентов
     * @type {Array}
     */
    students() {
      return Student.all()
    }
  },
  mounted() {
    Student.$apiFetch()
  }
}
</script>
