import axios from 'axios'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_BODY_BYTES = 35 * 1024 * 1024
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const WEST_JAVA_BOUNDS = { minLat: -7.9, maxLat: -5.9, minLng: 106.3, maxLng: 109.2 }

/** Mapping kategori form (/jalan-aing/aduan) → sub_category_id resmi backend */
const JALAN_AING_SUBCATEGORY_MAP = {
  jalan_berlubang: 'jalan-aing-jalan-berlubang',
  jalan_rusak: 'jalan-aing-jalan-rusak',
  apj_mati: 'jalan-aing-apj-mati',
  cctv_rusak: 'jalan-aing-cctv-rusak',
  genangan: 'jalan-aing-genangan-air',
  pohon_tumbang: 'jalan-aing-pohon-tumbang',
  longsor: 'jalan-aing-tanah-longsor',
  marka_rusak: 'jalan-aing-marka-rusak',
  lainnya: 'jalan-aing-darurat-lainnya',
}

const sendJson = (response, statusCode, body) => {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}

const readJson = (request) => new Promise((resolve, reject) => {
  let size = 0
  const chunks = []

  request.on('data', (chunk) => {
    size += chunk.length
    if (size > MAX_BODY_BYTES) {
      reject(new Error('Payload terlalu besar'))
      request.destroy()
      return
    }
    chunks.push(chunk)
  })
  request.on('end', () => {
    try {
      resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
    } catch (_) {
      reject(new Error('Payload tidak valid'))
    }
  })
  request.on('error', reject)
})

const isValidImage = (photo) => {
  if (!photo || !IMAGE_TYPES.has(photo.mimeType) || typeof photo.data !== 'string') return false
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(photo.data)) return false
  return Buffer.from(photo.data, 'base64').length <= MAX_IMAGE_BYTES
}

const isJalanAingLocation = (latitude, longitude) => (
  Number.isFinite(latitude)
  && Number.isFinite(longitude)
  && latitude >= WEST_JAVA_BOUNDS.minLat
  && latitude <= WEST_JAVA_BOUNDS.maxLat
  && longitude >= WEST_JAVA_BOUNDS.minLng
  && longitude <= WEST_JAVA_BOUNDS.maxLng
)

const text = (value) => typeof value === 'string' ? value.trim() : ''

export default async (request, response) => {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method tidak diizinkan' })
    return
  }

  let body
  try {
    body = await readJson(request)
  } catch (error) {
    sendJson(response, 400, { error: error.message })
    return
  }

  const title = text(body.title)
  const description = text(body.description)
  const reporterName = text(body.reporterName)
  const reporterPhone = text(body.reporterPhone).replace(/[\s-]/g, '')
  const reporterEmail = text(body.reporterEmail)
  const latitude = Number(body.latitude)
  const longitude = Number(body.longitude)
  const photos = Array.isArray(body.photos) ? body.photos : []

  if (
    title.length < 5 || title.length > 100
    || description.length < 20 || description.length > 1000
    || reporterName.length < 3 || reporterName.length > 100
    || !/^\+?[0-9]{8,15}$/.test(reporterPhone)
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)
    || !isJalanAingLocation(latitude, longitude)
    || !photos.every(isValidImage)
  ) {
    sendJson(response, 400, { error: 'Data aduan tidak valid' })
    return
  }

  const keycloakUrl = process.env.KEYCLOAK_URL
  const clientId = process.env.KEYCLOAK_CLIENT_ID_JALAN_AING || 'jalan-aing'
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET_JALAN_AING || 'xctam5pZgC4yvhMyaf5Rkc2wfGGAEdeF'
  const uploadUrl = process.env.BASE_URL_GATEWAY_PARTNER
  const fileUrl = process.env.URL_FILE
  const apiKey = process.env.API_KEY
  const xPartnerId = process.env.X_PARTNER_ID

  if (!keycloakUrl || !clientId || !clientSecret || !uploadUrl || !fileUrl || !apiKey || !xPartnerId) {
    sendJson(response, 503, { error: 'Integrasi Aduan belum dikonfigurasi' })
    return
  }

  try {
    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'openid',
    })
    const { data: tokenData } = await axios.post(keycloakUrl, tokenParams, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 15000,
    })
    const headers = {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Api-Key': apiKey,
      'x-partner-id': xPartnerId,
    }
    const uploadedPhotos = await Promise.all(photos.map(async (photo) => {
      const { data } = await axios.post(`${uploadUrl.replace(/\/$/, '')}/v1/file/upload`, {
        name: text(photo.name) || 'foto-aduan',
        isConfidental: false,
        mimeType: photo.mimeType,
        roles: ['admin', 'rw'],
        data: photo.data,
      }, { headers, timeout: 30000 })
      return { url: `${fileUrl.replace(/\/$/, '')}/${data.data.path}` }
    }))

    const payload = {
      source_id: 'sapawarga',
      jotform_id: '',
      sp4n_id: '',
      category_id: 'jalan-aing',
      sub_category_id: JALAN_AING_SUBCATEGORY_MAP[text(body.category)] || 'jalan-aing-darurat-lainnya',
      photos: uploadedPhotos,
      title,
      description,
      created_at: new Date().toISOString(),
      province_id: '32',
      province_name: 'JAWA BARAT',
      city_id: '',
      city_name: text(body.cityName),
      district_id: '',
      district_name: text(body.districtName),
      village_id: '',
      village_name: text(body.villageName),
      address: text(body.address),
      longitude: `${longitude}`,
      latitude: `${latitude}`,
      address_detail: text(body.address),
      user_id: '',
      user_name: reporterName,
      user_phone: reporterPhone,
      user_email: reporterEmail,
      social_media_type: '',
      social_media_link: '',
      user_longitude: `${longitude}`,
      user_latitude: `${latitude}`,
      is_secret: body.complaintType === 'privat',
      is_anonymous: false,
    }
    const { data } = await axios.post(`${uploadUrl.replace(/\/$/, '')}/v1/aduan/complaints`, payload, {
      headers: { ...headers, Accept: 'application/json', 'Content-Type': 'application/json' },
      timeout: 30000,
    })

    sendJson(response, 201, { data: data.data || data })
  } catch (error) {
    const statusCode = error.response?.status >= 400 && error.response?.status < 500 ? 502 : 503
    sendJson(response, statusCode, { error: 'Aduan belum dapat dikirim. Silakan coba lagi.' })
  }
}
