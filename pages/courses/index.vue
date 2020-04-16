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

    <ModalWrapper v-model="visible" @action="save">
      <template #content>
        <v-form ref="form" :lazy-validation="true">
          <v-checkbox
            v-model="editModel.active"
            :label="$t('ui.card.badges.active')"
          />

          <v-text-field
            v-model.trim="editModel.title"
            :label="$t('field.title')"
            :rules="[$rules.required]"
            type="text"
            outlined
          />

          <v-select
            v-model="editModel.lecturer_ids"
            :items="lecturers"
            item-value="id"
            item-text="view"
            :label="$t('lecturers.lecturers')"
            multiple
            outlined
            attach
          />
        </v-form>
      </template>
    </ModalWrapper>

    <AddNew @click="edit(courseEmptyModel)" />
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
import { Course } from '~/api/courses.ts'
import { useCourses } from '~/compositions/useCourses.ts'
import { useLecturers } from '~/compositions/useLecturers.ts'
import { search } from '~/utils/helpers.ts'

interface StateI {
  /** Строка поиска */
  search: string
  /** Пустая модель предмета */
  courseEmptyModel: Course
  /** Модель предмета для редактирования */
  editModel: Course
  /** Флаг показа модального окна */
  visible: boolean
}

interface Form {
  /** Функция валидации формы */
  validate: () => boolean
}

export default defineComponent({
  name: 'CoursesPage',
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
    ModalWrapper: () =>
      import(
        '~/components/modal/modal-wrapper.vue' /*  webpackChunkName: 'components/modal/modal-wrapper' */
      )
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    const vuexModules = context.root.$vuexModules
    /** Ссылка на компонент с формой */
    const form = ref<Form>(null)

    /** Пустая модель предмета */
    const courseEmptyModel: Course = {
      id: '',
      active: true,
      title: '',
      lecturer_ids: []
    }

    /** Состояние */
    const state = reactive<StateI>({
      search: '',
      visible: false,
      courseEmptyModel: { ...courseEmptyModel },
      editModel: { ...courseEmptyModel }
    })

    const {
      courses,
      loading: loadingCourses,
      updating,
      update,
      create,
      deleteCourse
    } = useCourses(vuexModules)
    const { lecturers, loading: loadingLecturers } = useLecturers(vuexModules)

    /** Флаг загрузки */
    const loading = computed(
      () => loadingCourses.value || loadingLecturers.value
    )

    /**  Отфильтрованные по строке поиска предметы */
    const filtredCourses = computed(() => {
      if (!state.search) return courses.value

      return courses.value.filter((course) =>
        search(course.title, state.search)
      )
    })

    /** Получить отображение преподавателя */
    const getLecturerView = (id: string): string => {
      const lecturer = lecturers.value.find((item) => item.id === id)

      return lecturer && lecturer.view ? lecturer.view : '-'
    }

    /** Редактировать предмет  */
    const edit = (model: Course): void => {
      state.editModel = { ...model }
      state.visible = true
    }

    /** Сохранить изменения предмета */
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
      form,
      filtredCourses,
      loading,
      updating,
      lecturers,
      getLecturerView,
      edit,
      save,
      deleteCourse
    }
  }
})
</script>
