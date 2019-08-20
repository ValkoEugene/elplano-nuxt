<template>
  <v-container :fluid="!loading">
    <!-- eslint-disable -->

    <Loader v-if="loading" />

    <template v-else>
      <Search v-model="search" />

      <v-layout row wrap>
        <template v-for="(course) in courses">
          <v-flex
            v-if="!search || $customHelpers.search(course.title, search)"
            :key="course.id"
            xs12
            sm12
            md4
            class="pa-4"
          >
            <v-card min-height="100" elevation="5">
              <CardTitle>{{ course.title }}</CardTitle>

              <v-card-text class="pb-0">
                <div v-if="!loadingLecturers">
                  <span class="font-weight-bold">{{ $t('lecturers.lecturers') }}:</span>
                  <span v-if="!course.lecturer_ids.length">-</span>

                  <div v-else v-for="id in course.lecturer_ids" :key="id" class="pa-2">
                    <v-avatar class="bg-primary-lighten2" size="32">
                      <v-icon dark>account_circle</v-icon>
                    </v-avatar>
                    {{ getLecturerView(id) }}
                  </div>
                </div>
              </v-card-text>

              <v-card-actions class="pt-0">
                <v-btn icon class="text-primary-darken1" :disabled="updating">
                  <v-icon>star_half</v-icon>
                </v-btn>

                <v-btn icon class="text-primary-darken1" :disabled="updating">
                  <v-icon>work</v-icon>
                </v-btn>

                <v-btn
                  icon
                  class="text-primary-darken1"
                  :disabled="updating"
                  @click="edit(course.id)"
                >
                  <v-icon>edit</v-icon>
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon color="error" :disabled="updating" @click="initDelete(course.id)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </template>

    <Confirm
      :active="deletConfirming"
      @cancel="deletConfirming = false"
      @confirm="onDeleteConfirmed"
    >
      <template v-slot:title>{{ $t('lecturers.confirm') }}</template>
    </Confirm>

    <v-row justify="center">
      <!-- eslint-disable -->
      <v-dialog v-model="editing" fullscreen hide-overlay transition="dialog-bottom-transition">
        <Edit
          v-if="editing"
          :editing-id="editingId"
          :courses="courses"
          :lecturers="lecturers"
          @close="editing = false"
        />
      </v-dialog>
    </v-row>

    <v-btn fixed dark fab bottom right class="bg-primary-darken1" @click="edit('')">
      <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
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
  components: {
    Loader: () =>
      import(
        '../../components/UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      ),
    Search: () =>
      import(
        '../../components/UI-core/search.vue' /* webpackChunkName: 'components/UI-core/search' */
      ),
    CardTitle: () =>
      import(
        '../../components/cards/card-title.vue' /* webpackChunkName: 'components/cards/card-title' */
      ),
    Edit: () =>
      import(
        '../../components/lessons/edit.vue' /* webpackChunkName: 'components/lessons/edit' */
      ),
    Confirm: () =>
      import(
        '../../components/UI-core/confirm.vue' /* webpackChunkName: 'components/UI-core/confirm' */
      )
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
     * Флаг показа подтверждения на удаление
     * @type {Boolean}
     */
    deletConfirming: false,

    /**
     * Id удаляемого предмета
     * @type {String}
     */
    deletId: ''
  }),
  computed: {
    ...mapState(coursesNamespace, {
      /**
       * Предметы
       * @type {Array}
       */
      courses: 'courses',
      /**
       * Id редактируемого предмета
       */
      editingId: 'editingId',
      /**
       * Флаг загрузки предметов
       * @type {Boolean}
       */
      loadingCources: 'loading',
      /**
       * Флаг обновления данных
       * @type {Boolean}
       */
      updating: 'updating'
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
      return this.loadingCources || this.loadingLecturers
    }
  },
  mounted() {
    this.loadCourses()
    this.loadLecturers()
  },
  methods: {
    ...mapMutations(coursesNamespace, {
      /**
       * Установить id редактируемого предмета
       * @type {Function}
       */
      setEditingId: coursesTypes.mutations.SET_EDITING_ID
    }),

    /**
     * Получить отображение преподавателя
     * @type {Function}
     * @param {String} id
     * @returns {String}
     */
    getLecturerView(id) {
      const lecturer = this.lecturers.find((item) => item.id === id)

      return lecturer ? lecturer.view : '-'
    },

    /**
     * Редактировать предмет
     * @type {Function}
     * @param {String} id - id предмета
     */
    edit(id) {
      this.setEditingId(id)
      this.editing = true
    },

    ...mapActions(coursesNamespace, {
      /**
       * Загрузить предметы
       * @type {Function}
       */
      loadCourses: coursesTypes.actions.LOAD_COURSES,
      /**
       * Удалить предмет
       * @type {Function}
       */
      deleteCourse: coursesTypes.actions.DELETE_COURSE
    }),

    /**
     * Открыть подтверждение на удаление
     * @type {Function}
     * @param {String} id
     */
    initDelete(id) {
      this.deletId = id
      this.deletConfirming = true
    },

    /**
     * Обработчик подтверждения удаления
     * @type {Function}
     */
    onDeleteConfirmed() {
      this.deletConfirming = false
      this.deleteCourse(this.deletId)
    },

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
