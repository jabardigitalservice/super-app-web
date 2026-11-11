// Free, keyless routing on OpenStreetMap data via the FOSSGIS OSRM servers.
// Usage policy: light, interactive use only (one request per user action).
const ROUTING_BASE_URL = 'https://routing.openstreetmap.de'

export const routeProfiles = Object.freeze([
  { id: 'car', label: 'Kendaraan', server: 'routed-car' },
  { id: 'bike', label: 'Sepeda', server: 'routed-bike' },
  { id: 'foot', label: 'Jalan kaki', server: 'routed-foot' },
])

const MODIFIERS = {
  left: 'kiri',
  right: 'kanan',
  'slight left': 'sedikit ke kiri',
  'slight right': 'sedikit ke kanan',
  'sharp left': 'tajam ke kiri',
  'sharp right': 'tajam ke kanan',
}

function turnText(modifier) {
  if (modifier === 'uturn') return 'Putar balik'
  if (!modifier || modifier === 'straight') return 'Lurus'
  return `Belok ${MODIFIERS[modifier] || modifier}`
}

export function describeStep(step) {
  const { type, modifier, exit } = step.maneuver || {}
  const name = step.name || step.ref || ''
  const onto = name ? ` ke ${name}` : ''
  switch (type) {
    case 'depart':
      return name ? `Mulai dari ${name}` : 'Mulai dari titik awal'
    case 'arrive':
      return 'Tiba di tujuan'
    case 'roundabout':
    case 'rotary':
    case 'roundabout turn':
      return `Masuk bundaran, ambil keluar ke-${exit || 1}${onto}`
    case 'new name':
    case 'continue':
      return modifier && modifier !== 'straight'
        ? `${turnText(modifier)}${onto}`
        : `Lanjut lurus${onto}`
    case 'merge':
      return `Bergabung${onto}`
    case 'on ramp':
      return `Masuk jalur${onto}`
    case 'off ramp':
      return `Keluar jalur${onto}`
    case 'fork':
      return `Ambil cabang ${MODIFIERS[modifier] || 'lurus'}${onto}`
    default:
      return `${turnText(modifier)}${onto}`
  }
}

export function formatDistance(meters) {
  if (!Number.isFinite(meters)) return ''
  const rounded = Math.max(10, Math.round(meters / 10) * 10)
  if (rounded < 1000) return `${rounded} m`
  return `${(meters / 1000).toLocaleString('id-ID', {
    maximumFractionDigits: meters < 10000 ? 1 : 0,
  })} km`
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return ''
  const minutes = Math.max(1, Math.round(seconds / 60))
  if (minutes < 60) return `${minutes} mnt`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} j ${rest} mnt` : `${hours} j`
}

export async function fetchRoute(from, to, profileId = 'car', signal) {
  const profile =
    routeProfiles.find((item) => item.id === profileId) || routeProfiles[0]
  const points = [from, to].map((point) => `${point.lng},${point.lat}`)
  const params = new URLSearchParams({
    overview: 'full',
    geometries: 'geojson',
    steps: 'true',
    alternatives: 'false',
  })
  const response = await fetch(
    `${ROUTING_BASE_URL}/${profile.server}/route/v1/driving/${points.join(
      ';'
    )}?${params}`,
    { signal }
  )
  if (!response.ok) throw new Error('Layanan rute tidak tersedia')
  const payload = await response.json()
  const route = payload.routes?.[0]
  if (payload.code !== 'Ok' || !route) {
    const error = new Error('Rute tidak ditemukan')
    error.code = payload.code || 'NoRoute'
    throw error
  }
  const steps = route.legs
    .flatMap((leg) => leg.steps || [])
    .filter(
      (step, index, list) =>
        // Drop zero-length "new name" hops so the list reads like directions.
        !(step.maneuver?.type === 'new name' && step.distance < 15) ||
        index === list.length - 1
    )
    .map((step) => ({
      text: describeStep(step),
      distance: step.distance,
      lat: step.maneuver?.location?.[1],
      lng: step.maneuver?.location?.[0],
      type: step.maneuver?.type,
    }))
  return {
    profile: profile.id,
    distance: route.distance,
    duration: route.duration,
    coordinates: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    steps,
  }
}
