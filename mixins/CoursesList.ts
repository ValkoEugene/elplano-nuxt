import { Component, Vue } from 'vue-property-decorator'
import { Course, courseApi } from '~/api/courses.ts'

/**
 * Миксин загрузки списка предметов
 */
@Component
export default class CoursesList extends Vue {
  /**
   * Список предметов
   * @type {Course[]}
   */
  public courses: Course[] = []

  /**
   * Флаг загрузки списка предметов
   * @type {boolean}
   */
  public loadingCourses: boolean = true

  mounted() {
    console.log('mixin CourseList')
    this.loadCourses()
  }

  /**
   * Загрузить список предметов
   */
  private async loadCourses(): Promise<void> {
    try {
      const courses = await courseApi.loadData()

      this.courses = courses
      this.loadingCourses = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
