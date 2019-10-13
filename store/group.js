import getRouter from '~/plugins/getRouter'
import groupApi from '~/api/group'
import {
  namespace as snackbarNamespace,
  Types as snackbarTypes
} from '~/store/snackbars'

export const namespace = 'group'
export const Types = {
  mutations: {
    SET_LOADING: 'SET_LOADING',
    SET_UPDATING: 'SET_UPDATING',
    SET_GROUP_ID: 'SET_GROUP_ID',
    SET_GROUP: 'SET_GROUP'
  },
  actions: {
    SET_GROUP_ID: 'SET_GROUP_ID',
    GET_GROUP: 'GET_GROUP',
    UPDATE_GROUP: 'UPDATE_GROUP',
    CREATE_GROUP: 'CREATE_GROUP'
  },
  getters: {
    HAVE_GROUP: 'HAVE_GROUP'
  }
}

export const state = () => ({
  /**
   * Id группы
   * @type {String}
   */
  groupId: '',

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
   * Группа
   * @type {Object}
   */
  group: {
    id: '',
    title: '',
    number: ''
  }
})

export const mutations = {
  /**
   * установить id группы
   * @param {Object} state
   * @param {String} id
   */
  [Types.mutations.SET_GROUP_ID](state, id) {
    state.groupId = id
  },

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
   * Установить инфорамию о группе
   * @param {Object} state
   * @param {Object} group
   */
  [Types.mutations.SET_GROUP](state, group) {
    state.group = group
  }
}

export const getters = {
  /**
   * Флаг наличия группы
   * @param {Object} state
   */
  [Types.getters.HAVE_GROUP](state) {
    return Boolean(state.groupId)
  }
}

export const actions = {
  /**
   * Установить id группы
   * @param {{ commit: Function }}
   * @param {String} id
   */
  [Types.actions.SET_GROUP_ID]({ commit }, id) {
    console.log('SET_GROUP_ID')
    const router = getRouter()
    if (!id && router.currentRoute.path !== '/group/ungrouped') {
      router.push('/group/ungrouped')
    }

    commit(Types.mutations.SET_GROUP_ID, id)
  },

  /**
   * Загрузить группу
   * @param {{ commit: Function }}
   */
  async [Types.actions.GET_GROUP]({ commit }) {
    try {
      commit(Types.mutations.SET_LOADING, true)

      const group = await groupApi.show()

      commit(Types.mutations.SET_GROUP, group)
      commit(Types.mutations.SET_GROUP_ID, group.id)
    } catch (error) {
      commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      commit(Types.mutations.SET_LOADING, false)
    }
  },

  /**
   * Создать информацию о группе
   * @param {{ commit: Function }}
   * @param {Object} data
   */
  async [Types.actions.CREATE_GROUP]({ commit }, data) {
    try {
      commit(Types.mutations.SET_UPDATING, true)

      const group = await groupApi.create(data)

      commit(Types.mutations.SET_GROUP, group)
      commit(Types.mutations.SET_GROUP_ID, group.id)

      // Используем location чтобы страница перезагрузилась и все состояние vuex сбросилось
      window.location.replace('/')
    } catch (error) {
      commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      commit(Types.mutations.SET_UPDATING, false)
    }
  },

  /**
   * Обновить информацию о группе
   * @param {{ commit: Function }}
   * @param {Object} data
   */
  async [Types.actions.UPDATE_GROUP]({ commit }, data) {
    try {
      commit(Types.mutations.SET_UPDATING, true)

      const group = await groupApi.update(data)

      commit(Types.mutations.SET_GROUP, group)
      commit(Types.mutations.SET_GROUP_ID, group.id)
    } catch (error) {
      commit(
        `${snackbarNamespace}/${snackbarTypes.mutations.ADD_SNACKBARS}`,
        error.snackbarErrors,
        { root: true }
      )
    } finally {
      commit(Types.mutations.SET_UPDATING, false)
    }
  }
}
