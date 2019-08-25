<template>
  <v-container :fluid="!loading" class="pa-0">
    <Loader v-if="loading" />

    <template v-else>
      <v-layout row wrap>
        <Search v-model="search" />

        <template v-for="student in students">
          <v-flex
            v-if="!search || $customHelpers.search(student.full_name, search)"
            :key="student.id"
            xs12
            sm12
            md4
            :class="[$vuetify.breakpoint.smAndDown ? 'pa-3' : 'pa-6']"
          >
            <v-card min-height="100" elevation="5">
              <CardTitle>
                <v-chip
                  v-if="student.president"
                  class="ma-2"
                  color="primary"
                  small
                  label
                  >{{ $t('students.president') }}</v-chip
                >
                {{ student.full_name }}</CardTitle
              >

              <v-card-text class="student__info">
                <img src="~static/images/avatar.png" class="student__avatar" />

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
              </v-card-text>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </template>
  </v-container>
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
    CardTitle: () =>
      import(
        '../../components/cards/card-title.vue' /* webpackChunkName: 'components/cards/card-title' */
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

.student__about {
  margin-left: 10px;
}

.student__about p {
  margin: 0px;
}
</style>
