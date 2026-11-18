import { decryptMetaQueryParam } from '~/utils/decode-meta'
import { IMAH_AING_INVALID_ACCESS_PATH } from '~/constant/imah-aing-closure'
import { IMAH_AING_SOURCE_IDS } from '~/constant/imah-aing-status'

const first = (value) => (Array.isArray(value) ? value[0] : value)

// Akses sah = datang dari Sapawarga/Hotline Jabar: `source_id` salah satu IMAH_AING_SOURCE_IDS, `meta` ada dan
// terdekripsi menjadi object ber-`token`. Fail-closed: semua jalur gagal → false.
export async function isValidImahAingAccess(query, secret) {
  const sourceId = first(query.source_id)
  const meta = first(query.meta)
  if (!IMAH_AING_SOURCE_IDS.includes(sourceId) || !meta) return false

  const decoded = await decryptMetaQueryParam(String(meta), secret)
  return !!(decoded && typeof decoded === 'object' && decoded.token)
}

// Query tidak dibawa ke halaman tujuan: isinya `meta` terenkripsi milik URL yang invalid.
export default async function ({ route, redirect, $config }) {
  if (!(await isValidImahAingAccess(route.query, $config.metadataSecret))) {
    redirect({ path: IMAH_AING_INVALID_ACCESS_PATH })
  }
}
