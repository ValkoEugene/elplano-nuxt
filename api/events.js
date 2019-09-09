import momentTz from 'moment-timezone'
// import moment from '../plugins/moment'
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

  // const { start_at, end_at } = attributes
  // attributes.time = moment(start_at).format('HH:mm')
  // attributes.start_at = moment(start_at).format('YYYY-MM-DD')
  // attributes.end_at = moment(end_at).format('YYYY-MM-DD')

  let course_id = ''
  let eventable_id = ''
  let eventable_type = ''

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

  return {
    id,
    ...attributes,
    eventable_id,
    eventable_type,
    by_day: parseDaysOfWeek(attributes.recurrence),
    course_id
  }
}

const formatDataForApi = (event) => {
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

const lecturersApi = createApi({ restUrl, formatDataForApi, formatDataFromApi })

export default lecturersApi
