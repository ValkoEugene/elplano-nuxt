import axios from '../plugins/axios'

/**
 * Класс для работы с api
 * Реализует базовую работу с CRUD
 * Для более тонкой конфигурации необходимо наследовать этот класс и переопределить необходимые методы
 */
class ApiCRUD {
  /**
   * Конструктор создания инстанса по работе с api
   * TODO сейчас информация о связанных данных добавляется только в индексе
   * @param {Object} config - конфигурация для создания инстанса по работе с api
   * @param {String} config.restUrl - эндпойнт для работы с api
   * @param {[String]} config.includedTypes - список связанных типов, информацию по которым необходимо включить
   * @param {Function} config.formatDataFromApi - функция преобразования данных ДЛЯ api
   * @param {Function} config.formatDataForApi - функция преобразования данных ОТ api
   */
  constructor({
    restUrl,
    includedTypes = [],
    formatDataFromApi,
    formatDataForApi
  }) {
    this.restUrl = restUrl
    this.formatDataFromApi = formatDataFromApi
    this.formatDataForApi = formatDataForApi
    this.includedTypes = includedTypes
  }

  /**
   * Добавить информацию о связанных данных по типам
   * @param {Object} params
   * @param {Object} params.item - исходная сущность
   * @param {[Object]} params.included - связанные данные
   * @return {Object}
   */
  addRelationshipsInfo({ item, included }) {
    if (!item.relationships) return item

    const result = {}

    // Собираем информацию о связанных данных
    this.includedTypes.forEach((type) => {
      if (!item.relationships[type]) return

      const { data } = item.relationships[type]

      if (!data) return

      const includedData = included.find(
        (item) => item.id === data.id && item.type === type
      )

      if (includedData) result[type] = includedData
    })

    // Убираем исходную мета информацию о связанных данных
    delete item.relationships

    return { ...item, ...result }
  }

  /**
   * Получить список элементов
   * @param
   * @returns {Array} форматированный список элементов
   */
  async loadData(params) {
    try {
      console.log('loadData')
      const response = await axios.get(this.restUrl, { params })
      let { data } = response.data
      const { included } = response.data

      // Расширяем информацией о связанных данных
      if (
        this.includedTypes.length &&
        Array.isArray(included) &&
        included.length
      ) {
        data = data.map((item) => this.addRelationshipsInfo({ item, included }))
      }

      return data.map((item) => this.formatDataFromApi(item))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Получить подробную инфорамцию о элементе
   * @param {String|Number} id - id элемента
   * @returns {Object} форматированный элемент
   */
  async show(id) {
    try {
      console.log('show')
      const response = await axios.get(`${this.restUrl}${id ? '/' + id : ''}`)

      return this.formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Создать элемент
   * @param {Object} data - данные о элементе
   * @returns {Object} форматированный элемент
   */
  async create(data) {
    try {
      console.log('create')
      const response = await axios.post(
        this.restUrl,
        this.formatDataForApi(data)
      )

      return this.formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Обновить элемент
   * @param {Object} data - данные о элементе
   * @param {String|Number} id - id элемента
   * @returns {Object} форматированный элемент
   */
  async update(data, id) {
    try {
      console.log('update')
      const response = await axios.put(
        `${this.restUrl}${id ? '/' + id : ''}`,
        this.formatDataForApi(data)
      )

      return this.formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Удалить элемент
   * @param {String|Number} id - id элемента
   */
  async deleteById(id) {
    try {
      console.log('deleteById')
      await axios.delete(`${this.restUrl}/${id}`)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default ApiCRUD
