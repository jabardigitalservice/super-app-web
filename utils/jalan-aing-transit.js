// Bus MJT journey planner built only on Jalan Aing / MJT data:
// corridor polylines, ordered halte lists, operating hours and live buses.
import {
  alongDistance,
  cumulativeDistances,
  decodePolyline,
  haversine,
  sliceLine,
  snapToLine,
} from '~/utils/jalan-aing-geo'
import { getMjtRoutes } from '~/utils/jalan-aing-map-search'

const MJT_BUSES_URL = 'https://tfgb-api.up.railway.app/api/mjt/buses'
const WALK_SPEED = 1.2 // m/s
const WALK_DETOUR = 1.3 // straight line → street distance
const MAX_WALK = 900 // straight-line meters to a halte
const TRANSFER_RADIUS = 250
const BUS_SPEED = 4.5 // m/s, ~16 km/h in city traffic incl. signals
const STOP_DWELL = 25 // seconds per intermediate halte
const DEFAULT_WAIT = 12 * 60
const LIVE_BUS_MAX_AGE = 10 * 60 // seconds since last GPS fix

let corridorsPromise

function parseClock(value) {
  const match = String(value || '').match(/(\d{1,2})[.:](\d{2})/)
  return match ? Number(match[1]) * 60 + Number(match[2]) : null
}

function parseHours(value) {
  const [open, close] = String(value || '')
    .split('-')
    .map(parseClock)
  return Number.isFinite(open) && Number.isFinite(close)
    ? { open, close, label: String(value).replace(/\./g, ':').trim() }
    : null
}

function jakartaMinutes(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (type) => Number(parts.find((part) => part.type === type)?.value)
  return get('hour') * 60 + get('minute')
}

export function getCorridors() {
  if (!corridorsPromise) {
    corridorsPromise = getMjtRoutes()
      .then((routes) =>
        routes
          .map((route, order) => {
            const line = decodePolyline(route.points || '')
            if (line.length < 2) return null
            const cumulative = cumulativeDistances(line)
            const shelters = (route.shelters || [])
              .map((shelter) => {
                const point = [Number(shelter.latitude), Number(shelter.longitude)]
                if (!point.every(Number.isFinite)) return null
                const snap = snapToLine(line, point)
                return {
                  name: shelter.nama_selter || 'Halte',
                  lat: point[0],
                  lng: point[1],
                  along: alongDistance(line, cumulative, snap),
                  offLine: snap.distance,
                }
              })
              .filter((shelter) => shelter && shelter.offLine < 150)
              .sort((a, b) => a.along - b.along)
            return {
              key: `${route.route_id}:${order}`,
              routeId: String(route.route_id),
              kor: route.kor || 'MJT',
              color: /^#[0-9a-f]{6}$/i.test(route.color) ? route.color : '#2563EB',
              name: route.route || '',
              origin: route.origin || '',
              toward: route.toward || '',
              hours: parseHours(route.jam_ops),
              active: String(route.is_ops) !== '0',
              line,
              cumulative,
              shelters,
            }
          })
          .filter(Boolean)
      )
      .catch((error) => {
        corridorsPromise = null
        throw error
      })
  }
  return corridorsPromise
}

export async function getLiveBuses(signal) {
  try {
    const response = await fetch(MJT_BUSES_URL, { signal })
    if (!response.ok) return []
    const payload = await response.json()
    return (payload.data || []).filter(
      (bus) =>
        Number.isFinite(bus.lat) &&
        Number.isFinite(bus.lon) &&
        Number(bus.ago || 0) <= LIVE_BUS_MAX_AGE
    )
  } catch (error) {
    if (signal?.aborted) throw error
    return []
  }
}

