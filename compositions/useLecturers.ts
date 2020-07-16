import { reactive, onMounted, toRefs } from '@vue/composition-api'
import {
  LecturerIndex,
  lecturersApi,
  LecturersEditModel,
  LecturerShow
} from '~/api/lecturers.ts'
import { VuexModules } from '~/plugins/VuexDecaratorsModules.ts'

interface LecturersState {
  /** Список преподавателей */
  lecturers: LecturerIndex[]
  /** Флаг загрузки */
  loading: boolean
  /** Флаг процесса обновления */
  updating: boolean
}

/**
 * Композиция для преподавателей
 * @param vuexState - хранилище vuex TODO через useStore
 * @param loadOnMount - флаг что необходимо подгружать список при маунте
 */
export const useLecturers = (
  vuexState: VuexModules,
  loadOnMount: boolean = true
) => {
  /** Состояние */
  const state = reactive<LecturersState>({
    lecturers: [],
    loading: true,
    updating: false
  })

  /**
   * Загрузить список преподавателей
   */
  const loadData = async () => {
    try {
      state.lecturers = await lecturersApi.loadData()
      state.loading = false
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /** Создать преподавателя */
  const create = async (
    data: LecturersEditModel
  ): Promise<LecturerShow | undefined> => {
    try {
      state.updating = true
      const lecturer = await lecturersApi.create(data)
      state.lecturers.push(lecturer)

      return lecturer
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      state.updating = false
    }
  }

  /** Обновить преподавателя */
  const update = async (
    data: LecturersEditModel
  ): Promise<LecturerShow | undefined> => {
    try {
      state.updating = true

      const lecturer = await lecturersApi.update(data)
      state.lecturers = state.lecturers.map((item) =>
        item.id === lecturer.id ? lecturer : item
      )
      return lecturer
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      state.updating = false
    }
  }

  /** Удалить преподавателя */
  const deleteLecturer = async (id: string): Promise<void> => {
    try {
      state.updating = true

      await lecturersApi.deleteById(id)
      state.lecturers = state.lecturers.filter((item) => item.id !== id)
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      state.updating = false
    }
  }

  /** Установить преподавателей */
  const setLecturers = (lecturers: LecturerIndex[]): void => {
    state.lecturers = lecturers
  }

  onMounted(() => {
    if (loadOnMount) loadData()
  })

  return {
    ...toRefs(state),
    setLecturers,
    create,
    update,
    deleteLecturer
  }
}
