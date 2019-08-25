import createApi from './createApi'

const restUrl = '/group/lecturers'

const formatDataFromApi = (data) => {
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
    course_ids: courses.data.map(({ id }) => id)
  }
}

const formatDataForApi = (data) => ({
  lecturer: data
})

const lecturersApi = createApi({ restUrl, formatDataForApi, formatDataFromApi })

export default lecturersApi
