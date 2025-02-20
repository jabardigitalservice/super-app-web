import axios from 'axios'

export default ({ $config }, inject) => {
  const axiosNewAduan = axios.create({
    baseURL: $config.apiAduanIdeal.baseUrl,
  })

  axiosNewAduan.interceptors.request.use(
    (config) => {
      config.headers['x-partner-id'] = $config.apiAduanIdeal.xPartnerId
      config.headers['api-key'] = $config.apiAduanIdeal.apiKeyUrlAduan
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  inject('axiosNewAduan', axiosNewAduan)
}
