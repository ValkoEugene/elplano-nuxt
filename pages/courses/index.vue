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
            <CourseCard
              :course="course"
              :updating="updating"
              :get-lecturer-view="getLecturerView"
              @deleteCourse="deleteCourse"
              @editCourse="edit"
            />
          </v-flex>
        </template>
      </v-layout>
    </template>

    <ModalEdit
      ref="modal"
      :edit-model="editModel"
      :edit-schema="editSchema"
      :updating="updating"
      @create="create"
      @update="update"
    />

    <AddNew @click="edit(courseEmptyModel)" />
  </div>
</template>

<script>
import courseApi from '~/api/courses'
import lecturersApi from '~/api/lecturers'
import checkGroup from '~/mixins/checkgroup'
import { addSnackbarsByStore } from '~/store/snackbars'

export default {
  name: 'LessonsPage',
  components: {
    Loader: () =>
      import(
        '~/components/UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      ),
    Search: () =>
      import(
        '~/components/UI-core/search.vue' /* webpackChunkName: 'components/UI-core/search' */
      ),
    AddNew: () =>
      import(
        '~/components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
      ),
    CourseCard: () =>
      import(
        '~/components/courses/CourseCard.vue' /* webpackChunkName: 'components/courses' */
      ),
    ModalEdit: () =>
      import(
        '~/components/modal/modal-edit.vue' /*  webpackChunkName: 'components/modal/modal-edit' */
      )
  },
  mixins: [checkGroup],
  data: () => ({
    /**
     * Строка поиска
     * @type {String}
     */
    search: '',

    /**
     * Редактируемая модель предмета
     * @type {Object}
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
    },

    /**
     * Список преподавателей
     * @type {Array}
     */
    courses: [],

    /**
     * Преподаватели
     * @type {Array}
     */
    lecturers: [],

    /**
     * Флаг загрузки
     * @type {Boolean}
     */
    loading: true,

    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating: false
  }),
  computed: {
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
    this.loadData()
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
     * @param {Object} model - модель редакртируемого предмета
     */
    edit(model) {
      this.editModel = { ...model }

      this.$refs.modal.open()
    },

    /**
     * Загрузить данные
     */
    async loadData() {
      try {
        const [courses, lecturers] = await Promise.all([
          courseApi.loadData(),
          lecturersApi.loadData()
        ])

        this.courses = courses
        this.lecturers = lecturers

        this.loading = false
      } catch (error) {
        addSnackbarsByStore(this.$store, error.snackbarErrors)
      }
    },

    /**
     * Создать пердмет
     * @type {Function}
     */
    async create(data) {
      try {
        this.updating = true
        const course = await courseApi.create(data)
        this.courses.push(course)

        this.editModel = course
      } catch (error) {
        addSnackbarsByStore(this.$store, error.snackbarErrors)
      } finally {
        this.updating = false
      }
    },

    /**
     * Обновить предмет
     * @type {Function}
     */
    async update(data) {
      try {
        this.updating = true

        const course = await courseApi.update(data, data.id)
        this.courses = this.courses.map((item) =>
          item.id === course.id ? course : item
        )
      } catch (error) {
        addSnackbarsByStore(this.$store, error.snackbarErrors)
      } finally {
        this.updating = false
      }
    },

    /**
     * Удалить предмет
     * @type {Function}
     * @param {String} id - id предмета
     */
    async deleteCourse(id) {
      try {
        this.updating = true

        await courseApi.deleteById(id)
        this.courses = this.courses.filter((item) => item.id !== id)
      } catch (error) {
        addSnackbarsByStore(this.$store, error.snackbarErrors)
      } finally {
        this.updating = false
      }
    }
  }
}
</script>
