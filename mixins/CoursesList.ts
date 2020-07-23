import { Component, Vue } from 'vue-property-decorator'
import { CourseIndex, courseApi } from '~/api/courses.ts'

/**
 * Миксин загрузки списка предметов
 */
@Component
export default class CoursesList extends Vue {
  /**
   * Список предметов
   * @type {CourseIndex[]}
   */
  public courses: CourseIndex[] = []

  /**
   * Флаг загрузки списка предметов
   * @type {boolean}
   */
  public loadingCourses: boolean = true

  mounted() {
    if (this.$vuexModules.User.isAdmin) return
    console.log('mixin CourseList')
    this.loadCourses()
  }

  /**
   * Загрузить список предметов
   */
  private async loadCourses(): Promise<void> {
    try {
      const data = await courseApi.loadData()

      this.courses = data
      this.loadingCourses = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
