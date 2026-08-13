import axios from 'axios'

const BUS_STOPS_URL = 'https://busterdekat.netlify.app/api/bus-stops'

export default async (request, response) => {
  try {
    const { data } = await axios.get(BUS_STOPS_URL, { timeout: 10000 })
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(data))
  } catch (error) {
    response.statusCode = 502
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ error: 'Data halte bus tidak dapat dimuat' }))
  }
}
