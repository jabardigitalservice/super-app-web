const PHOTON_URL = 'https://photon.komoot.io/api/'
const MJT_ROUTES_URL = 'https://tfgb-api.up.railway.app/api/mjt/routes'
const MJT_ROUTES_CACHE_KEY = 'jalan-aing-mjt-routes-v1'
const MJT_ROUTES_CACHE_TTL = 24 * 60 * 60 * 1000

let busStopsPromise
let routesPromise

function readCachedRoutes() {
  try {
    const cached = JSON.parse(window.localStorage.getItem(MJT_ROUTES_CACHE_KEY) || 'null')
    if (cached?.expiresAt > Date.now() && Array.isArray(cached.data)) return cached.data
    window.localStorage.removeItem(MJT_ROUTES_CACHE_KEY)
  } catch (_) {
    window.localStorage.removeItem(MJT_ROUTES_CACHE_KEY)
  }
  return null
}

function cacheRoutes(data) {
  try {
    window.localStorage.setItem(MJT_ROUTES_CACHE_KEY, JSON.stringify({ data, expiresAt: Date.now() + MJT_ROUTES_CACHE_TTL }))
  } catch (_) {}
}

export function getMjtRoutes() {
  const cached = readCachedRoutes()
  if (cached) return Promise.resolve(cached)

  if (!routesPromise) {
    routesPromise = fetch(MJT_ROUTES_URL)
      .then(async (response) => {
        if (!response.ok) throw new Error('Data rute bus tidak tersedia')
        const payload = await response.json()
        if (!Array.isArray(payload.data)) throw new Error('Data rute bus tidak tersedia')
        cacheRoutes(payload.data)
        return payload.data
      })
      .finally(() => { routesPromise = null })
  }
  return routesPromise
}

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
    busStopsPromise = getMjtRoutes()
      .then((routes) => unique(routes.flatMap((route) => (route.shelters || []).map((shelter) => ({
          place_id: `bus-stop:${shelter.nama_selter}:${shelter.latitude}:${shelter.longitude}`,
          name: shelter.nama_selter || 'Halte Bus',
          display_name: ['Halte Bus', route.kor, route.origin, route.toward].filter(Boolean).join(' · '),
          lat: Number(shelter.latitude),
          lon: Number(shelter.longitude),
          searchable: [shelter.nama_selter, route.kor, route.origin, route.toward].filter(Boolean).join(' '),
        }))).filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lon))))
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
