const axios = require('axios')

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
      const grantType = parsed.grant_type || 'client_credentials'
      const refreshToken = parsed.refresh_token

      const keycloakUrl = process.env.KEYCLOAK_URL
      const clientId = process.env.KEYCLOAK_CLIENT_ID_PARTNER
      const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET_PARTNER

      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType,
        scope: 'openid',
      })

      if (grantType === 'refresh_token' && refreshToken) {
        params.append('refresh_token', refreshToken)
      }

      const response = await axios.post(keycloakUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        })
      )
    } catch (err) {
      // eslint-disable-next-line no-console -- server-side error visibility
      console.error('[keycloak-token] Error:', err.message)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Gagal mengambil token' }))
    }
  })
}
