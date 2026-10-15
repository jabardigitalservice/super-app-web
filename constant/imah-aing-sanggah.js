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
 * True bila user login adalah pemilik aduan (`item.user_id`). BE hanya menerima sanggahan
 * dari pemilik; pengusul/anggota KK yang bukan pemilik ditolak. Bila `user_id` aduan kosong,
 * BE melewati cek kepemilikan sehingga di sini ikut dilewati.
 */
export const isImahAingOwnerItem = (item, metaPayload = {}) => {
  if (!item) return false
  if (!item.user_id) return true
  return !!metaPayload?.id && item.user_id === metaPayload.id
}

/** Fail-closed: tombol/halaman sanggah hanya bila BE mengirim `can_appeal === true`. */
export const canAppealItem = (item) => item?.can_appeal === true

/**
 * Kategori sanggah — slug identik dengan enum BE (`aduan-service` AppealCategories).
 */
export const SANGGAH_CATEGORY_OPTIONS = Object.freeze([
  { value: 'data-kependudukan', label: 'Data Kependudukan' },
  { value: 'desil', label: 'Desil' },
  { value: 'tata-ruang', label: 'Tata Ruang' },
  { value: 'kebencanaan', label: 'Kebencanaan' },
])

/** Copy info sanggah di Riwayat (tooltip desktop + snackbar HP) untuk usulan berstatus Ditolak. */
export const SANGGAH_INFO_TEXT =
  'Sanggahan untuk usulan yang Ditolak hanya dapat diajukan 1 (satu) kali oleh Pengusul, dan keputusan akhir sepenuhnya menjadi kewenangan Tim Imah Aing serta bersifat mutlak.'

/**
 * Status sanggah (`appeal.status` dari BE) → label chip, warna, dan teks detail.
 * Status usulan terpisah: `rejected` tetap Ditolak, `verified` → usulan Lolos Verifikasi,
 * `postponed` → usulan kembali Menunggu Verifikasi (bisa di-Edit Ajuan).
 */
export const SANGGAH_APPEAL_STATUS = Object.freeze({
  unverified: {
    label: 'Sanggah: Menunggu Verifikasi',
    hex: '#FF7500',
    description: 'Sanggahan Anda sedang diverifikasi oleh Tim Imah Aing.',
  },
  rejected: {
    label: 'Sanggah: Ditolak',
    hex: '#DD5E5E',
    description: 'Sanggahan Anda ditolak.',
  },
  verified: {
    label: 'Sanggah: Diterima',
    hex: '#166534',
    description: 'Sanggahan Anda diterima dan usulan dilanjutkan ke tahap berikutnya.',
  },
  postponed: {
    label: 'Sanggah: Ditunda',
    hex: '#1E88E5',
    description: 'Sanggahan ditunda. Perbarui data usulan melalui Edit Ajuan.',
  },
})

const SANGGAH_APPEAL_STATUS_FALLBACK = Object.freeze({
  label: 'Sanggah: Diajukan',
  hex: '#6B7280',
  description: 'Sanggahan telah diajukan.',
})

/**
 * Info tampilan sanggah dari objek `appeal` (list/detail usulan). `null` bila belum pernah sanggah.
 * Sengaja tidak mengembalikan `verified_by`/`verified_by_name` (belum ditampilkan ke warga)
 * maupun `user_notes` (makna di BE belum jelas).
 */
export const getSanggahAppealInfo = (appeal) => {
  if (!appeal || typeof appeal !== 'object') return null
  const known = SANGGAH_APPEAL_STATUS[appeal.status] || SANGGAH_APPEAL_STATUS_FALLBACK
  return {
    key: appeal.status || '',
    label: known.label,
    hex: known.hex,
    description: known.description,
    notes: appeal.verification_notes || '',
    verifiedAt: appeal.verification_at || '',
  }
}

export const SANGGAH_AGREEMENT_TEXT =
  'Saya bersedia dibatalkan jika data yang saya masukkan tidak benar'

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
 * Kirim field dinamis form sanggah (NIK/KK koreksi, Desil) ke BE. `false` sampai kontrak BE final
 * (plan 2026-10-15 B5). Jangan tag release produksi selagi `false`: isian warga tidak terkirim.
 */
export const SANGGAH_EXTRA_FIELDS_SUBMIT = false

/** Jenis data koreksi pada kategori Data Kependudukan. */
export const SANGGAH_ID_TYPE_OPTIONS = Object.freeze([
  { value: 'nik', label: 'NIK' },
  { value: 'kk', label: 'No KK' },
])

/** Panjang maksimal NIK/KK koreksi. */
export const SANGGAH_ID_MAX_LENGTH = 16

/** Nilai `user_notes` bila usulan tidak punya catatan penolakan (BE mewajibkan `user_notes`). */
export const SANGGAH_USER_NOTES_FALLBACK = '-'

const SANGGAH_ERROR_DEFAULT =
  'Kami mengalami kendala dalam mengirim sanggahan Anda. Silakan coba lagi nanti atau periksa koneksi internet Anda.'

/**
 * Petakan error BE submit sanggah (400 berisi pesan teks, tanpa kode khusus) ke pesan FE.
 * `retryable: false` → coba lagi tidak akan berhasil, arahkan kembali ke Riwayat.
 */
export const mapSanggahError = (error) => {
  const status = error?.response?.status
  const raw = String(error?.response?.data?.message || '').toLowerCase()

  if (status === 404) {
    return { message: 'Usulan tidak ditemukan.', retryable: false }
  }
  if (status === 400) {
    if (raw.includes('sanggahan aktif')) {
      return { message: 'Sanggahan untuk usulan ini sudah diajukan dan sedang menunggu verifikasi.', retryable: false }
    }
    if (raw.includes('ditolak sebelumnya')) {
      return { message: 'Sanggahan untuk usulan ini sebelumnya sudah ditolak dan tidak dapat diajukan kembali.', retryable: false }
    }
    if (raw.includes('pemilik aduan')) {
      return { message: 'Hanya pemilik usulan yang dapat mengajukan sanggahan.', retryable: false }
    }
    if (raw.includes('rejected_criteria')) {
      return { message: 'Usulan ini tidak dapat disanggah.', retryable: false }
    }
    if (raw.includes('kategori')) {
      return { message: 'Kategori sanggahan tidak valid. Silakan pilih ulang kategori.', retryable: true }
    }
  }
  return { message: SANGGAH_ERROR_DEFAULT, retryable: true }
}
