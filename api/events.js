import createApi from './createApi'

const restUrl = '/events'

const formatDataFromApi = (data) => {
  const { id, attributes, relationships } = data

  let course_id = ''

  if (relationships && relationships.course && relationships.course.data) {
    course_id = relationships.course.data.id
  }

  return {
    id,
    ...attributes,
    course_id
  }
}

const formatDataForApi = (event) => ({ event })

const lecturersApi = createApi({ restUrl, formatDataForApi, formatDataFromApi })

export default lecturersApi
