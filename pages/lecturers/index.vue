<template>
  <Loader v-if="loading" :show-search="true" :show-cards="true" />

  <div v-else>
    <v-layout row wrap>
      <Search v-model="search" />

      <v-flex v-if="!filtredLecturers.length" xs12 class="pa-3">
        <v-alert type="info" prominent>
          <span>{{ $t('lecturers.empty') }}</span>
        </v-alert>
      </v-flex>

      <v-flex
        v-for="lecturer in filtredLecturers"
        :key="lecturer.id"
        xs12
        sm12
        md4
        class="pa-3"
      >
        <Card avatar-url="/images/professor.png">
          <template v-slot:badges>
            <span v-if="lecturer.active">
              {{ $t('ui.card.badges.active') }}
            </span>
          </template>

          <template v-slot:title>
            {{ lecturer.view }}
          </template>

          <template v-slot:content>
            <div>
              <span class="font-weight-bold">{{ $t('lesson.lessons') }}:</span>
              <span v-if="!lecturer.course_ids.length">-</span>

              <template v-else>
                <div v-for="id in lecturer.course_ids" :key="id" class="mb-1">
                  {{ getCourseView(id) }}
                </div>
              </template>
            </div>
          </template>

          <template v-slot:menu>
            <EditButton :disabled="updating" @click="edit(lecturer)" />

            <DeleteButton
              :id="lecturer.id"
              :disabled="updating"
              :confirm-text="$t('lecturers.confirm')"
              @delete="deleteLecturer(lecturer.id)"
            />
          </template>
        </Card>
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

    <AddNew @click="edit(lectureEmptyModel)" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Ref } from 'vue-property-decorator'
import CheckGroup from '~/mixins/CheckGroup.ts'
import CoursesList from '~/mixins/CoursesList.ts'
import LecturersList from '~/mixins/LecturersList.ts'
import { Lecturer, lecturersApi } from '~/api/lecturers.ts'
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
    DeleteButton: () =>
      import(
        '~/components/UI-core/delete-button.vue' /* webpackChunkName: 'components/UI-core/delete-button' */
      ),
    EditButton: () =>
      import(
        '~/components/UI-core/edit-button.vue' /* webpackChunkName: 'components/UI-core/edit-button' */
      ),
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    ModalEdit: () =>
      import(
        '~/components/modal/modal-edit.vue' /*  webpackChunkName: 'components/modal/modal-edit' */
      )
  }
})
export default class LecturersPage extends Mixins(
  CheckGroup,
  LecturersList,
  CoursesList
) {
  /**
   * Ссылка на экземпляр компонента ModalEdit
   */
  @Ref()
  readonly modalEdit!: ModalEditComponent

  /**
   * Строка поиска
   */
  search: string = ''

  /**
   * Шаблон модели преподавателя
   */
  lectureEmptyModel: Lecturer = {
    id: '',
    active: true,
    first_name: '',
    last_name: '',
    patronymic: '',
    avatar: '',
    course_ids: []
  }

  /**
   * Редактируемая модель преподавателя
   */
  editModel: Lecturer = { ...this.lectureEmptyModel }

  /**
   * Флаг обновления
   */
  updating: boolean = false

  /**
   * Флаг загрузки
   */
  get loading(): boolean {
    return this.loadingCourses || this.loadingLecturers
  }

  /**
   * Схема для редактирования
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

  /**
   * Отфлильтрованный по строке поиска список преподавателей
   */
  get filtredLecturers(): Lecturer[] {
    if (!this.search) return this.lecturers

    return this.lecturers.filter((lecturer) =>
      this.$customHelpers.search(lecturer.view || '', this.search)
    )
  }

  /**
   * Получить отображение предмета
   */
  getCourseView(id: string): string {
    const course = this.courses.find((item) => item.id === id)

    return course ? course.title : '-'
  }

  /**
   * Редактировать прпреподавателяе
   */
  edit(model: Lecturer): void {
    this.editModel = { ...model }

    this.modalEdit.open()
  }

  /**
   * Создать преподавателя
   */
  async create(data: Lecturer): Promise<void> {
    try {
      this.updating = true
      const lecturer = await lecturersApi.create(data)
      this.lecturers.push(lecturer)

      this.editModel = lecturer
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Обновить преподавателя
   */
  async update(data: Lecturer): Promise<void> {
    if (!data.id) return

    try {
      this.updating = true

      const lecturer = await lecturersApi.update(data, data.id)
      this.lecturers = this.lecturers.map((item) =>
        item.id === lecturer.id ? lecturer : item
      )
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Удалить преподавателя
   */
  async deleteLecturer(id: string): Promise<void> {
    try {
      this.updating = true

      await lecturersApi.deleteById(id)
      this.lecturers = this.lecturers.filter((item) => item.id !== id)
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }
}
</script>
