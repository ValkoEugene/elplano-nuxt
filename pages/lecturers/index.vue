<template>
  <v-container :fluid="!loading">
    <!-- eslint-disable -->

    <Loader v-if="loading" />

    <template v-else>
      <Search v-model="search" />

      <v-layout row wrap>
        <template v-for="(lecturer) in lecturers">
          <v-flex
            v-if="!search || $customHelpers.search(lecturer.view, search)"
            :key="lecturer.id"
            xs12
            sm12
            md4
            class="pa-4"
          >
            <v-card min-height="100" elevation="5">
              <CardTitle>{{ lecturer.view }}</CardTitle>

              <v-card-text class="pb-0">
                <div v-if="!loadingCources">
                  <span class="font-weight-bold">{{ $t('lesson.lessons') }}:</span>
                  <span v-if="!lecturer.course_ids.length">-</span>

                  <div v-else v-for="id in lecturer.course_ids" :key="id" class="pa-2">
                    <v-avatar class="bg-primary-lighten2" size="32">
                      <v-icon dark>book</v-icon>
                    </v-avatar>
                    {{ getCourseView(id) }}
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
                  @click="edit(lecturer.id)"
                >
                  <v-icon>edit</v-icon>
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon color="error" :disabled="updating" @click="initDelete(lecturer.id)">
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
  name: 'LecturersPage',
  components: {
    Loader: () => import('../../components/UI-core/loader.vue'),
    Search: () => import('../../components/UI-core/search.vue'),
    CardTitle: () => import('../../components/cards/card-title.vue'),
    Edit: () => import('../../components/lecturers/edit.vue'),
    Confirm: () => import('../../components/UI-core/confirm.vue')
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
     * Id удаляемого преподавателя
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
       * Id редактируемого преподавателя
       */
      editingId: 'editingId',
      /**
       * Флаг загрузки преподавателей
       * @type {Boolean}
       */
      loadingLecturers: 'loading',
      /**
       * Флаг обновления данных
       * @type {Boolean}
       */
      updating: 'updating'
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
    ...mapMutations(lecturersNamespace, {
      /**
       * Установить id редактируемого преподавателя
       * @type {Function}
       */
      setEditingId: lecturersTypes.mutations.SET_EDITING_ID
    }),

    /**
     * Получить отображение предмета
     * @type {Function}
     * @param {String} id
     * @returns {String}
     */
    getCourseView(id) {
      const course = this.courses.find((item) => item.id === id)

      return course ? course.title : '-'
    },

    /**
     * Редактировать прпреподавателяе
     * @type {Function}
     * @param {String} id - id преподавателя
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
      loadCourses: coursesTypes.actions.LOAD_COURSES
    }),

    ...mapActions(lecturersNamespace, {
      /**
       * Загрузить преподавателей
       * @type {Function}
       */
      loadLecturers: lecturersTypes.actions.LOAD_LECTURERS,
      /**
       * Удалить препадователя
       * @type {Function}
       */
      deleteLecturer: lecturersTypes.actions.DELETE_LECTURER
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
      this.deleteLecturer(this.deletId)
    }
  }
}
</script>
