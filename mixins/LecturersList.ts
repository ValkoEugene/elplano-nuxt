import { Component, Vue } from 'vue-property-decorator'
import { LecturerIndex, lecturersApi } from '~/api/lecturers.ts'

/**
 * Миксин загрузки списка преподавателей
 */
@Component
export default class LecturersList extends Vue {
  /**
   * Список преподавателей
   * @type {Lecturer[]}
   */
  public lecturers: LecturerIndex[] = []

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
      this.lecturers = await lecturersApi.loadData()
      this.loadingLecturers = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
