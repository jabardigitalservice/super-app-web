const WEST_JAVA_BOUNDS = Object.freeze({
  minLat: -7.9,
  maxLat: -5.9,
  minLng: 106.3,
  maxLng: 109.2,
})

export function isJalanAingLocation(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= WEST_JAVA_BOUNDS.minLat && lat <= WEST_JAVA_BOUNDS.maxLat
    && lng >= WEST_JAVA_BOUNDS.minLng && lng <= WEST_JAVA_BOUNDS.maxLng
}
