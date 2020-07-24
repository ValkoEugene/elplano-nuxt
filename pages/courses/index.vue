<template>
  <div v-if="loading">
    <v-skeleton-loader
      v-for="i in 10"
      :key="i"
      :height="48"
      type="list-item"
      class="elevation-2 mb-2"
    />
  </div>

  <div v-else class="course__wrapper">
    <v-alert v-if="!courses.length" type="info" prominent>
      <span>{{ $t('lesson.empty') }}</span>
    </v-alert>

    <v-expansion-panels v-else v-model="expanded">
      <v-expansion-panel
        v-for="(course, index) in courses"
        :key="course.id"
        class="mb-2"
      >
        <v-expansion-panel-header>
          <div class="header">
            <v-icon v-if="course.active" color="success" class="active-icon">
              check_circle_outline
            </v-icon>
            <div>{{ course.title }}</div>
          </div>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <course-info
            v-if="index === expanded"
            ref="courseInfo"
            :key="course.id"
            :course-id="course.id"
            @onEdit="edit(course)"
            @onDelete="(id) => deleteCourse(id)"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <ModalWrapper v-model="visibleForm">
      <template #action>
        <v-btn dark text @click="save">{{ $t(`actions.save`) }}</v-btn>
      </template>

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

    <AddNew @click="addNew" />
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
import { CourseEditModel, CourseIndex, courseApi } from '~/api/courses.ts'
import { useCourses } from '~/compositions/useCourses.ts'
import { useLecturers } from '~/compositions/useLecturers.ts'

const components = {
  Card: () =>
    import(
      '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
    ),
  AddNew: () =>
    import(
      '~/components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
    ),
  ModalWrapper: () =>
    import(
      '~/components/modal/modal-wrapper.vue' /*  webpackChunkName: 'components/modal/modal-wrapper' */
    ),
  CourseInfo: () =>
    import(
      '~/components/courses/course-info.vue' /* webpackChunkName: 'components/courses/course-info' */
    )
}

interface StateI {
  /** Пустая модель предмета */
  courseEmptyModel: CourseEditModel
  /** Модель предмета для редактирования */
  editModel: CourseEditModel
  /** Флаг показа модального окна с формой */
  visibleForm: boolean
  /** Флаг загрузки информации о предмете */
  loadCourseInfo: boolean
  /** Индекс открытого на просмотр элемента */
  expanded: number | undefined
}

interface Form {
  /** Функция валидации формы */
  validate: () => boolean
}

export default defineComponent({
  name: 'CoursesTablePage',
  components,
  setup(_, context) {
    const vuexModules = context.root.$vuexModules

    /** Ссылка на компонент с формой */
    const form = ref<Form>(null)

    /**
     * TODO указать в тиа компонент CourseInfo ts не позволяет
     * Ссылка на компонент с информацией о предмете
     */
    const courseInfo = ref<any>(null)

    /** Флаг что пользователь является старостой */
    const isPresident = vuexModules.User.isPresident

    /** Пустая модель предмета */
    const courseEmptyModel: CourseEditModel = {
      id: '',
      active: true,
      title: '',
      lecturer_ids: []
    }

    /** Состояние */
    const state = reactive<StateI>({
      visibleForm: false,
      courseEmptyModel: { ...courseEmptyModel },
      editModel: { ...courseEmptyModel },
      loadCourseInfo: false,
      expanded: undefined
    })

    const {
      courses,
      loading: loadingCourses,
      updating,
      update,
      create,
      deleteCourse
    } = useCourses(vuexModules)

    /** Подгружаем только для старосты */
    const { lecturers, loading: loadingLecturers } = useLecturers(vuexModules, {
      loadOnMount: isPresident
    })

    /** Флаг загрузки */
    const loading = computed(
      () => loadingCourses.value || (isPresident && loadingLecturers.value)
    )

    /** Сохранить изменения предмета */
    const save = async () => {
      if (!form.value || !form.value.validate()) return

      const isNew = state.editModel.id
      isNew ? await update(state.editModel) : await create(state.editModel)

      // Обновляем данные в компоненте с подробной информацией
      if (
        courseInfo.value &&
        courseInfo.value[0] &&
        typeof courseInfo.value[0].show === 'function'
      ) {
        courseInfo.value[0].show()
      }

      state.visibleForm = false
    }

    /** Добавить новый предмет */
    const addNew = () => {
      state.editModel = { ...state.courseEmptyModel }
      state.visibleForm = true
    }

    /** Редактировать предмет */
    const edit = async (course: CourseIndex) => {
      try {
        state.loadCourseInfo = true
        state.editModel = await courseApi.show(course.id!)
        state.visibleForm = true
      } catch (error) {
        vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      } finally {
        state.loadCourseInfo = false
      }
    }

    return {
      ...toRefs(state),
      form,
      courseInfo,
      courses,
      loading,
      updating,
      lecturers,
      save,
      deleteCourse,
      edit,
      addNew,
      isPresident
    }
  }
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}

.active-icon {
  display: block;
  width: 30px;
}

/** Добавляем отступ чтобы кнопка добавления не захадила на таблицу */
.course__wrapper {
  margin-bottom: 65px;
}
</style>
