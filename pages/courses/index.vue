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
            <Card>
              <template v-slot:badges>
                <span v-if="course.active">
                  {{ $t('ui.card.badges.active') }}
                </span>
              </template>

              <template v-slot:title>
                {{ course.title }}
              </template>

              <template v-slot:content>
                <div>
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
                      <v-avatar size="32">
                        <img src="/images/professor.png" />
                      </v-avatar>
                      {{ getLecturerView(id) }}
                    </div>
                  </template>
                </div>
              </template>

              <template v-slot:menu>
                <v-list-item :disabled="true">
                  <v-icon class="pr-2">star_half</v-icon>
                  {{ $t('ratings.add') }}
                </v-list-item>
                <v-list-item :disabled="true">
                  <v-icon class="pr-2">work</v-icon>
                  {{ $t('tasks.add') }}
                </v-list-item>
                <EditButton :disabled="updating" @click="edit(course)" />
                <DeleteButton
                  :id="course.id"
                  :disabled="updating"
                  :confirm-text="$t('lesson.confirm')"
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

    <AddNew @click="edit(courseEmptyModel)" />
  </div>
</template>

<script>
import Course from '../../models/Course'
import Lecturer from '../../models/Lecturer'
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
      return Course.getUpdatingStatus()
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
    Course.$apiFetch()
    Lecturer.$apiFetch()
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
     * Создать пердмет
     * @type {Function}
     */
    async create(data) {
      const course = await Course.$apiCreate(data)

      this.editModel = course
    },

    /**
     * Обновить предмет
     * @type {Function}
     */
    update(data) {
      Course.$apiUpdate(data)
    },

    /**
     * Удалить предмет
     * @type {Function}
     * @param {String} id - id предмета
     */
    delteCourse(id) {
      Course.$apiDelete(id)
    }
  }
}
</script>
