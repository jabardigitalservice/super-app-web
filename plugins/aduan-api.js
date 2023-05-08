import axios from 'axios'

export default (context, inject) => {
  const aduanAPI = axios.create({
    baseURL: context.$config.baseURLAduan.url
  })
  inject('aduanAPI', aduanAPI)
}
