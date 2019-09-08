import { Model } from '@vuex-orm/core'
// import Lecturer from './Lecturer'
import lecturersApi from '../api/lecturers'
import { addSnackbarsByStore } from '../store/snackbars'

export default class Lecturer extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'lecturers'

  /**
   * Модель преподавателя
   */
  static fields() {
    return {
      id: this.attr(null),
      first_name: this.attr(''),
      last_name: this.attr(''),
      patronymic: this.attr(''),
      avatar: this.attr(''),
      active: this.attr(false),
      course_ids: this.attr([])
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
   * Отображение преподавателя
   * @type {String}
   */
  get view() {
    return [this.last_name, this.first_name, this.patronymic]
      .filter(Boolean)
      .join(' ')
  }

  /**
   * Получить занчение флага загрузки
   * @type {Function}
   * @returns {Boolean}
   */
  static getFetchingStatus() {
    return this.store().state.entities.lecturers.fetching
  }

  /**
   * Получить занчение флага обновления
   * @type {Function}
   * @returns {Boolean}
   */
  static getUpdatingStatus() {
    return this.store().state.entities.lecturers.updating
  }

  /**
   * Загрузить список преподавателей
   * @type {Function}
   */
  static async $apiFetch() {
    this.commit((state) => {
      state.fetching = true
    })

    try {
      const lecturers = await lecturersApi.loadData()

      this.create({ data: lecturers })
      this.commit((state) => {
        state.fetching = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }

  /**
   * Создать преподавателя
   * @type {Function}
   * @param {Object} lecturer
   */
  static async $apiCreate(lecturer) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      const data = await lecturersApi.create(lecturer)

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
   * Обновить преподавателя
   * @type {Function}
   * @param {Object} lecturer
   */
  static async $apiUpdate(lecturer) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      const data = await lecturersApi.update(lecturer, lecturer.id)

      this.insert({ data })

      this.commit((state) => {
        state.updating = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }

  /**
   * Удалить преподавателя
   * @type {Function}
   * @param {String} id
   */
  static async $apiDelete(id) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      await lecturersApi.deleteById(id)

      this.delete(id)

      this.commit((state) => {
        state.updating = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }
}
