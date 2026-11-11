// Small geometry helpers for route planning and route analysis.
// Coordinates are [lat, lng] unless noted; distances are in meters.
const EARTH_RADIUS = 6371000
const toRad = (deg) => (deg * Math.PI) / 180

export function haversine(a, b) {
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function decodePolyline(encoded = '') {
  const points = []
  let index = 0
  let lat = 0
  let lng = 0
  while (index < encoded.length) {
    let result = 0
    let shift = 0
    let byte
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1
    result = 0
    shift = 0
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1
    points.push([lat / 1e5, lng / 1e5])
  }
  return points
}

export function cumulativeDistances(line) {
  const cumulative = [0]
  for (let index = 1; index < line.length; index++)
    cumulative.push(cumulative[index - 1] + haversine(line[index - 1], line[index]))
  return cumulative
}

// Local planar projection (meters) around a reference latitude: accurate
// enough for the short distances used in snapping and buffering.
function projector(refLat) {
  const kx = Math.cos(toRad(refLat)) * 111320
  const ky = 110540
  return ([lat, lng]) => [lng * kx, lat * ky]
}

export function pointSegmentDistance(point, a, b) {
  const project = projector(point[0])
  const [px, py] = project(point)
  const [ax, ay] = project(a)
  const [bx, by] = project(b)
  const dx = bx - ax
  const dy = by - ay
  const lengthSq = dx * dx + dy * dy
  const t = lengthSq
    ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq))
    : 0
  return { distance: Math.hypot(px - (ax + t * dx), py - (ay + t * dy)), t }
}

// Nearest position on a polyline: segment index, fraction and distance.
export function snapToLine(line, point) {
  let best = { index: 0, t: 0, distance: Infinity }
  for (let index = 0; index < line.length - 1; index++) {
    const { distance, t } = pointSegmentDistance(
      point,
      line[index],
      line[index + 1]
    )
    if (distance < best.distance) best = { index, t, distance }
  }
  return best
}

export function alongDistance(line, cumulative, snap) {
  const segment = cumulative[snap.index + 1] - cumulative[snap.index] || 0
  return cumulative[snap.index] + segment * snap.t
}

export function sliceLine(line, cumulative, startAlong, endAlong) {
  const result = []
  const pointAt = (along) => {
    let index = 0
    while (index < cumulative.length - 2 && cumulative[index + 1] < along)
      index++
    const segment = cumulative[index + 1] - cumulative[index] || 1
    const t = Math.max(0, Math.min(1, (along - cumulative[index]) / segment))
    const a = line[index]
    const b = line[index + 1] || a
    return { index, point: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] }
  }
  const start = pointAt(startAlong)
  const end = pointAt(endAlong)
  result.push(start.point)
  for (let index = start.index + 1; index <= end.index; index++)
    result.push(line[index])
  result.push(end.point)
  return result
}

// Evenly spaced samples along a polyline, each with its along-route distance.
export function sampleLine(line, step = 40) {
  const samples = []
  if (!line.length) return samples
  let along = 0
  let carry = 0
  samples.push({ point: line[0], along: 0 })
  for (let index = 1; index < line.length; index++) {
    const a = line[index - 1]
    const b = line[index]
    const length = haversine(a, b)
    let offset = step - carry
    while (offset <= length) {
      const t = offset / length
      samples.push({
        point: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
        along: along + offset,
      })
      offset += step
    }
    carry = length - (offset - step)
    along += length
  }
  samples.push({ point: line[line.length - 1], along })
  return samples
}

export function lineBounds(points) {
  let minLat = Infinity
  let minLng = Infinity
  let maxLat = -Infinity
  let maxLng = -Infinity
  points.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  })
  return { minLat, minLng, maxLat, maxLng }
}

export function boundsIntersect(a, b, padding = 0) {
  return !(
    a.maxLat + padding < b.minLat ||
    a.minLat - padding > b.maxLat ||
    a.maxLng + padding < b.minLng ||
    a.minLng - padding > b.maxLng
  )
}

// GeoJSON helpers (GeoJSON coordinates are [lng, lat]).
export function geometryLines(geometry) {
  if (!geometry) return []
  const toLatLng = (ring) => ring.map(([lng, lat]) => [lat, lng])
  switch (geometry.type) {
    case 'LineString':
      return [toLatLng(geometry.coordinates)]
    case 'MultiLineString':
      return geometry.coordinates.map(toLatLng)
    case 'Polygon':
      return geometry.coordinates.map(toLatLng)
    case 'MultiPolygon':
      return geometry.coordinates.flatMap((polygon) => polygon.map(toLatLng))
    default:
      return []
  }
}

export function geometryBounds(geometry) {
  if (!geometry) return null
  if (geometry.type === 'Point') {
    const [lng, lat] = geometry.coordinates
    return { minLat: lat, maxLat: lat, minLng: lng, maxLng: lng }
  }
  const points = geometryLines(geometry).flat()
  return points.length ? lineBounds(points) : null
}

function pointInRing([lat, lng], ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lngI, latI] = ring[i]
    const [lngJ, latJ] = ring[j]
    if (
      latI > lat !== latJ > lat &&
      lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI
    )
      inside = !inside
  }
  return inside
}

export function pointInGeometry(point, geometry) {
  if (!geometry) return false
  const polygons =
    geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.type === 'MultiPolygon'
      ? geometry.coordinates
      : []
  return polygons.some(
    ([outer, ...holes]) =>
      pointInRing(point, outer) &&
      !holes.some((hole) => pointInRing(point, hole))
  )
}
