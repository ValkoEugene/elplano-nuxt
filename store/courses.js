// Информация о предметах

import coursesApi from '../api/courses'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from './snackbars'

export const namespace = 'courses'

export const Types = {
  mutations: {
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_COURSES: 'SET_COURSES',
    SET_COURSE: 'SET_COURSE',
    DELETE_COURSE: 'DELETE_COURSE'
  },
  actions: {
    LOAD_COURSES: 'SET_COURSES',
    CREATE_COURSE: 'CREATE_COURSE',
    EDIT_COURSE: 'EDIT_COURSE',
    DELETE_COURSE: 'DELETE_COURSE'
  }
}

export const state = () => ({
  /**
   * Флаг загрузки
   * @type {Boolean}
   */
  loading: true,

  /**
   * Флаг процесса обновления
   * @type {Boolean}
   */
  updating: false,

  /**
   * Предметы
   * @type {Object}
   */
  courses: {}
})

export const mutations = {
  /**
   * Установить флаг процесса загрузки
   * @param {Object} state
   * @param {Boolean} value
   */
  [Types.mutations.SET_LOADING](state, value) {
    state.loading = value
  },

  /**
   * Установить флаг процесса обновления
   * @param {Object} state
   * @param {Boolean} value
   */
  [Types.mutations.SET_UPDATING](state, value) {
    state.updating = value
  },

  /**
   * Установить список предметов
   * @param {Object} state
   * @param {Array} courses
   */
  [Types.mutations.SET_COURSES](state, courses) {
    state.courses = courses
  },

  /**
   * Установить предмет
   * @param {Object} state
   * @param {Object} course
   */
  [Types.mutations.SET_COURSE](state, course) {
    state.courses[course.id] = course
  },

  /**
   * Удалить предмет
   * @param {Object} state
   * @param {Object} course
   */
  [Types.mutations.DELETE_COURSE](state, id) {
    if (state.courses[id]) {
      delete state.courses[id]
    }
  }
}

export const actions = {
  /**
   * Загрузить список предметов
   * @param {Object} context
   */
  async [Types.actions.LOAD_COURSES](context) {
    context.commit(Types.mutations.SET_LOADING, true)

    try {
      const courses = await coursesApi.loadData()

      const formatedCourses = {}
      courses.forEach((item) => {
        formatedCourses[item.id] = item
      })

      context.commit(Types.mutations.SET_COURSES, formatedCourses)
      context.commit(Types.mutations.SET_LOADING, false)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    }
  },

  /**
   * Создать предмет
   * @param {Object} state
   * @param {Object} data
   */
  async [Types.actions.CREATE_COURSE](context, data) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      const course = await coursesApi.create(data)

      context.commit(Types.mutations.SET_COURSE, course)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      context.commit(Types.mutations.SET_UPDATING, false)
    }
  },

  /**
   * Редактировать предмет
   * @param {Object} state
   * @param {Object} data
   */
  async [Types.actions.EDIT_COURSE](context, data) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      const course = await coursesApi.update(data, data.id)

      context.commit(Types.mutations.SET_COURSE, course)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      context.commit(Types.mutations.SET_UPDATING, false)
    }
  },

  /**
   * Удалить предмет
   * @param {Object} state
   * @param {String} id
   */
  async [Types.actions.DELETE_COURSE](context, id) {
    context.commit(Types.mutations.SET_UPDATING, true)

    try {
      await coursesApi.deleteById(id)

      context.commit(Types.mutations.DELETE_COURSE, id)
    } catch (error) {
      context.commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      context.commit(Types.mutations.SET_UPDATING, false)
    }
  }
}
