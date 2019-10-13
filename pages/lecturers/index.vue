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
                  @delete="delteCourse(course.id)"
                />
              </template>
            </Card>
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

    <AddNew @click="edit(lectureEmptyModel)" />
  </div>
</template>

<script>
import Course from '~/models/Course'
import Lecturer from '~/models/Lecturer'
import checkGroup from '~/mixins/checkgroup'

export default {
  name: 'LecturersPage',
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
  },
  mixins: [checkGroup],
  data: () => ({
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
    /**
     * Список преподавателей
     * @type {Array}
     */
    courses() {
      return Course.all()
    },

    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating() {
      return Lecturer.getUpdatingStatus()
    },

    /**
     * Преподаватели
     * @type {Array}
     */
    lecturers() {
      return Lecturer.all()
    },

    /**
     * Флаг загрузки
     * @type {Boolean}
     */
    loading() {
      return Course.getFetchingStatus() || Lecturer.getFetchingStatus()
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
    Course.$apiFetch()
    Lecturer.$apiFetch()
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
     * @param {Object} model - модель редактируемого преподавателя
     */
    edit(model) {
      this.editModel = { ...model }

      this.$refs.modal.open()
    },

    /**
     * Создать преподавателя
     * @type {Function}
     */
    async create(data) {
      const lecturer = await Lecturer.$apiCreate(data)

      this.editModel = lecturer
    },

    /**
     * Обновить преподавателя
     * @type {Function}
     */
    update(data) {
      Lecturer.$apiUpdate(data)
    },

    /**
     * Удалить преподавателя
     * @type {Function}
     * @param {String} id - id преподавателя
     */
    delteCourse(id) {
      Lecturer.$apiDelete(id)
    }
  }
}
</script>
