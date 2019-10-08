import ApiCRUD from './ApiCRUD'

const restUrl = 'admin/users'

const formatDataFromApi = ({ id, attributes, student = {} }) => ({
  id,
  ...attributes,
  student: student.attributes
})
const formatDataForApi = (item) => item

const adminUserApi = new ApiCRUD({
  restUrl,
  formatDataFromApi,
  formatDataForApi,
  includedTypes: ['student']
})

export default adminUserApi
