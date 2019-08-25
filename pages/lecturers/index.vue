<template>
  <v-container :fluid="!loading" class="pa-0">
    <Loader v-if="loading" />

    <template v-else>
      <v-alert v-if="!lecturers.length" type="info" prominent>
        <span>{{ $t('lecturers.empty') }}</span>
      </v-alert>

      <v-layout v-else row wrap>
        <Search v-model="search" />

        <template v-for="lecturer in lecturers">
          <v-flex
            v-if="!search || $customHelpers.search(lecturer.view, search)"
            :key="lecturer.id"
            xs12
            sm12
            md4
            :class="[$vuetify.breakpoint.smAndDown ? 'pa-3' : 'pa-6']"
          >
            <v-card min-height="100">
              <CardBadge v-if="lecturer.active">{{
                $t('ui.card.badges.active')
              }}</CardBadge>

              <CardTitle> {{ lecturer.view }}</CardTitle>

              <v-card-text class="pb-0">
                <div v-if="!loadingCources">
                  <span class="font-weight-bold"
                    >{{ $t('lesson.lessons') }}:</span
                  >
                  <span v-if="!lecturer.course_ids.length">-</span>

                  <template v-else>
                    <div
                      v-for="id in lecturer.course_ids"
                      :key="id"
                      class="mb-1"
                    >
                      {{ getCourseView(id) }}
                    </div>
                  </template>
                </div>
              </v-card-text>

              <v-card-actions class="pt-0">
                <EditButton
                  :disabled="updating"
                  @click="edit(lecturer.id, lecturer)"
                />

                <v-spacer></v-spacer>

                <DeleteButton
                  :id="lecturer.id"
                  :disabled="updating"
                  :namespace="lecturersNamespace"
                  :action="deleteAction"
                  :confirm-text="$t('lecturers.confirm')"
                />
              </v-card-actions>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </template>

    <AddNew @click="edit('', lectureEmptyModel)" />
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
import {
  namespace as modalEditNamespace,
  Types as modalEditTypes
} from '../../store/modal/edit'
import checkGroup from '../../mixins/checkgroup'

export default {
  name: 'LecturersPage',
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
    AddNew: () =>
      import(
        '../../components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
      ),
    DeleteButton: () =>
      import(
        '../../components/UI-core/delete-button.vue' /* webpackChunkName: 'components/UI-core/delete-button' */
      ),
    EditButton: () =>
      import(
        '../../components/UI-core/edit-button.vue' /* webpackChunkName: 'components/UI-core/edit-button' */
      ),
    CardBadge: () =>
      import(
        '../../components/cards/card-badge.vue' /* webpackChunkName: 'components/cards/card-badge' */
      )
  },
  mixins: [checkGroup],
  data: () => ({
    deleteAction: lecturersTypes.actions.DELETE_LECTURER,
    lecturersNamespace,
    /**
     * Строка поиска
     * @type {String}
     */
    search: '',

    /**
     * Локальная копия преподавателя
     * @type {Object}
     */
    lectureEmptyModel: {
      id: '',
      active: true,
      first_name: '',
      last_name: '',
      patronymic: '',
      avatar: '',
      course_ids: []
    }
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
      return this.loadingCources || this.loadingLecturers
    },

    /**
     * Схема для редактирования
     * @type {{ fields: Array }}
     */
    editSchema() {
      return {
        fields: [
          {
            model: 'active',
            type: 'v-checkbox',
            label: 'Препадает'
          },
          {
            model: 'last_name',
            type: 'v-text-field',
            label: this.$t('field.lastName'),
            placeholder: this.$t('field.lastName'),
            rules: [this.$rules.required],
            inputType: 'text'
          },
          {
            model: 'first_name',
            type: 'v-text-field',
            label: this.$t('field.firstName'),
            placeholder: this.$t('field.firstName'),
            rules: [this.$rules.required],
            inputType: 'text'
          },
          {
            model: 'patronymic',
            type: 'v-text-field',
            label: this.$t('field.patronymic'),
            placeholder: this.$t('field.patronymic'),
            rules: [this.$rules.required],
            inputType: 'text'
          },
          {
            model: 'course_ids',
            type: 'v-select',
            multiple: true,
            items: this.courses,
            itemValue: 'id',
            itemText: 'title',
            label: this.$t('lesson.lessons')
          }
        ]
      }
    }
  },
  mounted() {
    this.loadCourses()
    this.loadLecturers()
  },
  methods: {
    ...mapActions(modalEditNamespace, {
      /**
       * Инициализация редактирования (открывает модальное окно)
       * @type {Function}
       */
      initEdit: modalEditTypes.actions.INIT_EDIT
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
    edit(id, model) {
      this.initEdit({
        id,
        namespace: lecturersNamespace,
        editModel: model,
        editSchema: this.editSchema,
        updateAction: lecturersTypes.actions.EDIT_LECTURER,
        createAction: lecturersTypes.actions.CREATE_LECTURER
      })
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
    })
  }
}
</script>
