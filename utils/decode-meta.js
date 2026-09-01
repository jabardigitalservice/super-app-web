/**
 * Dekripsi query `meta` Imah Aing.
 *
 * Wire: `base64( salt[16] ‖ iv[12] ‖ ciphertext ‖ tag[16] )`, AES-256-GCM,
 * key = PBKDF2-HMAC-SHA256(secret UTF-8, salt, 100000 iter, 32 byte).
 * Plaintext = JSON mentah (tanpa inner base64). Tanpa AAD.
 * Recipe di-set mobile (`README-metadata-encryption.md`), dipakai apa adanya.
 *
 * @param {string} encoded - nilai query param `meta` (sudah URL-decoded oleh router)
 * @param {string} secret - `METADATA_SECRET` (passphrase, dipakai sbg string UTF-8)
 * @returns {Promise<object|null>} payload JSON, atau `null` bila input invalid / decrypt gagal
 */
export async function decryptMetaQueryParam(encoded, secret) {
  if (
    !encoded ||
    typeof encoded !== 'string' ||
    !secret ||
    typeof atob === 'undefined' ||
    !globalThis.crypto ||
    !globalThis.crypto.subtle
  ) {
    return null
  }

  try {
    const normalized = encoded.trim().replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '')
    const padLen = (4 - (normalized.length % 4)) % 4
    const padded = normalized + '='.repeat(padLen)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))

    const salt = bytes.slice(0, 16)
    const iv = bytes.slice(16, 28)
    const data = bytes.slice(28) // ciphertext + auth tag (di-handle otomatis oleh AES-GCM)

    const keyMaterial = await globalThis.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      'PBKDF2',
      false,
      ['deriveKey']
    )
    const key = await globalThis.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )
    const plain = await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      key,
      data
    )

    return JSON.parse(new TextDecoder('utf-8').decode(plain))
  } catch {
    return null
  }
}
