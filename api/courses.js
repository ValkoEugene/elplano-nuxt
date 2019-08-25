import createApi from './createApi'

const restUrl = '/group/courses'

const formatDataFromApi = (data) => {
  const {
    id,
    attributes: { title, active },
    relationships: { lecturers }
  } = data

  return {
    id,
    title,
    active,
    lecturer_ids: lecturers.data.map(({ id }) => id)
  }
}

const formatDataForApi = ({ title, active, lecturer_ids = [] }) => ({
  course: { title, active, lecturer_ids }
})

const lecturersApi = createApi({ restUrl, formatDataForApi, formatDataFromApi })

export default lecturersApi
