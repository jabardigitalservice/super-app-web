import axios from 'axios'

export default ({ store, $config }, inject) => {
  const getToken = async (grantType) => {
    try {
      const params = new URLSearchParams({
        client_id: $config.apiAduanIdeal.keycloakClientId,
        client_secret: $config.apiAduanIdeal.keycloakClientSecret,
        grant_type: grantType,
        scope: 'openid',
      })

      if (grantType === 'refresh_token') {
        params.append('refresh_token', store.state.aduan.refreshTokenKeycloak)
      }

      const response = await axios.post(
        $config.apiAduanIdeal.keycloakUrl,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      store.commit('aduan/setRefreshTokenKeycloak', response.data.refresh_token)

      return response.data.access_token
    } catch (error) {
      console.error('Error fetching Keycloak token:', error)
      return Promise.reject(error)
    }
  }

  inject('getToken', getToken)
}
