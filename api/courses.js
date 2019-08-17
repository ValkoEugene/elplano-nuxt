import createApi from './createApi'

const restUrl = '/group/courses'

const formatDataFromApi = (data) => {
  const {
    id,
    attributes: { title },
    relationships: { lecturers }
  } = data

  return {
    id,
    title,
    lecturer_ids: lecturers.data.map(({ id }) => id)
  }
}

const formatDataForApi = ({ title, lecturer_ids = [] }) => ({
  course: { title, lecturer_ids }
})

const lecturersApi = createApi({ restUrl, formatDataForApi, formatDataFromApi })

export default lecturersApi
