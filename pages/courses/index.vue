<template>
  <v-skeleton-loader
    v-if="loading"
    :height="500"
    type="table"
    class="elevation-2"
  />

  <div v-else>
    <Card class="course__wrapper">
      <template v-slot:content>
        <v-data-table
          :headers="headers"
          :items="courses"
          :items-per-page="10"
          :footer-props="footerProps"
          :single-expand="true"
          :expanded.sync="expanded"
          show-expand
        >
          <template #item.title="{ item }">
            <span class="table-row-title">{{ item.title }}</span>
          </template>

          <template #item.active="{ item }">
            <v-chip
              class="ma-2"
              :color="item.active ? 'success' : 'warning'"
              label
            >
              {{ $t(`ui.${item.active ? 'yes' : 'no'}`) }}
            </v-chip>
          </template>

          <template #expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <course-lecturers
                :key="item.id"
                :course-id="item.id"
                :expanded="expanded"
              />
            </td>
          </template>

          <template v-if="isPresident" #item.actions="{ item }">
            <v-icon small @click.stop="edit(item)">
              mdi-pencil
            </v-icon>

            <course-delete
              :course-id="item.id"
              @deleteCourse="(id) => deleteCourse(id)"
            />
          </template>
        </v-data-table>
      </template>
    </Card>

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
import { useDataTableFooterProps } from '~/compositions/useDataTableFooterProps.ts'

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
  CourseLecturers: () =>
    import(
      '~/components/courses/course-lecturers.vue' /* webpackChunkName: 'components/courses/course-lecturers' */
    ),
  CourseDelete: () =>
    import(
      '~/components/courses/course-delete.vue' /* webpackChunkName: 'components/courses/course-delete' */
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
  /** Список открытых строк таблицы */
  expanded: CourseIndex[]
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

    /** Настройки для пагинации с локализацией */
    const footerProps = useDataTableFooterProps(context)

    /** Ссылка на компонент с формой */
    const form = ref<Form>(null)

    /** Флаг что пользователь является старостой */
    const isPresident = vuexModules.User.isPresident

    /** Заголовки таблицы */
    const headers = computed(() => {
      const headers = [
        {
          text: context.root.$t('lesson.lessons'),
          sortable: false,
          value: 'title',
          width: isPresident ? '70%' : '80%'
        },
        {
          text: context.root.$t('ui.card.badges.active'),
          sortable: false,
          value: 'active'
        }
      ]

      if (isPresident)
        headers.push({
          text: context.root.$t('ui.actions'),
          value: 'actions',
          sortable: false
        })

      return headers
    })

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
      expanded: []
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
    const { lecturers, loading: loadingLecturers } = useLecturers(
      vuexModules,
      isPresident
    )

    /** Флаг загрузки */
    const loading = computed(
      () => loadingCourses.value || (isPresident && loadingLecturers.value)
    )

    /** Сохранить изменения предмета */
    const save = async () => {
      if (!form.value || !form.value.validate()) return

      const isNew = state.editModel.id
      isNew ? await update(state.editModel) : await create(state.editModel)

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
        state.expanded = []
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
      courses,
      loading,
      updating,
      lecturers,
      save,
      deleteCourse,
      headers,
      edit,
      addNew,
      isPresident,
      footerProps
    }
  }
})
</script>

<style>
.table-row-title {
  font-size: 16px;
}

/** Добавляем отступ чтобы кнопка добавления не захадила на таблицу */
.course__wrapper {
  margin-bottom: 65px;
}

.course__wrapper .v-data-table-header.v-data-table-header-mobile {
  display: none;
}
</style>
