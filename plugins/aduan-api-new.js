import axios from 'axios'

export default ({ $config }, inject) => {
  const getToken = async () => {
    try {
      const response = await axios.post(
        $config.apiAduanIdeal.keycloakUrl,
        new URLSearchParams({
          client_id: $config.apiAduanIdeal.keycloakClientId,
          client_secret: $config.apiAduanIdeal.keycloakClientSecret,
          grant_type: 'client_credentials',
          scope: 'openid',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data.access_token
    } catch (error) {
      console.error('Error fetching Keycloak token:', error)
      return null
    }
  }

  const authAxios = axios.create({
    baseURL: $config.apiAduanIdeal.baseUrl,
  })

  authAxios.interceptors.request.use(
    async (config) => {
      const token = await getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        config.headers['x-partner-id'] = 'portaljabar'
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  inject('authAxios', authAxios)
}
