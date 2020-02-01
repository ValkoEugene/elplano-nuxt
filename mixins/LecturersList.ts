import { Component, Vue } from 'vue-property-decorator'
import { Lecturer, lecturersApi } from '~/api/lecturers.ts'

/**
 * Миксин загрузки списка преподавателей
 */
@Component
export default class LecturersList extends Vue {
  /**
   * Список преподавателей
   * @type {Lecturer[]}
   */
  public lecturers: Lecturer[] = []

  /**
   * Флаг загрузки списка преподавателей
   * @type {boolean}
   */
  public loadingLecturers: boolean = true

  mounted() {
    console.log('mixin LecturersList')
    this.loadLecturers()
  }

  /**
   * Загрузить список преподавателей
   */
  private async loadLecturers(): Promise<void> {
    try {
      const lecturers = await lecturersApi.loadData()

      this.lecturers = lecturers
      this.loadingLecturers = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
