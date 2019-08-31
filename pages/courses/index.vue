<template>
  <Loader v-if="loading" :show-search="true" :show-cards="true" />

  <div v-else>
    <template>
      <v-alert v-if="!courses.length" type="info" prominent>
        <span>{{ $t('lesson.empty') }}</span>
      </v-alert>

      <v-layout v-else row wrap>
        <Search v-model="search" />

        <template v-for="course in courses">
          <v-flex
            v-if="!search || $customHelpers.search(course.title, search)"
            :key="course.id"
            xs12
            sm12
            md4
            class="pa-3"
          >
            <v-card min-height="100">
              <CardBadge v-if="course.active">{{
                $t('ui.card.badges.active')
              }}</CardBadge>

              <CardTitle>{{ course.title }}</CardTitle>

              <v-card-text class="pb-0">
                <div v-if="!loadingLecturers">
                  <span class="font-weight-bold"
                    >{{ $t('lecturers.lecturers') }}:</span
                  >
                  <span v-if="!course.lecturer_ids.length">-</span>

                  <template v-else>
                    <div
                      v-for="id in course.lecturer_ids"
                      :key="id"
                      class="ma-1"
                    >
                      <v-avatar class="bg-primary-lighten2" size="32">
                        <v-icon dark>account_circle</v-icon>
                      </v-avatar>
                      {{ getLecturerView(id) }}
                    </div>
                  </template>
                </div>
              </v-card-text>

              <CardMenu>
                <v-list-item :disabled="true">
                  <v-icon class="pr-2">star_half</v-icon>
                  {{ $t('ratings.add') }}
                </v-list-item>
                <v-list-item :disabled="true">
                  <v-icon class="pr-2">work</v-icon>
                  {{ $t('tasks.add') }}
                </v-list-item>
                <EditButton
                  :disabled="updating"
                  @click="edit(course.id, course)"
                />
                <DeleteButton
                  :id="course.id"
                  :disabled="updating"
                  :namespace="coursesNamespace"
                  :action="coursesTypes.actions.DELETE_COURSE"
                  :confirm-text="$t('lesson.confirm')"
                />
              </CardMenu>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </template>

    <ModalEdit
      ref="modal"
      :namespace="coursesNamespace"
      :edit-model="editModel"
      :edit-schema="editSchema"
      :create-action="coursesTypes.actions.CREATE_COURSE"
      :update-action="coursesTypes.actions.EDIT_COURSE"
    />

    <AddNew @click="edit('', courseEmptyModel)" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  namespace as coursesNamespace,
  Types as coursesTypes
} from '../../store/courses'
import {
  namespace as lecturersNamespace,
  Types as lecturersTypes
} from '../../store/lecturers'
import checkGroup from '../../mixins/checkgroup'

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
      ),
    CardMenu: () =>
      import(
        '../../components/cards/card-menu.vue' /* webpackChunkName: 'components/cards/card-menu' */
      ),
    ModalEdit: () =>
      import(
        '../../components/modal/modal-edit.vue' /*  webpackChunkName: 'components/modal/modal-edit' */
      )
  },
  mixins: [checkGroup],
  data: () => ({
    /**
     * namaspace модуля предметов
     * @type {String}
     */
    coursesNamespace,

    /**
     * Типы для модуля предметов
     * @type {Object}
     */
    coursesTypes,

    /**
     * Строка поиска
     * @type {String}
     */
    search: '',

    /**
     * Редактируемая модель предмета
     * @type {String}
     */
    editModel: {},

    /**
     * Шаблон модели предмета
     * @type {Object}
     */
    courseEmptyModel: {
      id: '',
      active: true,
      title: '',
      lecturer_ids: []
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
            label: this.$t('ui.card.badges.active')
          },
          {
            model: 'title',
            type: 'v-text-field',
            label: this.$t('field.title'),
            placeholder: this.$t('field.title'),
            rules: [this.$rules.required],
            inputType: 'text'
          },
          {
            model: 'lecturer_ids',
            type: 'v-select',
            multiple: true,
            items: this.lecturers,
            itemValue: 'id',
            itemText: 'view',
            label: this.$t('lecturers.lecturers')
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
     * @param {Object} model - модель редакртируемого предмета
     */
    edit(id, model) {
      this.setEditingId(id)
      this.editModel = { ...model }

      this.$refs.modal.open()
    },

    ...mapMutations(coursesNamespace, {
      /**
       * Установить id редактируемого предмета
       * @type {Functiob}
       */
      setEditingId: coursesTypes.mutations.SET_EDITING_ID
    }),

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
