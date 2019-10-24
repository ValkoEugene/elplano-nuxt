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
        </template>
      </v-layout>
    </template>

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
import { addSnackbarsByStore } from '~/store/snackbars'
import ModalEditComponent from '~/components/modal/modal-edit.vue'

@Component({
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
   * @type {ModalEditComponent}
   */
  @Ref()
  readonly modalEdit!: ModalEditComponent

  /**
   * Строка поиска
   * @type {String}
   */
  search: string = ''

  /**
   * Шаблон модели преподавателя
   * @type {Lecturer}
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
   * @type {Lecturer}
   */
  editModel: Lecturer = { ...this.lectureEmptyModel }

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
   * Получить отображение предмета
   * @type {Function}
   * @param {String} id
   * @returns {String}
   */
  getCourseView(id: string): string {
    const course = this.courses.find((item) => item.id === id)

    return course ? course.title : '-'
  }

  /**
   * Редактировать прпреподавателяе
   * @type {Function}
   * @param {Lecturer} model - модель редактируемого преподавателя
   */
  edit(model: Lecturer): void {
    this.editModel = { ...model }

    this.modalEdit.open()
  }

  /**
   * Создать преподавателя
   * @type {Function}
   */
  async create(data: Lecturer): Promise<void> {
    try {
      this.updating = true
      const lecturer = await lecturersApi.create(data)
      this.lecturers.push(lecturer)

      this.editModel = lecturer
    } catch (error) {
      addSnackbarsByStore(this.$store, error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Обновить преподавателя
   * @type {Function}
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
      addSnackbarsByStore(this.$store, error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }

  /**
   * Удалить преподавателя
   * @type {Function}
   * @param {String} id - id преподавателя
   */
  async deleteLecturer(id: string): Promise<void> {
    try {
      this.updating = true

      await lecturersApi.deleteById(id)
      this.lecturers = this.lecturers.filter((item) => item.id !== id)
    } catch (error) {
      addSnackbarsByStore(this.$store, error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }
}
</script>
