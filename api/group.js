import createApi from './createApi'

const restUrl = '/group'

const formatDataFromApi = (data) => {
  const { id, attributes } = data

  return {
    id,
    ...attributes
  }
}

const formatDataForApi = (data) => ({
  group: data
})

const groupApi = createApi({ restUrl, formatDataForApi, formatDataFromApi })

export default groupApi
