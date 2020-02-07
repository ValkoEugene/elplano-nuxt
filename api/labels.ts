import ApiCRUD from './ApiCRUD'

export type Label = {
  id?: string
  title: string
  description: string
  color: string
  text_color: string
  created_at?: string
  updated_at?: string
}

const restUrl = '/labels'

const formatDataFromApi = (data: { [key: string]: any }): Label => {
  const {
    id,
    attributes: {
      title,
      description,
      color,
      text_color,
      created_at,
      updated_at
    }
  } = data

  return {
    id,
    title,
    description,
    color,
    text_color,
    created_at,
    updated_at
  }
}

const formatDataForApi = (data: Label): { label: Label } => ({
  label: data
})

export const labelApi = new ApiCRUD<Label>({
  restUrl,
  formatDataFromApi,
  formatDataForApi
})
