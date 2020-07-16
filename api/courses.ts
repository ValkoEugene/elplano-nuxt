import axios from '~/plugins/axios.ts'
import { LecturerIndex } from '~/api/lecturers.ts'

export type CourseIndex = {
  id?: string
  title: string
  active: boolean
}

export type CourseEditModel = CourseIndex & {
  lecturer_ids: string[]
}

export type CourseShow = CourseIndex & {
  lecturer_ids: string[]
  lecturers: LecturerIndex[]
}

const restUrl = '/group/courses'

const formatDataFromApi = (data: { [key: string]: any }): CourseIndex => {
  const {
    id,
    attributes: { title, active }
    // relationships: { lecturers }
  } = data

  return {
    id,
    title,
    active
    // lecturer_ids: lecturers.data.map(({ id }: { id: string }): string => id)
  }
}

const transformDataAfterSave = (responseData: any): CourseShow => {
  const { data, included } = responseData
  const course = { id: data.id, ...data.attributes }
  const lecturers: LecturerIndex[] = []
  included.forEach((item: any) => {
    if (item.type !== 'lecturer') return
    const { last_name, first_name, patronymic } = item.attributes
    const view = [last_name, first_name, patronymic].filter(Boolean).join(' ')
    lecturers.push({ id: item.id, ...item.attributes, view })
  })
  course.lecturers = lecturers
  course.lecturer_ids = lecturers.map(({ id }) => id)
  return course
}

export const courseApi = {
  async loadData(): Promise<CourseIndex[]> {
    try {
      const response = await axios.get(restUrl)

      return response.data.data.map(
        (item: any): CourseIndex => formatDataFromApi(item)
      )
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async show(id: string): Promise<CourseShow> {
    try {
      const response = await axios.get(`${restUrl}/${id}`)

      return transformDataAfterSave(response.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async update(course: CourseEditModel): Promise<CourseShow> {
    try {
      const response = await axios.patch(`${restUrl}/${course.id}`, { course })
      return transformDataAfterSave(response.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async create(course: CourseEditModel): Promise<CourseShow> {
    try {
      const response = await axios.post(restUrl, { course })
      return transformDataAfterSave(response.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async deleteById(id: string): Promise<void> {
    try {
      await axios.delete(`${restUrl}/${id}`)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
