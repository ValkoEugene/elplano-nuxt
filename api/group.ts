import axios from '~/plugins/axios'
import ApiCRUD, { ApiCRUDConfig } from './ApiCRUD'

export interface GroupI {
  id?: string
  title: string
  number: string
}

const restUrl = '/group'

const formatDataFromApi = (data: any) => {
  const { id, attributes } = data

  return {
    id,
    ...attributes
  }
}

const formatDataForApi = (data: GroupI): { group: GroupI } => ({
  group: data
})

/**
 * Переопределеяем show и update т.к. у групп не используется id в url
 */
class GoupApi extends ApiCRUD<GroupI> {
  constructor(config: ApiCRUDConfig<GroupI>) {
    super(config)
  }

  /**
   * Получить подробную инфорамцию о группе
   * @returns {GroupI} форматированный элемент
   */
  async show(): Promise<GroupI> {
    try {
      console.log('show')
      const response = await axios.get(this.restUrl)

      return this.formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Обновить информацию о группе
   * @param {Object} data - информация о группе
   * @returns {GroupI}
   */
  async update(data: GroupI): Promise<GroupI> {
    try {
      console.log('update')
      const response = await axios.put(
        this.restUrl,
        this.formatDataForApi(data)
      )

      return this.formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default new GoupApi({ restUrl, formatDataForApi, formatDataFromApi })
