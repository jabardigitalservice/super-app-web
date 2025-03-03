import axios from 'axios'

export default ({ $config }, inject) => {
  const axiosNewAduan = axios.create({
    baseURL: $config.axios.browserBaseURL,
  })

  axiosNewAduan.interceptors.request.use(
    (config) => {
      config.headers['x-partner-id'] = $config.apiAduanIdeal.xPartnerId
      config.headers['api-key'] = $config.apiAduanIdeal.apiKey
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  inject('axiosNewAduan', axiosNewAduan)
}
