// Batas tunggu request upload file (`/file/upload`). Lewat batas ini request dibatalkan axios
// dan slot jadi ERROR supaya user bisa hapus / retry (tanpa timeout, slot nyangkut di UPLOADING).
export const UPLOAD_TIMEOUT_MS = 5 * 60 * 1000

export const UPLOAD_TIMEOUT_MESSAGE =
  'Upload terlalu lama (timeout). Silakan unggah ulang.'