// Wait until the next live bus heading the right way reaches the halte.
function liveWait(corridor, halte, buses) {
  let best = null
  buses.forEach((bus) => {
    if (String(bus.route_id) !== corridor.routeId) return
    if (bus.toward && corridor.toward && bus.toward !== corridor.toward) return
    const snap = snapToLine(corridor.line, [bus.lat, bus.lon])
    if (snap.distance > 120) return
    const busAlong = alongDistance(corridor.line, corridor.cumulative, snap)
    const gap = halte.along - busAlong
    if (gap < 0) return
    const seconds = gap / BUS_SPEED
    if (!best || seconds < best.seconds) best = { seconds, bus: bus.name }
  })
  return best
}

function isOpen(corridor, minutes) {
  if (!corridor.active) return false
  if (!corridor.hours) return true
  return minutes >= corridor.hours.open && minutes <= corridor.hours.close
}

function walkLeg(from, to) {
  const distance = haversine([from.lat, from.lng], [to.lat, to.lng]) * WALK_DETOUR
  return {
    type: 'walk',
    from,
    to,
    distance,
    duration: distance / WALK_SPEED,
    coords: [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ],
  }
}

function rideLeg(corridor, board, alight, buses) {
  const distance = alight.along - board.along
  const stops = corridor.shelters.filter(
    (shelter) => shelter.along > board.along && shelter.along <= alight.along
  ).length
  const live = liveWait(corridor, board, buses)
  return {
    type: 'ride',
    corridorKey: corridor.key,
    kor: corridor.kor,
    color: corridor.color,
    toward: corridor.toward,
    routeName: corridor.name,
    hours: corridor.hours?.label || '',
    board: { name: board.name, lat: board.lat, lng: board.lng },
    alight: { name: alight.name, lat: alight.lat, lng: alight.lng },
    stops,
    distance,
    duration: distance / BUS_SPEED + Math.max(0, stops - 1) * STOP_DWELL,
    wait: live ? live.seconds : DEFAULT_WAIT,
    waitSource: live ? 'live' : 'estimate',
    coords: sliceLine(corridor.line, corridor.cumulative, board.along, alight.along),
  }
}

function nearShelters(corridor, point, radius = MAX_WALK) {
  return corridor.shelters
    .map((shelter) => ({
      shelter,
      distance: haversine(point, [shelter.lat, shelter.lng]),
    }))
    .filter((item) => item.distance <= radius)
}

const transferCache = new Map()
function transferPairs(first, second) {
  const key = `${first.key}>${second.key}`
  if (!transferCache.has(key)) {
    const pairs = []
    first.shelters.forEach((transferOut) =>
      second.shelters.forEach((transferIn) => {
        const gap = haversine(
          [transferOut.lat, transferOut.lng],
          [transferIn.lat, transferIn.lng]
        )
        if (gap <= TRANSFER_RADIUS) pairs.push({ transferOut, transferIn, gap })
      })
    )
    transferCache.set(key, pairs)
  }
  return transferCache.get(key)
}

function summarize(legs, closed, hoursLabels) {
  const duration = legs.reduce(
    (total, leg) => total + leg.duration + (leg.wait || 0),
    0
  )
  const rides = legs.filter((leg) => leg.type === 'ride')
  return {
    type: 'transit',
    id: rides.map((leg) => `${leg.corridorKey}@${leg.board.name}`).join('>'),
    duration,
    distance: legs.reduce((total, leg) => total + leg.distance, 0),
    walkDistance: legs
      .filter((leg) => leg.type === 'walk')
      .reduce((total, leg) => total + leg.distance, 0),
    transfers: rides.length - 1,
    firstWait: rides[0]?.wait,
    firstWaitSource: rides[0]?.waitSource,
    closed,
    hours: [...new Set(hoursLabels.filter(Boolean))],
    legs,
  }
}

