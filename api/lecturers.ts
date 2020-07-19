import axios from '~/plugins/axios.ts'
import { CourseIndex } from '~/api/courses.ts'

export type LecturerIndex = {
  id?: string
  first_name: string
  last_name: string
  patronymic: string
  avatar: string
  active: boolean
  view?: string
  phone: string
  email: string
  // course_ids: string[]
}

export type LecturersEditModel = LecturerIndex & {
  course_ids: string[]
}

export type LecturerShow = LecturerIndex & {
  course_ids: string[]
  courses: CourseIndex[]
}

const restUrl = '/group/lecturers'

/** Получить отображение преподавателя */
const getLecturerView = (lecturer: LecturerIndex): string => {
  const { first_name, last_name, patronymic } = lecturer

  return [last_name, first_name, patronymic].filter(Boolean).join(' ')
}

const formatDataFromApi = (data: { [key: string]: any }): LecturerIndex => {
  const {
    id,
    attributes: {
      first_name,
      last_name,
      patronymic,
      avatar,
      active,
      phone,
      email
    }
    // relationships: { courses }
  } = data

  return {
    id,
    first_name,
    last_name,
    patronymic,
    avatar,
    active,
    email,
    phone,
    view: getLecturerView(data.attributes)
    // course_ids: courses.data.map(({ id }: { id: string }) => id)
  }
}

const transformDataAfterSave = (responseData: any): LecturerShow => {
  const { data, included } = responseData
  const lecturer = {
    id: data.id,
    ...data.attributes,
    view: getLecturerView(data.attributes)
  }

  const courses: CourseIndex[] = []
  included.forEach((item: any) => {
    if (item.type !== 'course') return

    courses.push({ id: item.id, ...item.attributes })
  })
  lecturer.courses = courses
  lecturer.course_ids = courses.map(({ id }) => id)
  return lecturer
}

export const lecturersApi = {
  async loadData(): Promise<LecturerIndex[]> {
    try {
      const response = await axios.get(restUrl)

      return response.data.data.map(
        (item: any): LecturerIndex => formatDataFromApi(item)
      )
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async show(id: string): Promise<LecturerShow> {
    try {
      const response = await axios.get(`${restUrl}/${id}`)

      return transformDataAfterSave(response.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async update(lecturer: LecturersEditModel): Promise<LecturerShow> {
    try {
      const response = await axios.patch(`${restUrl}/${lecturer.id}`, {
        lecturer
      })
      return transformDataAfterSave(response.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async create(lecturer: LecturersEditModel): Promise<LecturerShow> {
    try {
      const response = await axios.post(restUrl, { lecturer })
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
