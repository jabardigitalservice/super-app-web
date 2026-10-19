import { UPLOAD_TIMEOUT_MESSAGE } from '~/constant/upload'

// Pesan error slot upload. Timeout axios = `ECONNABORTED` (atau `ETIMEDOUT`).
export function mapUploadError(error) {
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
    return UPLOAD_TIMEOUT_MESSAGE
  }
  return error?.response?.data?.message || error?.message || 'upload_failed'
}
