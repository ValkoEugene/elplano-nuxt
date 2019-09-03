<template>
  <Loader v-if="loading" :show-search="true" :show-cards="true" />

  <div v-else>
    <template>
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
            class="pa-3"
          >
            <Card>
              <template v-slot:badges>
                <span v-if="lecturer.active">
                  {{ $t('ui.card.badges.active') }}
                </span>
              </template>

              <template v-slot:title>
                {{ lecturer.view }}
              </template>

              <template v-slot:content>
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
              </template>

              <template v-slot:menu>
                <EditButton
                  :disabled="updating"
                  @click="edit(lecturer.id, lecturer)"
                />

                <DeleteButton
                  :id="lecturer.id"
                  :disabled="updating"
                  :namespace="lecturersNamespace"
                  :action="lecturersTypes.actions.DELETE_LECTURER"
                  :confirm-text="$t('lecturers.confirm')"
                />
              </template>
            </Card>
          </v-flex>
        </template>
      </v-layout>
    </template>

    <ModalEdit
      ref="modal"
      :namespace="lecturersNamespace"
      :edit-model="editModel"
      :edit-schema="editSchema"
      :create-action="lecturersTypes.actions.CREATE_LECTURER"
      :update-action="lecturersTypes.actions.EDIT_LECTURER"
    />

    <AddNew @click="edit('', lectureEmptyModel)" />
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
    Card: () =>
      import(
        '../../components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    ModalEdit: () =>
      import(
        '../../components/modal/modal-edit.vue' /*  webpackChunkName: 'components/modal/modal-edit' */
      )
  },
  mixins: [checkGroup],
  data: () => ({
    /**
     * namespace моудля с преподавателями
     * @type {String}
     */
    lecturersNamespace,

    /**
     * Типы для модуля преподавателей
     * @type {Object}
     */
    lecturersTypes,

    /**
     * Строка поиска
     * @type {String}
     */
    search: '',

    /**
     * Шаблон модели преподавателя
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
    },

    /**
     * Редактируемая модель преподавателя
     * @type {String}
     */
    editModel: {}
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
            label: this.$t('ui.card.badges.active')
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
     * @param {Object} model - модель редактируемого преподавателя
     */
    edit(id, model) {
      this.setEditingId(id)
      this.editModel = { ...model }

      this.$refs.modal.open()
    },

    ...mapMutations(lecturersNamespace, {
      /**
       * Установить id редактируемого преподавателя
       * @type {Functiob}
       */
      setEditingId: lecturersTypes.mutations.SET_EDITING_ID
    }),

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
