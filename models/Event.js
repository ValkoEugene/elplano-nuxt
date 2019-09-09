import { Model } from '@vuex-orm/core'
// import Lecturer from './Lecturer'
import eventsApi from '../api/events'
import { addSnackbarsByStore } from '../store/snackbars'

export default class Event extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'events'

  /**
   * Модель предмета
   */
  static fields() {
    return {
      id: this.attr(null),
      course_id: this.attr(''),
      created_at: this.attr(''),
      description: this.attr(''),
      start_at: this.attr(''),
      end_at: this.attr(''),
      time: this.attr(''),
      // ('student', 'group')
      eventable_type: this.attr(''),
      eventable_id: this.attr(''),
      recurrence: this.attr([]),
      by_day: this.attr([]),
      // ('confirmed' | 'tentative' | 'cancelled'),
      status: this.attr(''),
      timezone: this.attr(''),
      title: this.attr(''),
      updated_at: this.attr('')
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
   * Загрузить список эвентов
   * @type {Function}
   */
  static async $apiFetch() {
    this.commit((state) => {
      state.fetching = true
    })

    try {
      const courses = await eventsApi.loadData()

      this.create({ data: courses })
      this.commit((state) => {
        state.fetching = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }

  /**
   * Создать эвент
   * @type {Function}
   * @param {Object} event
   */
  static async $apiCreate(event) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      const data = await eventsApi.create(event)

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
   * Обновить эвент
   * @type {Function}
   * @param {Object} event
   */
  static async $apiUpdate(event) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      const data = await eventsApi.update(event, event.id)

      this.insert({ data })

      this.commit((state) => {
        state.updating = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }

  /**
   * Удалить эвент
   * @type {Function}
   * @param {String} id
   */
  static async $apiDelete(id) {
    try {
      this.commit((state) => {
        state.updating = true
      })

      await eventsApi.deleteById(id)

      this.delete(id)

      this.commit((state) => {
        state.updating = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }
}
