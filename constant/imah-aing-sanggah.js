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

/**
 * Kategori sanggah — placeholder slug FE, enum final dari BE (belum dikonfirmasi).
 */
export const SANGGAH_CATEGORY_OPTIONS = Object.freeze([
  { value: 'data-kependudukan', label: 'Data Kependudukan' },
  { value: 'desil', label: 'Desil' },
  { value: 'tata-ruang', label: 'Tata Ruang' },
  { value: 'kebencanaan', label: 'Kebencanaan' },
])

export const SANGGAH_DESCRIPTION_MIN = 10
export const SANGGAH_DESCRIPTION_MAX = 500

export const SANGGAH_AGREEMENT_TEXT =
  'Saya bersedia dibatalkan jika data yang saya masukkan tidak benar'

export const SANGGAH_BUKTI_FIELD = 'bukti_sanggah'
export const SANGGAH_BUKTI_ACCEPT = 'image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf'
export const SANGGAH_BUKTI_MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const SANGGAH_BUKTI_ALLOWED_MIME = ['image/jpeg', 'image/png', 'application/pdf']
const SANGGAH_BUKTI_ALLOWED_EXT = /\.(jpe?g|png|pdf)$/i

/** Format file bukti didukung (cek MIME, fallback ekstensi bila MIME kosong). */
export const isSanggahBuktiFormatAllowed = (file) => {
  if (!file) return false
  const type = (file.type || '').toLowerCase()
  if (type) return SANGGAH_BUKTI_ALLOWED_MIME.includes(type)
  return SANGGAH_BUKTI_ALLOWED_EXT.test(file.name || '')
}

/**
 * Saklar tunggal stub submit sanggah. BE (endpoint, kontrak payload, status baru) belum ready:
 * `true` → submit disimulasikan sukses tanpa memanggil BE. Ganti ke implementasi
 * sungguhan di `imahAingSanggah.submitSanggah` lalu matikan sebelum production.
 */
export const SANGGAH_SUBMIT_STUB = true
