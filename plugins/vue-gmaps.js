import { Loader } from '@googlemaps/js-api-loader'

export default ({ $config }, inject) => {
  const loader = new Loader({
    apiKey: $config.gmapsKey,
    version: 'weekly',
    region: 'ID',
    language: 'id',
  })
  inject('gMaps', loader)
}
