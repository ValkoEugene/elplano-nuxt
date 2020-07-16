import { reactive, onMounted, toRefs } from '@vue/composition-api'
import {
  CourseIndex,
  CourseEditModel,
  CourseShow,
  courseApi
} from '~/api/courses.ts'
import { VuexModules } from '~/plugins/VuexDecaratorsModules.ts'

interface CoursesState {
  /** Список предметов */
  courses: CourseIndex[]
  /** Флаг загрузки */
  loading: boolean
  /** Флаг процесса обновления */
  updating: boolean
}

/**
 * Композиция для предметов
 * @param vuexState - хранилище vuex TODO через useStore
 */
export const useCourses = (vuexState: VuexModules) => {
  /** Состояние */
  const state = reactive<CoursesState>({
    courses: [],
    loading: true,
    updating: false
  })

  /** Загрузить список предметов */
  const loadData = async () => {
    try {
      const data = await courseApi.loadData()

      state.courses = data
      state.loading = false
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
  onMounted(() => loadData())

  /** Установить список предметов */
  const setCourses = (courses: CourseIndex[]): void => {
    state.courses = courses
  }

  /** Создать предмет */
  const create = async (
    data: CourseEditModel
  ): Promise<CourseShow | undefined> => {
    try {
      state.updating = true
      const course = await courseApi.create(data)
      state.courses.push(course)

      return course
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      state.updating = false
    }
  }

  /** Обновить предмет */
  const update = async (
    data: CourseEditModel
  ): Promise<CourseShow | undefined> => {
    try {
      state.updating = true

      const course = await courseApi.update(data)
      state.courses = state.courses.map((item) =>
        item.id === course.id ? course : item
      )
      return course
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      state.updating = false
    }
  }

  /** Удалить предмет */
  const deleteCourse = async (id: string): Promise<void> => {
    try {
      state.updating = true

      await courseApi.deleteById(id)
      state.courses = state.courses.filter((item) => item.id !== id)
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      state.updating = false
    }
  }

  return {
    ...toRefs(state),
    setCourses,
    create,
    update,
    deleteCourse
  }
}
