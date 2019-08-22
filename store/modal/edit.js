/**
 * Модуль для редактирования сущности в модальном окне.
 * На основе схемы строится форма.
 * По передаваемым данным идёт сохранение в редактируемом модуле.
 */

export const namespace = 'modal/edit'

export const Types = {
  mutations: {
    SET_EDIT_MODEL: 'SET_EDIT_MODEL',
    SET_EDIT_SCHEMA: 'SET_EDIT_SCHEMA',
    SET_SHOWING_EDIT: 'SET_SHOWING_EDIT',
    SET_EDITING_ID: 'SET_EDITING_ID',
    SET_EDIT_NAMESPACE: 'SET_EDIT_NAMESPACE',
    SET_UPDATE_ACTION: 'SET_UPDATE_ACTION',
    SET_CREATE_ACTION: 'SET_CREATE_ACTION'
  },
  actions: {
    INIT_EDIT: 'INIT_EDIT',
    SAVE: 'SAVE'
  }
}

export const state = () => ({
  /**
   * Флаг показа модально окна с редактированием
   * @type {Boolean}
   */
  showingEdit: false,

  /**
   * Редактируемая модель
   * @type {Object}
   */
  editModel: {},

  /**
   * Схема редактируемой сущности
   * @type {{ fields: Array}}
   */
  editSchema: {},

  /**
   * Id редактируемой сущности
   * @type {String}
   */
  editId: '',

  /**
   * Namespace редактируемого модуля vuex
   * @type {String}
   */
  editNamespace: '',

  /**
   * Action на обновление редактируемой сущности в модуле vuex
   * @type {String}
   */
  editUpdateAction: '',

  /**
   * Action на создание сущности в редактируемом модуле vuex
   * @type {String}
   */
  editCreateAction: ''
})

export const mutations = {
  /**
   * Установить флаг показа модального окна с редактированием
   * @param {Object} state
   * @param {Boolean} value
   */
  [Types.mutations.SET_SHOWING_EDIT](state, value) {
    state.showingEdit = value
  },

  /**
   * Установить модель для редактирования
   * @param {Object} state
   * @param {Object} model
   */
  [Types.mutations.SET_EDIT_MODEL](state, model) {
    state.editModel = model
  },

  /**
   * Установить схему
   * @param {Object} state
   * @param {Object} schema
   */
  [Types.mutations.SET_EDIT_SCHEMA](state, schema) {
    state.editSchema = schema
  },

  /**
   * Установить id редактируемой сущности
   * @param {Object} state
   * @param {String | Number} id
   */
  [Types.mutations.SET_EDITING_ID](state, id) {
    state.editId = id
  },

  /**
   * Установить namespace редактируемой сущности
   * @param {Object} state
   * @param {String} namespace
   */
  [Types.mutations.SET_EDIT_NAMESPACE](state, namespace) {
    state.editNamespace = namespace
  },

  /**
   * Установить action для обновления редактируемой сущности
   * @param {Object} state
   * @param {String} updateAction
   */
  [Types.mutations.SET_UPDATE_ACTION](state, updateAction) {
    state.editUpdateAction = updateAction
  },

  /**
   * Установить action для создания сущности
   * @param {Object} state
   * @param {String} createAction
   */
  [Types.mutations.SET_CREATE_ACTION](state, createAction) {
    state.editCreateAction = createAction
  }
}

export const actions = {
  /**
   * Инициализация данных о редактируемом модуле vuex
   * @param {{ commit: Function }} context
   * @param {Object} config - конфигурация
   */
  [Types.actions.INIT_EDIT]({ commit }, config) {
    const {
      namespace,
      id,
      updateAction,
      createAction,
      editModel,
      editSchema
    } = config

    commit(Types.mutations.SET_EDITING_ID, id)
    commit(Types.mutations.SET_EDIT_MODEL, { ...editModel })
    commit(Types.mutations.SET_EDIT_NAMESPACE, namespace)
    commit(Types.mutations.SET_EDIT_SCHEMA, editSchema)
    commit(Types.mutations.SET_UPDATE_ACTION, updateAction)
    commit(Types.mutations.SET_CREATE_ACTION, createAction)

    commit(Types.mutations.SET_SHOWING_EDIT, true)
  },

  /**
   * Сохранение
   * Вызывает необходимый action в модуле vuex
   * @param {context} context
   * @param {*} model
   */
  [Types.actions.SAVE]({ state, dispatch }, model) {
    const { editNamespace, editId, editCreateAction, editUpdateAction } = state

    const action = editId ? editUpdateAction : editCreateAction

    dispatch(
      `${editNamespace}/${action}`,
      { ...model, id: editId },
      { root: true }
    )
  }
}
