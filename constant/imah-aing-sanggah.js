/**
 * True bila item usulan milik user pada meta payload — sebagai pengusul,
 * penerima (user_id), atau satu KK (khusus warga). Dipakai Riwayat dan halaman Sanggah.
 */
export const isImahAingSelfItem = (item, metaPayload = {}) => {
  if (!item) return false
  const { id, kk, role } = metaPayload || {}
  const isWarga = (role || '').trim().toLowerCase() === 'warga'
  if (item.proposer?.id && id && item.proposer.id === id) return true
  if (item.user_id && id && item.user_id === id) return true
  if (isWarga && item.user_kk && kk && item.user_kk === kk) return true
  return false
}
