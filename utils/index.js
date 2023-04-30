import { formatInTimeZone } from 'date-fns-tz'
import { isValid } from 'date-fns'
import id from 'date-fns/locale/id'

export function formatDate (date) {
  // check if valid date
  if (isValid(new Date(date))) {
    return formatInTimeZone(date, 'Asia/Jakarta', 'EEEE, dd MMMM yyyy - HH:mm', { locale: id })
  }
  return '-'
}
