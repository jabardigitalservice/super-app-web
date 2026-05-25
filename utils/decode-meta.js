/** Base64url-safe JSON dari query `meta` (UTF-8) */
export function decodeMetaQueryParam(encoded) {
  if (!encoded || typeof encoded !== 'string' || typeof atob === 'undefined') {
    return null
  }
  try {
    const normalized = encoded.trim().replace(/-/g, '+').replace(/_/g, '/')
    const padLen = (4 - (normalized.length % 4)) % 4
    const padded = normalized + '='.repeat(padLen)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
    const text = new TextDecoder('utf-8').decode(bytes)
    return JSON.parse(text)
  } catch {
    return null
  }
}
