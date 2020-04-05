import { reactive, onMounted, toRefs } from '@vue/composition-api'
import { Lecturer, lecturersApi } from '~/api/lecturers.ts'
import { VuexModules } from '~/plugins/VuexDecaratorsModules.ts'

interface LecturersState {
  /** Список преподавателей */
  lecturers: Lecturer[]
  /** Флаг загрузки */
  loading: boolean
  /** Флаг процесса обновления */
  updating: boolean
}

/**
 * Композиция для преподавателей
 * @param vuexState - хранилище vuex TODO через useStore
 */
export const useLecturers = (vuexState: VuexModules) => {
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
      const { data } = await lecturersApi.loadData()

      state.lecturers = data
      state.loading = false
    } catch (error) {
      vuexState.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /** Создать преподавателя */
  const create = async (data: Lecturer): Promise<Lecturer | undefined> => {
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
  const update = async (data: Lecturer): Promise<Lecturer | undefined> => {
    try {
      state.updating = true

      const lecturer = await lecturersApi.update(data, data.id!)
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
  const setLecturers = (lecturers: Lecturer[]): void => {
    state.lecturers = lecturers
  }

  onMounted(() => loadData())

  return {
    ...toRefs(state),
    setLecturers,
    create,
    update,
    deleteLecturer
  }
}
