import { Model } from '@vuex-orm/core'
import groupUsersApi from '../api/group-users'
import { addSnackbarsByStore } from '../store/snackbars'

export default class Student extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'students'

  /**
   * Модель студента
   */
  static fields() {
    return {
      id: this.attr(null),
      about: this.attr(''),
      created_at: this.attr(''),
      email: this.attr(''),
      full_name: this.attr(''),
      phone: this.attr(''),
      updated_at: this.attr(''),
      president: this.attr(false),
      social_networks: this.attr({})
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
      fetching: true
    }
  }

  /**
   * Получить занчение флага загрузки
   * @type {Function}
   * @returns {Boolean}
   */
  static getFetchingStatus() {
    return this.store().state.entities.students.fetching
  }

  /**
   * Загрузить список студентов
   * @type {Function}
   */
  static async $apiFetch() {
    this.commit((state) => {
      state.fetching = true
    })

    try {
      const students = await groupUsersApi.getGroupUsers()

      this.create({ data: students })
      this.commit((state) => {
        state.fetching = false
      })
    } catch (error) {
      addSnackbarsByStore(this.store(), error.snackbarErrors)
    }
  }
}
