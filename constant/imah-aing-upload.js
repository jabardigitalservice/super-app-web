// Batas tunggu request /file/upload. Lewat batas ini request dibatalkan axios dan slot
// jadi ERROR supaya user bisa hapus / retry (tanpa timeout, slot nyangkut di UPLOADING).
export const IMAH_AING_UPLOAD_TIMEOUT_MS = 30000

export const IMAH_AING_UPLOAD_TIMEOUT_MESSAGE =
  'Upload terlalu lama (timeout). Silakan unggah ulang.'

// Pesan error slot upload. Timeout axios = `ECONNABORTED` (atau `ETIMEDOUT`).
export function mapUploadError(error) {
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
    return IMAH_AING_UPLOAD_TIMEOUT_MESSAGE
  }
  return error?.response?.data?.message || error?.message || 'upload_failed'
}
