import { reactive, onMounted, toRefs } from '@vue/composition-api'
import { Course, courseApi } from '~/api/courses.ts'
import { VuexModules } from '~/plugins/VuexDecaratorsModules.ts'

interface CoursesState {
  /** Список предметов */
  courses: Course[]
  /** Флаг загрузки */
  loading: boolean
}

/**
 * Композиция для предметов
 * @param vuexState - хранилище vuex TODO через useStore
 */
export const useCourses = (vuexState: VuexModules) => {
  /** Состояние */
  const state = reactive<CoursesState>({
    courses: [],
    loading: true
  })

  /** Загрузить список предметов */
  const loadData = async () => {
    try {
      const { data } = await courseApi.loadData()

      state.courses = data
      state.loading = false
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /** Установить список предметов */
  const setCourses = (courses: Course[]): void => {
    state.courses = courses
  }

  onMounted(() => loadData())

  return {
    ...toRefs(state),
    setCourses
  }
}
