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
            <Card>
              <template v-slot:badges>
                <span v-if="student.president">
                  {{ $t('students.president') }}
                </span>
              </template>

              <template v-slot:title>
                {{ student.full_name }}
              </template>

              <template v-slot:content>
                <div class="student__info">
                  <img
                    src="~static/images/avatar.png"
                    class="student__avatar"
                  />

                  <div class="student__about">
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
import { mapState, mapActions } from 'vuex'
import { namespace, Types } from '../../store/students'
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
    ...mapState(namespace, [
      /**
       * Флаг загрузки
       * @type {Boolean}
       */
      'loading',
      /**
       * Список студентов
       * @type {Array}
       */
      'students'
    ])
  },
  mounted() {
    this.loadStudents()
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Загрузить список студентов
       */
      loadStudents: Types.actions.LOAD_STUDENTS
    })
  }
}
</script>

<style scoped>
.student__info {
  display: flex;
}

.student__avatar {
  width: 100px;
  height: 100px;
}

.mobile .student__avatar {
  width: 50px;
  height: 50px;
}

.student__about {
  margin-left: 10px;
}

.student__about p {
  margin: 0px;
}
</style>
