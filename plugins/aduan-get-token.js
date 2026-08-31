import axios from 'axios'

export default ({ store, $config }, inject) => {
  /**
   * Request Keycloak access token.
   *
   * @param {string} grantType - e.g. 'client_credentials' | 'refresh_token'
   * @param {object} [credentials] - Optional override { clientId, clientSecret }.
   *   When omitted, the default partner credentials (apiAduanIdeal) are used.
   */
  const getToken = async (grantType, credentials = null) => {
    try {
      // Pakai ulang access token yang masih berlaku untuk menghindari
      // request berulang ke Keycloak (client_credentials)
      if (grantType === 'client_credentials' && !credentials) {
        const { accessTokenKeycloak, accessTokenExpiresAt } = store.state.aduan
        if (accessTokenKeycloak && Date.now() < accessTokenExpiresAt) {
          return accessTokenKeycloak
        }
      }

      const params = new URLSearchParams({
        client_id: credentials?.clientId || $config.apiAduanIdeal.keycloakClientId,
        client_secret: credentials?.clientSecret || $config.apiAduanIdeal.keycloakClientSecret,
        grant_type: grantType,
        scope: 'openid',
      })

      if (grantType === 'refresh_token') {
        params.append('refresh_token', store.state.aduan.refreshTokenKeycloak)
      }

      const response = await axios.post(
        credentials?.keycloakUrl || $config.apiAduanIdeal.keycloakUrl,
        params
      )

      store.commit('aduan/setRefreshTokenKeycloak', response.data.refresh_token)
      store.commit('aduan/setAccessTokenKeycloak', {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      })

      return response.data.access_token
    } catch (error) {
      console.error('Error fetching Keycloak token:', error)
      return Promise.reject(error)
    }
  }

  inject('getToken', getToken)
}
