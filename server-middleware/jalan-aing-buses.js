import axios from 'axios'

const BUSES_URL = 'https://busterdekat.netlify.app/api/buses'

export default async (request, response) => {
  try {
    const query = new URL(request.url, 'http://localhost').searchParams
    const shelterId = query.get('shelterId') || ''
    if (shelterId && !/^\d+$/.test(shelterId)) {
      response.statusCode = 400
      response.end(JSON.stringify({ error: 'ID halte tidak valid' }))
      return
    }
    const lat = Number(query.get('lat') || -6.946852)
    const lng = Number(query.get('lng') || 107.619489)
    if (!shelterId && (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)) {
      response.statusCode = 400
      response.end(JSON.stringify({ error: 'Koordinat peta tidak valid' }))
      return
    }
    const params = shelterId
      ? { shelterId, pref: '63' }
      : { lat, lng, pref: '63' }
    const { data } = await axios.get(BUSES_URL, { params, timeout: 10000 })
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(data))
  } catch (error) {
    response.statusCode = 502
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ error: 'Data bus tidak dapat dimuat' }))
  }
}
