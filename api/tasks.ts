import axios from '~/plugins/axios.ts'
import moment from '~/plugins/moment'

export interface ExtraLink {
  description: string
  url: string
}

export interface Task {
  title: string
  description?: string
  expired_at: string
  event_id: string
  created_at?: string
  updated_at?: string
  outdated?: boolean
  id?: string
  student_ids?: string[]
  attachments: any[]
  extra_links: ExtraLink[]
}

export interface Assignment {
  id?: string
  accomplished: boolean
  report: string
  created_at?: string
  updated_at?: string
  extra_links: ExtraLink[]
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
      student_ids,
      outdated,
      extra_links
    },
    relationships: { event, attachments }
  } = data

  return {
    id,
    student_ids,
    title,
    description,
    expired_at: moment(expired_at).format('YYYY-MM-DD'),
    created_at,
    updated_at,
    outdated,
    extra_links: extra_links || [],
    event_id: event && event.data && event.data.id,
    attachments:
      attachments &&
      Array.isArray(attachments.data) &&
      attachments.data.map(({ id }: { id: string }) => id)
  }
}

export const taskApi = {
  /**
   * Создать задание
   * @param data - информация о задание
   */
  async create(data: Task): Promise<Task> {
    try {
      console.log('create')
      const response = await axios.post(restUrl, {
        task: formatDataForApi(data)
      })

      return formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  /**
   * Обновить задание
   * @param data - информация о задание
   * @param id - id задания
   */
  async update(data: Task, id: number | string): Promise<Task> {
    try {
      console.log('update')
      // При обновление не изменяем список с id студентов
      data.student_ids = undefined
      const response = await axios.put(`${restUrl}${id ? '/' + id : ''}`, {
        task: formatDataForApi(data)
      })

      return formatDataFromApi(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  /**
   * Удалить задание
   * @param {String} id - id задания
   */
  async deleteById(id: string): Promise<void> {
    try {
      console.log('deleteById')
      await axios.delete(`${restUrl}/${id}`)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  /**
   * Загрузить список заданий
   */
  async loadData(
    params?: any
  ): Promise<{
    data: Task[]
    meta?: { current_page: number; total_pages: number }
  }> {
    try {
      console.log('loadData')
      const response = await axios.get(restUrl, { params })
      const data = response.data.data
      const meta = response.data.meta

      return {
        data: data.map((item: any): Task => formatDataFromApi(item)),
        meta
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },

  /**
   * Обновить информацию о выполнение задания
   * @param taskId - id задания
   * @param assignment - информация о выполнение задания
   */
  async complete(taskId: string, assignment: Assignment): Promise<void> {
    try {
      console.log('complete')
      await axios.put(`${restUrl}/${taskId}/assignment`, {
        assignment
      })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  /**
   * Получить информацию о выполнение задания
   * @param taskId - id задания
   */
  async getCompletedInfo(taskId: string): Promise<Assignment> {
    try {
      console.log('getCompletedInfo')
      const response = await axios.get(`${restUrl}/${taskId}/assignment`)
      const data: Assignment = response.data.data.attributes

      if (data.extra_links === null) data.extra_links = []

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
