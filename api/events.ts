import momentTz from 'moment-timezone'
// import moment from '~/plugins/moment'
import ApiCRUD from './ApiCRUD'

type Day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'

export interface Event {
  id?: string
  eventable_id: string
  eventable_type: 'student' | 'group'
  course_id: string
  by_day: Day[]
  title: string
  description: string
  start_at: string
  end_at: string
  recurrence: string[]
  timezone: string
  label_ids: string[]
}

/**
 * Получить дни недели из формата rfc5545
 * @param {String[]} rfc5545 - дата в формате rfc5545
 * @return {String[]]}
 */
export function parseDaysOfWeek(recurrence: string[]): string[] {
  const rruleString = recurrence.find((item) => item.includes('RRULE'))
  if (!rruleString) return []

  const rruleArray = rruleString.split(';')
  if (!rruleArray) return []

  const bydayString = rruleArray.find((item) => item.includes('BYDAY'))
  if (!bydayString) return []

  const daysWeeksString = bydayString.split('=')[1]
  return daysWeeksString.split(',')
}

const restUrl = '/events'

const formatDataFromApi = (data: any): Event => {
  const { id, attributes, relationships } = data

  // const { start_at, end_at } = attributes
  // attributes.time = moment(start_at).format('HH:mm')
  // attributes.start_at = moment(start_at).format('YYYY-MM-DD')
  // attributes.end_at = moment(end_at).format('YYYY-MM-DD')

  let course_id = ''
  let eventable_id = ''
  let eventable_type = ''
  let label_ids = []

  if (relationships && relationships.course && relationships.course.data) {
    course_id = relationships.course.data.id
  }

  if (
    relationships &&
    relationships.eventable &&
    relationships.eventable.data
  ) {
    eventable_id = relationships.eventable.data.id
    eventable_type = relationships.eventable.data.type
  }

  if (
    relationships &&
    relationships.labels &&
    relationships.labels.data &&
    relationships.labels.data.length
  ) {
    label_ids = relationships.labels.data.map(({ id }: { id: string }) => id)
  }

  return {
    id,
    ...attributes,
    label_ids,
    eventable_id,
    eventable_type,
    by_day: parseDaysOfWeek(attributes.recurrence),
    course_id
  }
}

const formatDataForApi = (event: Event): { event: Event } => {
  event.timezone = momentTz.tz.guess()
  event.recurrence = [`RRULE:FREQ=WEEKLY;BYDAY=${event.by_day.join(',')}`]

  // const { start_at, end_at, time } = event

  // if (start_at) {
  //   event.start_at = moment(
  //     `${start_at} ${time}`,
  //     'YYYY-MM-DD HH:mm'
  //   ).toISOString()
  // }

  // if (end_at) {
  //   event.end_at = moment(`${end_at} ${time}`, 'YYYY-MM-DD HH:mm').toISOString()
  // }

  return { event }
}

export default new ApiCRUD({ restUrl, formatDataForApi, formatDataFromApi })
