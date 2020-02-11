import axios from '~/plugins/axios.ts'

export type ApiCRUDConfig<T> = {
  restUrl: string
  includedTypes?: string[]
  withAllIncluded?: boolean
  formatDataFromApi: (item: any) => T
  formatDataForApi: (item: any) => { [key: string]: any }
}

enum FiltersDirection {
  asc = 'asc',
  desc = 'desc'
}

export type ApiCRUDParams = {
  filters: {
    direction: FiltersDirection
    search?: string
    last_id?: number
  }
}

/**
 * Класс для работы с api
 * Реализует базовую работу с CRUD
 * Для более тонкой конфигурации необходимо наследовать этот класс и переопределить необходимые методы
 */
class ApiCRUD<T> {
  withAllIncluded: boolean
  restUrl: string = ''
  includedTypes: string[] = []
  formatDataFromApi: (v: any) => T = (item) => item
  formatDataForApi: (v: any) => { [key: string]: any } = (item) => item

  /**
   * Конструктор создания инстанса по работе с api
   * TODO сейчас информация о связанных данных добавляется только в индексе
   * @param {Object} config - конфигурация для создания инстанса по работе с api
   * @param {String} config.restUrl - эндпойнт для работы с api
   * @param {[String]} config.includedTypes - список связанных типов, информацию по которым необходимо включить
   * @param {Function} config.formatDataFromApi - функция преобразования данных ДЛЯ api
   * @param {Function} config.formatDataForApi - функция преобразования данных ОТ api
   * @param {Boolean} confog.withAllIncluded - возвращать все связанные данные
   */
  constructor(config: ApiCRUDConfig<T>) {
    const {
      restUrl,
      includedTypes = [],
      formatDataForApi,
      formatDataFromApi,
      withAllIncluded = false
    } = config

    this.restUrl = restUrl
    this.includedTypes = includedTypes
    this.withAllIncluded = withAllIncluded
    if (formatDataForApi) this.formatDataForApi = formatDataForApi
    if (formatDataFromApi) this.formatDataFromApi = formatDataFromApi
  }

  /**
   * Добавить информацию о связанных данных по типам
   * @param {Object} params
   * @param {Object} params.item - исходная сущность
   * @param {[Object]} params.included - связанные данные
   * @return {Object}
   */
  addRelationshipsInfo({
    item,
    included
  }: {
    item: { [key: string]: any }
    included: any[]
  }): { [key: string]: any } {
    if (!item.relationships) return item

    const result = {} as { [key: string]: any }

    // Собираем информацию о связанных данных
    this.includedTypes.forEach((type) => {
      if (!item.relationships[type]) return

      const { data } = item.relationships[type]

      if (!data) return

      if (Array.isArray(data)) {
        result[type] = []

        data.forEach((dataItem) => {
          const includedData = included.find(
            (item) => item.id === dataItem.id && item.type === type
          )

          if (includedData) result[type].push(includedData)
        })
      } else {
        const includedData = included.find(
          (item) => item.id === data.id && item.type === type
        )

        if (includedData) result[type] = includedData
      }
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
  async loadData(
    params?: ApiCRUDParams
  ): Promise<{ data: T[]; included?: any[] }> {
    try {
      console.log('loadData')
      const response = await axios.get(this.restUrl, { params })
      let { data } = response.data
      const { included }: { included: any[] } = response.data

      // Расширяем информацией о связанных данных
      if (
        this.includedTypes.length &&
        Array.isArray(included) &&
        included.length
      ) {
        data = data.map((item: any) =>
          this.addRelationshipsInfo({ item, included })
        )
      }

      const formatedData: T[] = data.map((item: any) =>
        this.formatDataFromApi(item)
      )

      return this.withAllIncluded
        ? { data: formatedData, included }
        : { data: formatedData }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Получить подробную инфорамцию о элементе
   * @param {String|Number} id - id элемента
   * @returns {Object} форматированный элемент
   */
  async show(id: string | number): Promise<T> {
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
  async create(data: { [key: string]: any }): Promise<T> {
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
  async update(data: { [key: string]: any }, id: number | string): Promise<T> {
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
  async deleteById(id: string | number): Promise<void> {
    try {
      console.log('deleteById')
      await axios.delete(`${this.restUrl}/${id}`)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default ApiCRUD
