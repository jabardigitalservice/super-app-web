import axios from 'axios'

export default (context, inject) => {
  const baseHeaders = {
    common: {
      'Api-Key': context.$config.apiKey,
      'x-partner-id': context.$config.xPartnerId,
    },
  }

  const gatewayPartnerAPI = axios.create({
    baseURL: `${context.$config.baseURLGatewayPartner}/v1`,
    headers: baseHeaders,
  })

  const gatewayPartnerMainAPI = axios.create({
    baseURL: `${context.$config.baseURL}/main/v1`,
    headers: baseHeaders,
  })

  inject('gatewayPartnerAPI', gatewayPartnerAPI)
  inject('gatewayPartnerMainAPI', gatewayPartnerMainAPI)
}
