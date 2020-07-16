<template>
  <v-skeleton-loader
    v-if="loading"
    :height="500"
    type="table"
    class="elevation-2"
  />

  <div v-else>
    <Card class="lecturer__wrapper">
      <template v-slot:content>
        <v-data-table
          :headers="headers"
          :items="lecturers"
          :items-per-page="10"
          :footer-props="footerProps"
          :single-expand="true"
          :expanded.sync="expanded"
          show-expand
        >
          <template #item.view="{ item }">
            <span class="table-row-title">{{ item.view }}</span>
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
              <lecturer-courses
                :key="item.id"
                :lecturer-id="item.id"
                :courses="courses"
              />
            </td>
          </template>

          <template v-if="isPresident" #item.actions="{ item }">
            <v-icon small @click.stop="edit(item)">
              mdi-pencil
            </v-icon>

            <table-delete-icon
              :row-id="item.id"
              :confirm-text="$t('lecturers.confirm')"
              @onDelete="(id) => deleteLecturer(id)"
            />
          </template>
        </v-data-table>
      </template>
    </Card>

    <ModalWrapper v-model="visible">
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

          <v-text-field
            v-model.trim="editModel.phone"
            :label="$t('field.phone')"
            :rules="[]"
            type="text"
            outlined
          />

          <v-text-field
            v-model.trim="editModel.email"
            label="Email"
            :rules="[$rules.email]"
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
import {
  LecturerIndex,
  lecturersApi,
  LecturersEditModel
} from '~/api/lecturers.ts'
import { useCourses } from '~/compositions/useCourses.ts'
import { useLecturers } from '~/compositions/useLecturers.ts'
import { useDataTableFooterProps } from '~/compositions/useDataTableFooterProps.ts'

const components = {
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
    ),
  LecturerCourses: () =>
    import(
      '~/components/lecturers/lecturer-courses.vue' /* webpackChunkName: 'components/lecturers/lecturer-courses' */
    ),
  TableDeleteIcon: () =>
    import(
      '~/components/UI-core/table-delete-icon.vue' /* webpackChunkName: 'components/UI-core/table-delete-icon' */
    )
}

interface StateI {
  /** Пустая модель преподавателя */
  lectureEmptyModel: LecturersEditModel
  /** Модель преподавателя на редактирование  */
  editModel: LecturersEditModel
  /** Флаг показа модального окна */
  visible: boolean
  /** Флаг загрузки информации о преподавателе */
  loadLecturerInfo: boolean
  /** Список открытых строк таблицы */
  expanded: LecturerIndex[]
}

interface Form {
  /** Функция валидации формы */
  validate: () => boolean
}

export default defineComponent({
  name: 'LecturersPage',
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
          text: context.root.$t('field.fullName'),
          sortable: false,
          value: 'view',
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
      email: '',
      phone: '',
      course_ids: []
    }

    /** Состояние компонента */
    const state = reactive<StateI>({
      lectureEmptyModel: { ...lectureEmptyModel },
      editModel: { ...lectureEmptyModel },
      visible: false,
      expanded: [],
      loadLecturerInfo: false
    })

    /** Флаг загрузки данных */
    const loading = computed(
      () => (isPresident && loadingCourses.value) || loadingLecturers.value
    )

    /** Получить отображение предмета по id */
    const getCourseView = (id: string): string => {
      const course = courses.value.find((item) => item.id === id)

      return course ? course.title : '-'
    }

    /** Добавить новый предмет */
    const addNew = () => {
      state.editModel = { ...state.lectureEmptyModel }
      state.visible = true
    }

    /** Редактировать предмет */
    const edit = async (lecturer: LecturerIndex) => {
      try {
        state.loadLecturerInfo = true
        state.expanded = []
        state.editModel = await lecturersApi.show(lecturer.id!)
        state.visible = true
      } catch (error) {
        vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      } finally {
        state.loadLecturerInfo = false
      }
    }

    /** Сохранить изменения преподавателя */
    const save = async () => {
      if (!form.value || !form.value.validate()) return

      state.editModel.id
        ? await update(state.editModel)
        : await create(state.editModel)

      state.visible = false
    }

    return {
      ...toRefs(state),
      loading,
      updating,
      lecturers,
      courses,
      isPresident,
      edit,
      getCourseView,
      create,
      update,
      deleteLecturer,
      form,
      save,
      footerProps,
      addNew,
      headers
    }
  }
})
</script>

<style>
.table-row-title {
  font-size: 16px;
}

/** Добавляем отступ чтобы кнопка добавления не захадила на таблицу */
.lecturer__wrapper {
  margin-bottom: 65px;
}

.lecturer__wrapper .v-data-table-header.v-data-table-header-mobile {
  display: none;
}
</style>
