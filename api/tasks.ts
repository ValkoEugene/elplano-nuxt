import axios from '~/plugins/axios.ts'
import moment from '~/plugins/moment'

export interface Task {
  title: string
  description?: string
  expired_at: string
  event_id: string
  created_at?: string
  updated_at?: string
  outdated?: boolean
  id?: string
  attachments: any[]
}

const restUrl = '/tasks'

const formatDataForApi = (task: Task): Task => task
const formatDataFromApi = (data: { [key: string]: any }): Task => {
  const {
    id,
    attributes: {
      title,
      description,
      expired_at,
      created_at,
      updated_at,
      outdated
    },
    relationships: { event, attachments }
  } = data

  return {
    id,
    title,
    description,
    expired_at: moment(expired_at).format('YYYY-MM-DD'),
    created_at,
    updated_at,
    outdated,
    event_id: event && event.data && event.data.id,
    attachments:
      attachments &&
      Array.isArray(attachments.data) &&
      attachments.data.map(({ id }: { id: string }) => id)
  }
}

export const taskApi = {
  /**
   * Создать элемент
   */
  async create(data: Task): Promise<Task> {
    try {
      console.log('create')
      const response = await axios.post(restUrl, formatDataForApi(data))

      return formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  /**
   * Обновить элемент
   */
  async update(data: Task, id: number | string): Promise<Task> {
    try {
      console.log('update')
      const response = await axios.put(`${restUrl}${id ? '/' + id : ''}`, {
        task: formatDataForApi(data)
      })

      return formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async deleteById(id: string): Promise<void> {
    try {
      console.log('deleteById')
      await axios.delete(`${restUrl}/${id}`)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async loadData(params?: any): Promise<Task[]> {
    try {
      console.log('loadData')
      const response = await axios.get(restUrl, { params })
      const { data }: { data: any } = response.data
      return data.map((item: any): Task => formatDataFromApi(item))
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
