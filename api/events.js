import moment from 'moment-timezone'
import createApi from './createApi'

/**
 * Получить дни недели из формата rfc5545
 * @param {String} rfc5545 - дата в формате rfc5545
 * @return {[String]}
 */
export function parseDaysOfWeek(recurrence) {
  return recurrence
    .find((item) => item.includes('RRULE'))
    .split(';')
    .find((item) => item.includes('BYDAY'))
    .split('=')[1]
    .split(',')
}

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
    by_day: parseDaysOfWeek(attributes.recurrence),
    course_id
  }
}

const formatDataForApi = (event) => {
  event.timezone = moment.tz.guess()
  event.recurrence = [`RRULE:FREQ=WEEKLY;BYDAY=${event.by_day.join(',')}`]

  return event
}

const lecturersApi = createApi({ restUrl, formatDataForApi, formatDataFromApi })

export default lecturersApi
