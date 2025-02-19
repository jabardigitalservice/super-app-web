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

  inject('getToken', getToken)
}
