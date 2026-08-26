import axios from 'axios'

const LAYERS = Object.freeze({
  ruasJalan: {
    url: 'https://geoserver.jabarprov.go.id/geoserver/basis_data_dbmpr/ows',
    params: {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'basis_data_dbmpr:jaringan_jalan_ln',
      outputFormat: 'application/json',
    },
  },
  rumahSakit: {
    url: 'https://geoserver.jabarprov.go.id/geoserver/dinkes/ows',
    params: {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'dinkes:RUMAHSAKIT_PT_50K_2023_JAWABARAT',
      outputFormat: 'application/json',
    },
  },
  puskesmas: {
    url: 'https://geoserver.jabarprov.go.id/geoserver/dinkes_arc/ows',
    params: {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'dinkes_arc:puskesmas_pt',
      outputFormat: 'application/json',
    },
  },
  restArea: {
    url: 'https://geoserver.jabarprov.go.id/geoserver/dishub_arc/ows',
    params: {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'dishub_arc:rest_area',
      outputFormat: 'application/json',
    },
  },
  administrasiKeldesa: {
    url: 'https://geoserver.jabarprov.go.id/geoserver/peta_dasar/ows',
    params: {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'peta_dasar:administrasi_ar_10k_keldesa_jabar_2023',
      outputFormat: 'application/json',
      propertyName: 'gid,objectid,namobj,fcode,kdppum,kdpkab,kdcpum,kdepum,wadmpr,wadmkk,wadmkc,wadmkd',
    },
    cqlFilterFromQuery: true,
  },
})

export default async (request, response) => {
  const query = new URL(request.url, 'http://localhost').searchParams
  const layerId = query.get('layer')
  const layer = LAYERS[layerId]
  const username = process.env.JALAN_AING_GEOSERVER_USERNAME
  const password = process.env.JALAN_AING_GEOSERVER_PASSWORD

  if (!layer || !username || !password) {
    response.statusCode = 503
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ error: 'Data GIS Jalan Aing belum dikonfigurasi' }))
    return
  }

  const params = { ...layer.params }
  if (layer.cqlFilterFromQuery) {
    const cqlFilter = (query.get('cqlFilter') || '').slice(0, 300)
    if (!cqlFilter) {
      response.statusCode = 400
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ error: 'Parameter cqlFilter wajib diisi' }))
      return
    }
    params.CQL_FILTER = cqlFilter
  }

  try {
    const result = await axios.get(layer.url, {
      auth: { username, password },
      params,
      headers: {
        Accept: 'application/json,text/plain,*/*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36',
      },
      responseType: 'json',
      timeout: 30000,
    })

    response.setHeader('Cache-Control', 'private, max-age=300')
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(result.data))
  } catch (error) {
    response.statusCode = error.response?.status === 401 || error.response?.status === 403 ? 502 : 500
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ error: 'Data GIS Jalan Aing tidak dapat dimuat' }))
  }
}
