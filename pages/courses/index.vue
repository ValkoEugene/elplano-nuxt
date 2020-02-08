<template>
  <Loader v-if="loading" :show-search="true" :show-cards="true" />

  <div v-else>
    <v-layout row wrap>
      <Search v-model="search" />

      <v-flex v-if="!filtredCourses.length" xs12 class="pa-3">
        <v-alert type="info" prominent>
          <span>{{ $t('lesson.empty') }}</span>
        </v-alert>
      </v-flex>

      <v-flex
        v-for="course in filtredCourses"
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
    </v-layout>

    <ModalEdit
      ref="modalEdit"
      :edit-model="editModel"
      :edit-schema="editSchema"
      :updating="updating"
      @create="create"
      @update="update"
    />

    <AddNew @click="edit(courseEmptyModel)" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Ref } from 'vue-property-decorator'
import { Course, courseApi } from '~/api/courses.ts'
import CoursesList from '~/mixins/CoursesList.ts'
import LecturersList from '~/mixins/LecturersList.ts'
import CheckGroup from '~/mixins/CheckGroup.ts'
import ModalEditComponent from '~/components/modal/modal-edit.vue'

@Component({
  components: {
    Loader: () =>
      import(
        '~/components/UI-core/loaders/loader.vue' /* webpackChunkName: 'components/UI-core/loaders/loader' */
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
  }
})
export default class LessonsPage extends Mixins(
  CheckGroup,
  LecturersList,
  CoursesList
) {
  /**
   * Ссылка на экземпляр компонента ModalEdit
   * @type {ModalEditComponent}
   */
  @Ref()
  readonly modalEdit!: ModalEditComponent

  /**
   * Строка поиска
   * @type {string}
   */
  search: string = ''

  /**
   * Пустая модель предмета
   * @type {Course}
   */
  courseEmptyModel: Course = {
    id: '',
    active: true,
    title: '',
    lecturer_ids: []
  }

  /**
   * Редактируемый предмет
   * @type {Course}
   */
  editModel: Course = { ...this.courseEmptyModel }

  /**
   * Флаг обновления
   * @type {boolean}
   */
  updating: boolean = false

  /**
   * Флаг загрузки
   * @type {boolean}
   */
  get loading(): boolean {
    return this.loadingCourses || this.loadingLecturers
  }

  /**
   * Схема для редактирования
   * @type {any}
   */
  get editSchema() {
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

  /**
   * Отфильтрованные по строке поиска предметы
   */
  get filtredCourses(): Course[] {
    if (!this.search) return this.courses

    return this.courses.filter((course) =>
      this.$customHelpers.search(course.title, this.search)
    )
  }

  /**
   * Получить отображение преподавателя
   * @type {Function}
   * @param {String} id
   * @returns {String}
   */
  getLecturerView(id: string): string {
    const lecturer = this.lecturers.find((item) => item.id === id)

    return lecturer && lecturer.view ? lecturer.view : '-'
  }

  /**
   * Редактировать предмет
   * @type {Function}
   * @param {Course} model - модель редакртируемого предмета
   */
  edit(model: Course): void {
    this.editModel = { ...model }
    this.modalEdit.open()
  }

  /**
   * Создать пердмет
   * @type {Function}
   */
  async create(data: Course): Promise<void> {
    try {
      this.updating = true
      const course = await courseApi.create(data)
      this.courses.push(course)

      this.editModel = course
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Обновить предмет
   * @type {Function}
   */
  async update(data: Course): Promise<void> {
    if (!data.id) return

    try {
      this.updating = true

      const course = await courseApi.update(data, data.id)
      this.courses = this.courses.map((item) =>
        item.id === course.id ? course : item
      )
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Удалить предмет
   * @type {Function}
   * @param {String} id - id предмета
   */
  async deleteCourse(id: string): Promise<void> {
    try {
      this.updating = true

      await courseApi.deleteById(id)
      this.courses = this.courses.filter((item) => item.id !== id)
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }
}
</script>
