import axios from 'axios'

export default (context, inject) => {
  const gatewayPartnerAPI = axios.create({
    baseURL: `${context.$config.baseURLGatewayPartner}/v1`,
    headers: {
      common: {
        'Api-Key': context.$config.apiKey,
        'x-partner-id': context.$config.xPartnerId,
      },
    },
  })
  inject('gatewayPartnerAPI', gatewayPartnerAPI)
}
