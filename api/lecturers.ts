import ApiCRUD from './ApiCRUD'

export type Lecturer = {
  id?: string
  first_name: string
  last_name: string
  patronymic: string
  avatar: string
  active: boolean
  view?: string
  course_ids: string[]
}

const restUrl = '/group/lecturers'

const formatDataFromApi = (data: { [key: string]: any }): Lecturer => {
  const {
    id,
    attributes: { first_name, last_name, patronymic, avatar, active },
    relationships: { courses }
  } = data

  return {
    id,
    first_name,
    last_name,
    patronymic,
    avatar,
    active,
    view: [last_name, first_name, patronymic].filter(Boolean).join(' '),
    course_ids: courses.data.map(({ id }: { id: string }) => id)
  }
}

const formatDataForApi = (data: Lecturer): { lecturer: Lecturer } => ({
  lecturer: data
})

export const lecturersApi = new ApiCRUD({
  restUrl,
  formatDataForApi,
  formatDataFromApi
})
