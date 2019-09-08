import { Model } from '@vuex-orm/core'
// import Lecturer from './Lecturer'
import coursesApi from '../api/courses'
import { addSnackbarsByStore } from '../store/snackbars'

export default class Course extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'courses'

  /**
   * Модель предмета
   */
  static fields() {
    return {
      id: this.attr(null),
      title: this.attr(''),
      active: this.attr(false),
      lecturer_ids: this.attr([])
    }
  }

  /**
   * Дополнительные данные состояния
   */
  static state() {
    return {
      /**
       * Флаг загрузки
       * @type {Boolean}
       */
      fetching: true,

      /**
       * Флаг обновления
       * @type {Boolean}
       */
      updating: false
    }
  }

  /**
   * Получить занчение флага загрузки
   * @type {Function}
   * @returns {Boolean}
   */
  static getFetchingStatus() {
    return this.store().state.entities.courses.fetching
  }

  /**
   * Получить занчение флага обновления
   * @type {Function}
   * @returns {Boolean}
   */
  static getUpdatingStatus() {
    return this.store().state.entities.courses.updating
  }

  /**
   * Загрузить список пердметов
   * @type {Function}
   */
  static async $apiFetch() {
    this.commit((state) => {
      state.fetching = true
    })

    try {
      const courses = await coursesApi.loadData()

      this.create({ data: courses })
      this.commit((state) => {
        state.fetching = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }

  /**
   * Создать предмет
   * @type {Function}
   * @param {Object} course
   */
  static async $apiCreate(course) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      const data = await coursesApi.create(course)

      this.insert({ data })

      this.commit((state) => {
        state.updating = false
      })

      return data
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }

  /**
   * Обновить предмет
   * @type {Function}
   * @param {Object} course
   */
  static async $apiUpdate(course) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      const data = await coursesApi.update(course, course.id)

      this.insert({ data })

      this.commit((state) => {
        state.updating = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }

  /**
   * Удалить предмет
   * @type {Function}
   * @param {String} id
   */
  static async $apiDelete(id) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      await coursesApi.deleteById(id)

      this.delete(id)

      this.commit((state) => {
        state.updating = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }
}
