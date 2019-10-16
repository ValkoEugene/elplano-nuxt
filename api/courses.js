import ApiCRUD from './ApiCRUD'

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

export default new ApiCRUD({ restUrl, formatDataFromApi, formatDataForApi })
