<template>
  <v-container fluid>
    <!-- eslint-disable -->
    <v-progress-circular v-if="loading" :size="100" color="primary" indeterminate />

    <template v-else>
      <Search v-model="search" />

      <v-layout row wrap>
        <template v-for="(course, id) in courses">
          <v-flex
            v-if="!search || course.title.includes(search)"
            :key="id"
            xs12
            sm12
            md6
            class="pa-4"
          >
            <v-card min-height="100" elevation="5">
              <v-card-text>
                <v-row>
                  <v-col cols="10">
                    <div class="title text-primary">{{ course.title }}</div>

                    <div v-if="!loadingLecturers">
                      Преподаватели:
                      <span v-if="!course.lecturer_ids.length">-</span>

                      <div
                        v-else
                        v-for="id in course.lecturer_ids"
                        :key="id"
                      >{{ lecturers[id].view }}</div>
                    </div>
                  </v-col>

                  <v-col cols="2" align-self="center">
                    <v-menu left bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <!-- eslint-disable -->
                        <v-list-item @click="() => {}">{{ $t('actions.addTask') }}</v-list-item>
                        <v-list-item @click="() => {}">{{ $t('actions.addRaiting') }}</v-list-item>
                        <v-list-item @click="edit(id)">{{ $t('actions.edit') }}</v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </template>

    <v-row justify="center">
      <!-- eslint-disable -->
      <v-dialog v-model="editing" fullscreen hide-overlay transition="dialog-bottom-transition">
        <Edit
          v-if="editing"
          :courses-id="editingId"
          :courses="courses"
          :lecturers="lecturers"
          @close="editing = false"
        />
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  namespace as coursesNamespace,
  Types as coursesTypes
} from '../../store/courses'
import {
  namespace as lecturersNamespace,
  Types as lecturersTypes
} from '../../store/lecturers'

export default {
  name: 'LessonsPage',
  middleware: ['auth'],
  components: {
    Search: () => import('../../components/UI-core/search.vue'),
    Edit: () => import('../../components/lessons/edit.vue')
  },
  data: () => ({
    /**
     * Строка поиска
     * @type {String}
     */
    search: '',

    /**
     * Флаг редактирования
     * @type {Boolean}
     */
    editing: false,

    /**
     * ID редактируемого урока
     * @type {String}
     */
    editingId: ''
  }),
  computed: {
    ...mapState(coursesNamespace, {
      /**
       * Предметы
       * @type {Object}
       */
      courses: 'courses',
      /**
       * Флаг загрузки предметов
       * @type {Boolean}
       */
      loadingCources: 'loading'
    }),

    ...mapState(lecturersNamespace, {
      /**
       * Преподаватели
       * @type {Object}
       */
      lecturers: 'lecturers',
      /**
       * Флаг загрузки преподавателей
       * @type {Boolean}
       */
      loadingLecturers: 'loading'
    }),

    /**
     * Флаг загрузки
     * @type {Boolean}
     */
    loading() {
      return this.loadingCources && this.loadingLecturers
    }
  },
  mounted() {
    this.loadCourses()
    this.loadLecturers()
  },
  methods: {
    /**
     * Редактировать предмет
     * @type {Function}
     * @param {String} id - id предмета
     */
    edit(id) {
      this.editing = true
      this.editingId = id
    },

    ...mapActions(coursesNamespace, {
      /**
       * Загрузить предметы
       * @type {Function}
       */
      loadCourses: coursesTypes.actions.LOAD_COURSES
    }),

    ...mapActions(lecturersNamespace, {
      /**
       * Загрузить преподавателей
       * @type {Function}
       */
      loadLecturers: lecturersTypes.actions.LOAD_LECTURERS
    })
  }
}
</script>
