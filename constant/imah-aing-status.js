export const IMAH_AING_STATUS = {
  // verification
  unverified:                { id: 'unverified',                phase: 'verification',  name: 'Menunggu Verifikasi Data',        color: 'yellow',  hex: '#FF7500' },
  verified:                  { id: 'verified',                  phase: 'verification',  name: 'Lolos Verifikasi Data',           color: 'green',   hex: '#166534' },
  canceled:                  { id: 'canceled',                  phase: 'verification',  name: 'Dibatalkan',                      color: 'red',     hex: '#DD5E5E' },
  rejected_appeal:           { id: 'rejected_appeal',           phase: 'verification',  name: 'Ditolak (Sanggah)',               color: 'red',     hex: '#DD5E5E' },
  rejected_criteria:         { id: 'rejected_criteria',         phase: 'verification',  name: 'Ditolak',                         color: 'red',     hex: '#DD5E5E' },
  directed_to_hotline_jabar: { id: 'directed_to_hotline_jabar', phase: 'verification',  name: 'Dialihkan ke Hotline Jabar',      color: 'purple',  hex: '#691B9A' },

  // authorization (nominatif)
  central_nominative:        { id: 'central_nominative',        phase: 'authorization', name: 'Nominatif Pusat',                 color: 'yellow',  hex: '#FF7500' },
  provincial_nominative:     { id: 'provincial_nominative',     phase: 'authorization', name: 'Nominatif Provinsi',              color: 'yellow',  hex: '#FF7500' },
  regency_nominative:        { id: 'regency_nominative',        phase: 'authorization', name: 'Nominatif Kabupaten/Kota',        color: 'yellow',  hex: '#FF7500' },
  other_nominative:          { id: 'other_nominative',          phase: 'authorization', name: 'Nominatif Lainnya (CSR)',         color: 'yellow',  hex: '#FF7500' },

  // coordination (pengajuan bantuan)
  regency_aid_submission:    { id: 'regency_aid_submission',    phase: 'coordination',  name: 'Pengajuan Bantuan Kabupaten/Kota', color: 'light-blue', hex: '#1E88E5' },
  provincial_aid_submission: { id: 'provincial_aid_submission', phase: 'coordination',  name: 'Pengajuan Bantuan Provinsi',      color: 'light-blue', hex: '#1E88E5' },
  central_aid_submission:    { id: 'central_aid_submission',    phase: 'coordination',  name: 'Pengajuan Bantuan Pusat',         color: 'light-blue', hex: '#1E88E5' },
  other_aid_submission:      { id: 'other_aid_submission',      phase: 'coordination',  name: 'Pengajuan Bantuan Lainnya',       color: 'light-blue', hex: '#1E88E5' },

  // coordination (penetapan bantuan)
  regency_aid_determination:    { id: 'regency_aid_determination',    phase: 'coordination', name: 'Penetapan Bantuan Kabupaten/Kota', color: 'purple', hex: '#691B9A' },
  provincial_aid_determination: { id: 'provincial_aid_determination', phase: 'coordination', name: 'Penetapan Bantuan Provinsi',        color: 'purple', hex: '#691B9A' },
  central_aid_determination:    { id: 'central_aid_determination',    phase: 'coordination', name: 'Penetapan Bantuan Pusat',           color: 'purple', hex: '#691B9A' },
  other_aid_determination:      { id: 'other_aid_determination',      phase: 'coordination', name: 'Penetapan Bantuan Lainnya',         color: 'purple', hex: '#691B9A' },

  // coordination (akhir)
  rutilahu_repair_process: { id: 'rutilahu_repair_process', phase: 'coordination', name: 'Proses Perbaikan Rutilahu', color: 'light-blue', hex: '#1E88E5' },
  aid_received:            { id: 'aid_received',            phase: 'coordination', name: 'Telah Menerima Bantuan',    color: 'green',      hex: '#166534' },
}

/**
 * Fallback aman untuk status yang tidak dikenal.
 * @param {string} key - id status (mis. dari latest_complaint_status.id)
 * @param {string} [fallbackName] - nama tampilan dari BE saat key belum terdaftar di IMAH_AING_STATUS
 */
export const getImahAingStatus = (key, fallbackName) =>
  IMAH_AING_STATUS[key] || { id: key, name: fallbackName || key || '-', color: 'gray', hex: '#94A3B8' }

/**
 * 7 tahapan proses ImahAing untuk horizontal step flow di History (PreviewModal).
 * Step 1–5 port dari step flow CMS; step 6–7 tambahan (belum ada di CMS).
 * `statuses` = daftar `complaint_status_id` yang memetakan ke step tsb.
 */
export const IMAH_AING_STEP_FLOW = Object.freeze([
  { id: 'waiting_verification',   label: 'Menunggu Verifikasi Data',            statuses: ['unverified'] },
  { id: 'verification_process',   label: 'Proses Verifikasi dan Validasi Data', statuses: ['verified'] },
  { id: 'nominative',             label: 'Penentuan Nominatif',                 statuses: ['central_nominative', 'provincial_nominative', 'regency_nominative', 'other_nominative'] },
  { id: 'aid_submission',         label: 'Pengajuan Calon Penerima Bantuan',    statuses: ['regency_aid_submission', 'provincial_aid_submission', 'central_aid_submission', 'other_aid_submission'] },
  { id: 'aid_determination',      label: 'Penetapan Penerima Bantuan',          statuses: ['regency_aid_determination', 'provincial_aid_determination', 'central_aid_determination', 'other_aid_determination'] },
  { id: 'rutilahu_repair',        label: 'Proses Perbaikan Rutilahu',           statuses: ['rutilahu_repair_process'] },
  { id: 'aid_received',           label: 'Telah Menerima Bantuan',              statuses: ['aid_received'] },
])

/** Status yang bukan bagian jalur normal 7 step — step flow disembunyikan */
export const IMAH_AING_STEP_FLOW_HIDDEN_STATUSES = Object.freeze([
  'rejected_appeal',
  'rejected_criteria',
  'canceled',
  'directed_to_hotline_jabar',
])

/**
 * Hitung data step flow dari sebuah status key.
 * @param {string} statusKey - complaint_status_id / phase / status dari record
 * @returns {{ hidden: true } | { hidden: false, items: Array<{ id: string, label: string, status: 'completed' | 'active' | 'pending' }> }}
 *
 * - Status di IMAH_AING_STEP_FLOW_HIDDEN_STATUSES atau tidak dikenal → `{ hidden: true }`
 * - Selain itu: index sebelum step yang match = `completed`, step yang match = `active`,
 *   sisanya = `pending`. Kecuali `aid_received` (step terakhir) → semua step `completed`.
 */
export const getImahAingStepFlow = (statusKey) => {
  if (!statusKey || IMAH_AING_STEP_FLOW_HIDDEN_STATUSES.includes(statusKey)) {
    return { hidden: true }
  }

  const matchIndex = IMAH_AING_STEP_FLOW.findIndex((step) =>
    step.statuses.includes(statusKey)
  )

  if (matchIndex === -1) {
    return { hidden: true }
  }

  const isFinished = matchIndex === IMAH_AING_STEP_FLOW.length - 1

  const items = IMAH_AING_STEP_FLOW.map((step, index) => {
    let status = 'pending'
    if (isFinished || index < matchIndex) {
      status = 'completed'
    } else if (index === matchIndex) {
      status = 'active'
    }
    return { id: step.id, label: step.label, status }
  })

  return { hidden: false, items }
}
