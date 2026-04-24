import axios from 'axios'
import { isValid } from 'date-fns'
import { format as formatDateFns, formatInTimeZone } from 'date-fns-tz'
import id from 'date-fns/locale/id'

export function formatDate(date, format) {
  // check if valid date
  return date && isValid(new Date(date))
    ? formatInTimeZone(date, 'Asia/Jakarta', format, { locale: id })
    : '-'
}

export function convertToLocaleDate(date, format) {
  return formatDateFns(new Date(date), format, { locale: id })
}

export async function fetchAduanData(idAduan) {
  try {
    const { data } = await axios.post('/api/aduan-data', {
      id_aduan: idAduan,
    })

    if (data && data.length > 0) {
      return data
    }
  } catch {
    /* request failed — caller receives null */
  }

  return null
}

export function getExtensionFileByUrl(url) {
  const parts = url.split('.')
  return parts[parts.length - 1]
}
