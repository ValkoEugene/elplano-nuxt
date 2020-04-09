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

    <ModalWrapper v-model="visible" @action="save">
      <template #content>
        <v-form ref="form" :lazy-validation="true">
          <v-checkbox
            v-model="editModel.active"
            :label="$t('ui.card.badges.active')"
          />

          <v-text-field
            v-model.trim="editModel.last_name"
            :label="$t('field.lastName')"
            :rules="[$rules.required]"
            type="text"
            outlined
          />

          <v-text-field
            v-model.trim="editModel.first_name"
            :label="$t('field.firstName')"
            :rules="[$rules.required]"
            type="text"
            outlined
          />

          <v-text-field
            v-model.trim="editModel.patronymic"
            :label="$t('field.patronymic')"
            :rules="[$rules.required]"
            type="text"
            outlined
          />

          <v-select
            v-model="editModel.course_ids"
            :items="courses"
            item-value="id"
            item-text="title"
            :label="$t('lesson.lessons')"
            multiple
            outlined
          />
        </v-form>
      </template>
    </ModalWrapper>

    <AddNew @click="edit(lectureEmptyModel)" />
  </div>
</template>

<script lang="ts">
import {
  reactive,
  computed,
  toRefs,
  ref,
  defineComponent
} from '@vue/composition-api'
import { Lecturer } from '~/api/lecturers.ts'
import { useCourses } from '~/compositions/useCourses.ts'
import { useLecturers } from '~/compositions/useLecturers.ts'
import { search } from '~/utils/helpers.ts'

interface LecturersState {
  /** Строка поиска */
  search: string
  /** Пустая модель преподавателя */
  lectureEmptyModel: Lecturer
  /** Модель преподавателя на редактирование  */
  editModel: Lecturer
  /** Флаг показа модального окна */
  visible: boolean
}

interface Form {
  /** Функция валидации формы */
  validate: () => boolean
}

export default defineComponent({
  name: 'LecturersPage',
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
    ModalWrapper: () =>
      import(
        '~/components/modal/modal-wrapper.vue' /*  webpackChunkName: 'components/modal/modal-wrapper' */
      )
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    /** Ссылка на компонент с формой */
    const form = ref<Form>(null)

    const {
      lecturers,
      loading: loadingLecturers,
      updating,
      create,
      update,
      deleteLecturer
    } = useLecturers(context.root.$vuexModules)
    const { courses, loading: loadingCourses } = useCourses(
      context.root.$vuexModules
    )

    const lectureEmptyModel = {
      id: '',
      active: true,
      first_name: '',
      last_name: '',
      patronymic: '',
      avatar: '',
      course_ids: []
    }

    /** Состояние компонента */
    const state = reactive<LecturersState>({
      search: '',
      lectureEmptyModel: { ...lectureEmptyModel },
      editModel: { ...lectureEmptyModel },
      visible: false
    })

    /** Флаг загрузки данных */
    const loading = computed(
      () => loadingCourses.value || loadingLecturers.value
    )

    /** Отфильтрованный список преподавателей */
    const filtredLecturers = computed(() => {
      if (!state.search) return lecturers.value

      return lecturers.value.filter((lecturer) =>
        search(lecturer.view || '', state.search)
      )
    })

    /** Получить отображение предмета по id */
    const getCourseView = (id: string): string => {
      const course = courses.value.find((item) => item.id === id)

      return course ? course.title : '-'
    }

    /** Инициализировать редактирование преподавателя */
    const edit = (model: Lecturer): void => {
      state.editModel = { ...model }
      state.visible = true
    }

    /** Сохранить изменения преподавателя */
    const save = async () => {
      if (!form.value || !form.value.validate()) return

      const response = state.editModel.id
        ? await update(state.editModel)
        : await create(state.editModel)

      if (!response) return

      state.editModel = { ...response }
    }

    return {
      ...toRefs(state),
      loading,
      updating,
      lecturers,
      filtredLecturers,
      courses,
      edit,
      getCourseView,
      create,
      update,
      deleteLecturer,
      form,
      save
    }
  }
})
</script>
