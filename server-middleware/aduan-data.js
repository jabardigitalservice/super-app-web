const axios = require('axios')

function trimTrailingSlash(url) {
  return (url || '').replace(/\/+$/, '')
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method Not Allowed' }))
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', async () => {
    try {
      const parsed = JSON.parse(body || '{}')
      const idAduan = parsed.id_aduan
      if (idAduan === undefined || idAduan === null || idAduan === '') {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'id_aduan wajib diisi' }))
        return
      }

      const baseURL = trimTrailingSlash(process.env.BASE_URL_ADUAN)
      const username = process.env.USERNAME_URL_ADUAN
      const password = process.env.PASSWORD_URL_ADUAN

      const loginResponse = await axios.post(
        `${baseURL}/aduan/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      )

      const token = loginResponse.data.access_token
      if (!token) {
        res.statusCode = 502
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Login aduan gagal' }))
        return
      }

      const dataResponse = await axios.post(
        `${baseURL}/aduan/id_aduan`,
        { id_aduan: idAduan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(dataResponse.data))
    } catch (err) {
      console.error('[aduan-data] Error:', err.message)
      res.statusCode = err.response?.status || 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Gagal mengambil data aduan' }))
    }
  })
}
