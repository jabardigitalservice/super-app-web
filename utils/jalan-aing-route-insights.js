// "Kondisi di rute": what Jalan Aing's own datasets say about a route line.
import {
  boundsIntersect,
  geometryBounds,
  geometryLines,
  haversine,
  lineBounds,
  pointInGeometry,
  pointSegmentDistance,
  sampleLine,
} from '~/utils/jalan-aing-geo'

const ROAD_MATCH = 22 // meters from a provincial road centreline
const ROAD_MIN_SECTION = 150
const HAZARD_STEP = 160
const FACILITY_RADIUS = { rumahSakit: 800, puskesmas: 800, restArea: 1500 }
const APJ_RADIUS = 30
const LEVEL_ORDER = { TINGGI: 3, SEDANG: 2, RENDAH: 1 }

export const HAZARD_LAYERS = Object.freeze([
  { id: 'bahayaBanjir', label: 'Rawan banjir' },
  { id: 'bahayaBanjirBandang', label: 'Rawan banjir bandang' },
  { id: 'bahayaTanahLongsor', label: 'Rawan tanah longsor' },
])

export const INSIGHT_LAYERS = Object.freeze([
  'ruasJalan',
  'rumahSakit',
  'puskesmas',
  'restArea',
  'apj',
  ...HAZARD_LAYERS.map((layer) => layer.id),
])

const withBounds = new WeakMap()
function featureBounds(feature) {
  if (!withBounds.has(feature))
    withBounds.set(feature, geometryBounds(feature.geometry))
  return withBounds.get(feature)
}

function hazardLevel(properties = {}) {
  const level = String(
    properties.bahaya || properties.kategori || properties.kriteria || ''
  ).toUpperCase()
  return LEVEL_ORDER[level] ? level : ''
}

function provincialSections(samples, bounds, data, nameOf) {
  const candidates = (data?.features || [])
    .filter((feature) => {
      const box = featureBounds(feature)
      return box && boundsIntersect(box, bounds, 0.0005)
    })
    .map((feature) => ({ feature, lines: geometryLines(feature.geometry) }))
  if (!candidates.length) return []

  const matches = samples.map(({ point }) => {
    let best = null
    candidates.forEach((candidate) => {
      const box = featureBounds(candidate.feature)
      if (!boundsIntersect(box, lineBounds([point]), 0.0004)) return
      candidate.lines.forEach((line) => {
        for (let index = 0; index < line.length - 1; index++) {
          const { distance } = pointSegmentDistance(
            point,
            line[index],
            line[index + 1]
          )
          if (distance <= ROAD_MATCH && (!best || distance < best.distance))
            best = { feature: candidate.feature, distance }
        }
      })
    })
    return best?.feature || null
  })

  const sections = []
  matches.forEach((feature, index) => {
    const sample = samples[index]
    const last = sections[sections.length - 1]
    if (feature && last && last.feature === feature) {
      last.endAlong = sample.along
      last.coords.push(sample.point)
    } else if (feature) {
      sections.push({
        feature,
        startAlong: sample.along,
        endAlong: sample.along,
        coords: [sample.point],
      })
    }
  })
  return sections
    .map((section) => ({
      ...section,
      length: section.endAlong - section.startAlong,
    }))
    .filter((section) => section.length >= ROAD_MIN_SECTION)
    .map((section) => {
      const middle = section.coords[Math.floor(section.coords.length / 2)]
      const properties = section.feature.properties || {}
      return {
        name: nameOf(section.feature, 'ruasJalan'),
        length: section.length,
        startAlong: section.startAlong,
        condition:
          properties.kondisijalan || properties.kondisi || properties.KONDISI || '',
        lat: middle[0],
        lng: middle[1],
        coords: section.coords,
      }
    })
}

function hazardZones(line, bounds, hazards) {
  const samples = sampleLine(line, HAZARD_STEP)
  return HAZARD_LAYERS.flatMap(({ id, label }) => {
    const data = hazards[id]
    if (!data) return []
    const features = (data.features || []).filter((feature) => {
      const box = featureBounds(feature)
      return box && boundsIntersect(box, bounds, 0.001)
    })
    if (!features.length) return []
    let worst = ''
    let length = 0
    let first = null
    const hits = []
    samples.forEach(({ point, along }) => {
      const hit = features.find(
        (feature) =>
          boundsIntersect(featureBounds(feature), lineBounds([point])) &&
          pointInGeometry(point, feature.geometry)
      )
      if (!hit) return
      const level = hazardLevel(hit.properties)
      if (!worst || (LEVEL_ORDER[level] || 0) > (LEVEL_ORDER[worst] || 0))
        worst = level
      length += HAZARD_STEP
      if (!first) first = { lat: point[0], lng: point[1], along }
      hits.push(point)
    })
    return length
      ? [{ id, label, level: worst, length, ...first, coords: hits }]
      : []
  })
}

function nearbyPoints(samples, bounds, data, radius, nameOf, layerId) {
  return (data?.features || [])
    .filter((feature) => feature.geometry?.type === 'Point')
    .filter((feature) =>
      boundsIntersect(featureBounds(feature), bounds, radius / 100000 + 0.001)
    )
    .map((feature) => {
      const [lng, lat] = feature.geometry.coordinates
      let best = { distance: Infinity, along: 0 }
      samples.forEach((sample) => {
        const distance = haversine([lat, lng], sample.point)
        if (distance < best.distance) best = { distance, along: sample.along }
      })
      return {
        name: nameOf(feature, layerId),
        lat,
        lng,
        distance: best.distance,
        along: best.along,
        properties: feature.properties || {},
      }
    })
    .filter((item) => item.distance <= radius)
    .sort((a, b) => a.along - b.along)
}

// datasets: { [layerId]: GeoJSON FeatureCollection | undefined }
export function analyzeRoute(line, datasets, nameOf) {
  const bounds = lineBounds(line)
  const samples = sampleLine(line, 40)
  const loaded = (id) => Boolean(datasets[id])
  return {
    roads: loaded('ruasJalan')
      ? provincialSections(samples, bounds, datasets.ruasJalan, nameOf)
      : null,
    hazards: HAZARD_LAYERS.some(({ id }) => loaded(id))
      ? hazardZones(line, bounds, datasets)
      : null,
    facilities: Object.fromEntries(
      Object.keys(FACILITY_RADIUS).map((id) => [
        id,
        loaded(id)
          ? nearbyPoints(
              samples,
              bounds,
              datasets[id],
              FACILITY_RADIUS[id],
              nameOf,
              id
            )
          : null,
      ])
    ),
    apj: loaded('apj')
      ? nearbyPoints(samples, bounds, datasets.apj, APJ_RADIUS, nameOf, 'apj')
          .length
      : null,
    pending: INSIGHT_LAYERS.filter((id) => !loaded(id)),
  }
}
