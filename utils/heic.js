const HEIC_EXT = /\.(heic|heif)$/i
const HEIC_MIME = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']

/**
 * Cheap synchronous check — no library load.
 * Gate for the dynamic `import('heic-to')` so non-HEIC uploads never pull the wasm chunk.
 */
export function isLikelyHeic(file) {
  if (!file) return false
  const type = (file.type || '').toLowerCase()
  if (HEIC_MIME.includes(type)) return true
  // iOS frequently reports an empty MIME type for HEIC picked via the Files app.
  if (!type && HEIC_EXT.test(file.name || '')) return true
  return HEIC_EXT.test(file.name || '')
}

/**
 * Convert a HEIC/HEIF file to a JPEG `File`. Non-HEIC input is returned untouched
 * without loading the converter. Throws if the conversion itself fails — the
 * caller owns the user-facing error handling.
 *
 * @param {File} file
 * @param {{ quality?: number }} [opts]
 * @returns {Promise<File>}
 */
export async function convertHeicToJpg(file, { quality = 0.85 } = {}) {
  if (!isLikelyHeic(file)) return file

  const { heicTo, isHeic } = await import('heic-to')

  const reallyHeic = await isHeic(file).catch(() => true)
  if (!reallyHeic) return file

  const blob = await heicTo({ blob: file, type: 'image/jpeg', quality })
  const newName = `${(file.name || 'photo').replace(HEIC_EXT, '')}.jpg`
  return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() })
}
