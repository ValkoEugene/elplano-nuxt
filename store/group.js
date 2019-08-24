import getRouter from '../plugins/getRouter'

export const namespace = 'group'
export const Types = {
  mutations: {
    SET_GROUP_ID: 'SET_GROUP_ID'
  },
  actions: {
    SET_GROUP_ID: 'SET_GROUP_ID'
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
  groupId: ''
})

export const mutations = {
  /**
   * установить id группы
   * @param {Object} state
   * @param {String} id
   */
  [Types.mutations.SET_GROUP_ID](state, id) {
    state.groupId = id
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
  [Types.actions.SET_GROUP_ID](context, id) {
    console.log('SET_GROUP_ID')
    const router = getRouter()
    if (!id && router.currentRoute.path !== '/group/ungrouped') {
      router.push('/group/ungrouped')
    }

    context.commit(Types.mutations.SET_GROUP_ID, id)
  }
}
