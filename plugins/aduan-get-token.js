import axios from 'axios'

export default ({ store }, inject) => {
  const getToken = async (grantType) => {
    try {
      const body = { grant_type: grantType }

      if (grantType === 'refresh_token') {
        body.refresh_token = store.state.aduan.refreshTokenKeycloak
      }

      const response = await axios.post('/api/token', body, {
        headers: { 'Content-Type': 'application/json' },
      })

      store.commit('aduan/setRefreshTokenKeycloak', response.data.refresh_token)

      return response.data.access_token
    } catch (error) {
      return Promise.reject(error)
    }
  }

  inject('getToken', getToken)
}
