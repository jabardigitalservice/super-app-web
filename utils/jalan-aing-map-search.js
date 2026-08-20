const PHOTON_URL = 'https://photon.komoot.io/api/'
const MJT_ROUTES_URL = 'https://tfgb-api.up.railway.app/api/mjt/routes'

let busStopsPromise

const normalize = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036F]/g, '')
  .toLocaleLowerCase('id-ID')

const unique = (results) => [...new Map(results.map((result) => [result.place_id, result])).values()]
const matchesQuery = (value, query) => normalize(query).split(/\s+/).every((token) => normalize(value).includes(token))

async function searchPlaces(query, limit) {
  const params = new URLSearchParams({ q: `${query}, Jawa Barat`, limit: String(limit), lat: '-6.9', lon: '107.6' })
  const response = await fetch(`${PHOTON_URL}?${params}`)
  if (!response.ok) throw new Error('Pencarian lokasi tidak tersedia')

  const payload = await response.json()
  return (payload.features || []).map((feature) => {
    const displayName = [feature.properties.street, feature.properties.city, feature.properties.state, feature.properties.country].filter(Boolean).join(', ')
    return {
      place_id: `place:${feature.properties.osm_type}-${feature.properties.osm_id}`,
      name: feature.properties.name || feature.properties.city || 'Lokasi',
      display_name: displayName,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      searchable: [feature.properties.name, displayName].filter(Boolean).join(' '),
    }
  }).filter((place) => matchesQuery(place.searchable, query))
}

function fetchBusStops() {
  if (!busStopsPromise) {
    busStopsPromise = fetch(MJT_ROUTES_URL)
      .then(async (response) => {
        if (!response.ok) throw new Error('Pencarian halte tidak tersedia')
        const payload = await response.json()
        if (!Array.isArray(payload.data)) throw new Error('Pencarian halte tidak tersedia')

        return unique(payload.data.flatMap((route) => (route.shelters || []).map((shelter) => ({
          place_id: `bus-stop:${shelter.nama_selter}:${shelter.latitude}:${shelter.longitude}`,
          name: shelter.nama_selter || 'Halte Bus',
          display_name: ['Halte Bus', route.kor, route.origin, route.toward].filter(Boolean).join(' · '),
          lat: Number(shelter.latitude),
          lon: Number(shelter.longitude),
          searchable: [shelter.nama_selter, route.kor, route.origin, route.toward].filter(Boolean).join(' '),
        }))).filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lon)))
      })
      .catch((error) => {
        busStopsPromise = null
        throw error
      })
  }
  return busStopsPromise
}

async function searchBusStops(query, limit) {
  const normalizedQuery = normalize(query)
  const stops = await fetchBusStops()
  return stops.filter((stop) => matchesQuery(stop.searchable, normalizedQuery)).slice(0, limit)
}

export const mapSearchSources = [
  { search: searchPlaces },
  { search: searchBusStops },
]

export async function searchMapSources(query, { sources = mapSearchSources, limit = 5 } = {}) {
  const responses = await Promise.allSettled(sources.map((source) => source.search(query, limit)))
  return {
    results: unique(responses.flatMap((response) => response.status === 'fulfilled' ? response.value : [])),
    available: responses.some((response) => response.status === 'fulfilled'),
  }
}
