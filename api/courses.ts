import ApiCRUD from './ApiCRUD'

export type Course = {
  id?: string
  title: string
  active: boolean
  lecturer_ids: string[]
}

const restUrl = '/group/courses'

const formatDataFromApi = (data: { [key: string]: any }): Course => {
  const {
    id,
    attributes: { title, active },
    relationships: { lecturers }
  } = data

  return {
    id,
    title,
    active,
    lecturer_ids: lecturers.data.map(({ id }: { id: string }): string => id)
  }
}

const formatDataForApi = ({
  title,
  active,
  lecturer_ids = []
}: Course): { course: Course } => ({
  course: { title, active, lecturer_ids }
})

export const courseApi = new ApiCRUD<Course>({
  restUrl,
  formatDataFromApi,
  formatDataForApi
})