export async function planTransit(from, to, { signal, now = new Date() } = {}) {
  const [corridors, buses] = await Promise.all([
    getCorridors(),
    getLiveBuses(signal),
  ])
  const minutes = jakartaMinutes(now)
  const origin = [from.lat, from.lng]
  const destination = [to.lat, to.lng]
  const fromPoint = { ...from, name: from.label }
  const toPoint = { ...to, name: to.label }
  const options = new Map()
  const keep = (option) => {
    const current = options.get(option.id)
    if (!current || option.duration < current.duration)
      options.set(option.id, option)
  }

  corridors.forEach((first) => {
    const boards = nearShelters(first, origin)
    if (!boards.length) return
    const alights = nearShelters(first, destination)

    // Direct rides.
    boards.forEach(({ shelter: board }) => {
      alights.forEach(({ shelter: alight }) => {
        if (alight.along - board.along < 300) return
        const legs = [
          walkLeg(fromPoint, board),
          rideLeg(first, board, alight, buses),
          walkLeg(alight, toPoint),
        ]
        keep(summarize(legs, !isOpen(first, minutes), [first.hours?.label]))
      })
    })

    // One transfer.
    corridors.forEach((second) => {
      if (second.routeId === first.routeId) return
      const finals = nearShelters(second, destination)
      if (!finals.length) return
      const transfers = transferPairs(first, second)
      if (!transfers.length) return
      boards.forEach(({ shelter: board }) => {
        transfers.forEach(({ transferOut, transferIn, gap }) => {
          if (transferOut.along - board.along < 300) return
          finals.forEach(({ shelter: alight }) => {
              if (alight.along - transferIn.along < 300) return
              const legs = [
                walkLeg(fromPoint, board),
                rideLeg(first, board, transferOut, buses),
                ...(gap > 20 ? [walkLeg(transferOut, transferIn)] : []),
                rideLeg(second, transferIn, alight, buses),
                walkLeg(alight, toPoint),
              ]
              keep(
                summarize(
                  legs,
                  !isOpen(first, minutes) || !isOpen(second, minutes),
                  [first.hours?.label, second.hours?.label]
                )
              )
            })
        })
      })
    })
  })

  // Best option per corridor combination, open services first.
  const bestByCombo = new Map()
  ;[...options.values()].forEach((option) => {
    const combo = option.legs
      .filter((leg) => leg.type === 'ride')
      .map((leg) => leg.corridorKey)
      .join('>')
    const current = bestByCombo.get(combo)
    if (!current || option.duration < current.duration)
      bestByCombo.set(combo, option)
  })
  // Score like a rider would: walking and transfers feel longer than riding.
  const score = (option) =>
    option.duration +
    (option.walkDistance / WALK_SPEED) * 0.8 +
    option.transfers * 6 * 60
  const candidates = [...bestByCombo.values()]
  const bestDirect = Math.min(
    ...candidates.filter((item) => !item.transfers).map(score),
    Infinity
  )
  const ranked = candidates
    .filter((item) => !item.transfers || score(item) < bestDirect - 5 * 60)
    .sort((a, b) => Number(a.closed) - Number(b.closed) || score(a) - score(b))
  const direct = haversine(origin, destination)
  const nearestHalte = corridors
    .flatMap((corridor) => corridor.shelters)
    .reduce(
      (best, shelter) => {
        const distance = haversine(origin, [shelter.lat, shelter.lng])
        return distance < best.distance ? { shelter, distance } : best
      },
      { shelter: null, distance: Infinity }
    )
  return {
    options: ranked.slice(0, 3),
    straightDistance: direct,
    nearestHalte: nearestHalte.shelter
      ? { ...nearestHalte.shelter, distance: nearestHalte.distance }
      : null,
  }
}

export async function nearestHalte(point) {
  const corridors = await getCorridors()
  let best = null
  corridors.forEach((corridor) =>
    corridor.shelters.forEach((shelter) => {
      const distance = haversine(
        [point.lat, point.lng],
        [shelter.lat, shelter.lng]
      )
      if (!best || distance < best.distance)
        best = { ...shelter, kor: corridor.kor, distance }
    })
  )
  return best
}
