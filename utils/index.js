import { formatInTimeZone } from 'date-fns-tz'
import { isValid } from 'date-fns'
import id from 'date-fns/locale/id'

export function formatDate (date, format) {
  // check if valid date
  return date && isValid(new Date(date))
    ? formatInTimeZone(date, 'Asia/Jakarta', format, { locale: id })
    : '-'
}

export async function fetchAduanData ($aduanAPI, $newrelicSetup, idAduan, config) {
  try {
    const response = await $aduanAPI.post('/aduan/login', {
      username: config.baseURLAduan.username,
      password: config.baseURLAduan.password
    })

    const token = response.data.access_token

    if (token) {
      const dataResponse = await $aduanAPI.post(
        '/aduan/id_aduan',
        {
          id_aduan: idAduan
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (dataResponse.data.length > 0) {
        return dataResponse.data
      }
    }
  } catch (error) {
    $newrelicSetup.noticeError(error)
  }

  return null
}

export function getExtensionFileByUrl (url) {
  const parts = url.split('.')
  return parts[parts.length - 1]
}
