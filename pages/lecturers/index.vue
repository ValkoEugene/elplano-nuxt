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

  <div v-else class="lecturer__wrapper">
    <v-alert v-if="!lecturers.length" type="info" prominent>
      <span>{{ $t('lecturers.empty') }}</span>
    </v-alert>

    <v-expansion-panels v-else v-model="expanded">
      <v-expansion-panel
        v-for="(lecturer, index) in lecturers"
        :key="lecturer.id"
        class="mb-2"
      >
        <v-expansion-panel-header>
          <div class="header">
            <v-icon v-if="lecturer.active" color="success" class="active-icon">
              check_circle_outline
            </v-icon>
            <div>{{ lecturer.view }}</div>
          </div>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <lecturer-info
            v-if="index === expanded"
            ref="lecturerInfo"
            :key="lecturer.id"
            :lecturer-id="lecturer.id"
            @onEdit="edit(lecturer)"
            @onDelete="(id) => deleteLecturer(id)"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

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

const components = {
  AddNew: () =>
    import(
      '~/components/UI-core/add-new.vue' /* webpackChunkName: 'components/UI-core/add-new' */
    ),
  Card: () =>
    import(
      '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
    ),
  ModalWrapper: () =>
    import(
      '~/components/modal/modal-wrapper.vue' /*  webpackChunkName: 'components/modal/modal-wrapper' */
    ),
  LecturerInfo: () =>
    import(
      '~/components/lecturers/lecturer-info.vue' /* webpackChunkName: 'components/lecturers/lecturer-info' */
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
  /** Индекс открытого на просмотр элемента */
  expanded: number | undefined
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

    /** Ссылка на компонент с формой */
    const form = ref<Form>(null)

    /**
     * TODO указать в тиа компонент LecturerInfo ts не позволяет
     * Ссылка на компонент с информацией о преподавателе
     */
    const lecturerInfo = ref<any>(null)

    /** Флаг что пользователь является старостой */
    const isPresident = vuexModules.User.isPresident

    const {
      lecturers,
      loading: loadingLecturers,
      updating,
      create,
      update,
      deleteLecturer
    } = useLecturers(context.root.$vuexModules)

    const { courses, loading: loadingCourses } = useCourses(
      context.root.$vuexModules,
      {
        loadOnMount: isPresident
      }
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
      expanded: undefined,
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

      // Обновляем данные в компоненте с подробной информацией
      if (
        lecturerInfo.value &&
        lecturerInfo.value[0] &&
        typeof lecturerInfo.value[0].show === 'function'
      ) {
        lecturerInfo.value[0].show()
      }

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
      lecturerInfo,
      save,
      addNew
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
.lecturer__wrapper {
  margin-bottom: 65px;
}
</style>
