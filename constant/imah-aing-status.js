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
  regency_aid_submission:    { id: 'regency_aid_submission',    phase: 'coordination',  name: 'Pengajuan Nominatif Kota/Kabupaten', color: 'light-blue', hex: '#1E88E5' },
  provincial_aid_submission: { id: 'provincial_aid_submission', phase: 'coordination',  name: 'Pengajuan Nominatif Provinsi',      color: 'light-blue', hex: '#1E88E5' },
  central_aid_submission:    { id: 'central_aid_submission',    phase: 'coordination',  name: 'Pengajuan Nominatif Pusat',         color: 'light-blue', hex: '#1E88E5' },
  other_aid_submission:      { id: 'other_aid_submission',      phase: 'coordination',  name: 'Pengajuan Nominatif Lainnya',       color: 'light-blue', hex: '#1E88E5' },

  // coordination (penetapan bantuan)
  regency_aid_determination:    { id: 'regency_aid_determination',    phase: 'coordination', name: 'Penetapan Bantuan Kabupaten/Kota', color: 'purple', hex: '#691B9A' },
  provincial_aid_determination: { id: 'provincial_aid_determination', phase: 'coordination', name: 'Penetapan Bantuan Provinsi',        color: 'purple', hex: '#691B9A' },
  central_aid_determination:    { id: 'central_aid_determination',    phase: 'coordination', name: 'Penetapan Bantuan Pusat',           color: 'purple', hex: '#691B9A' },
  other_aid_determination:      { id: 'other_aid_determination',      phase: 'coordination', name: 'Penetapan Bantuan Lainnya',         color: 'purple', hex: '#691B9A' },

  // coordination (akhir)
  rutilahu_repair_process: { id: 'rutilahu_repair_process', phase: 'coordination', name: 'Proses Perbaikan Rutilahu', color: 'light-blue', hex: '#1E88E5' },
  aid_received:            { id: 'aid_received',            phase: 'coordination', name: 'Telah Menerima Bantuan',    color: 'green',      hex: '#166534' },
}

/** Status yang boleh memicu tombol Ajukan Sanggah di Riwayat */
export const SANGGAH_ELIGIBLE_STATUSES = Object.freeze(['rejected_criteria'])

export const canSanggahStatus = (statusKey) =>
  SANGGAH_ELIGIBLE_STATUSES.includes(statusKey)

/** Status key dari satu item response list; tidak membaca response detail. */
export const getImahAingStatusKey = (item = {}) =>
  item.latest_complaint_status?.id
  || item.complaint_status?.id
  || item.complaint_status_id
  || item.phase
  || item.status
  || ''

/**
 * ID Usulan tampilan — resolve dari field yang tersedia di response.
 * @param {object} item - record dari list (fetchHistory) atau detail (fetchDetail)
 */
export const getImahAingDisplayId = (item = {}) =>
  item.complaint_id || item.id || `IA-${item.user_nik || item.nik || '-'}`

/**
 * Fallback aman untuk status yang tidak dikenal.
 * @param {string} key - id status (mis. dari latest_complaint_status.id)
 * @param {string} [fallbackName] - nama tampilan dari BE saat key belum terdaftar di IMAH_AING_STATUS
 */
export const getImahAingStatus = (key, fallbackName) =>
  IMAH_AING_STATUS[key] || { id: key, name: fallbackName || key || '-', color: 'gray', hex: '#94A3B8' }

/**
 * 9 tahapan proses ImahAing untuk horizontal step flow di History (PreviewModal).
 * Tahap Verval Lapangan dan Penyerahan Bantuan belum punya status backend,
 * sehingga keduanya tetap tampil sebagai tahap visual sampai mapping tersedia.
 * `statuses` = daftar `complaint_status_id` yang memetakan ke step tsb.
 */
export const IMAH_AING_STEP_FLOW = Object.freeze([
  { id: 'waiting_verification',   label: 'Menunggu Verifikasi Data',                 statuses: ['unverified'] },
  { id: 'verification_process',   label: 'Proses Verifikasi dan Validasi Data', statuses: ['verified'] },
  { id: 'nominative',             label: 'Penentuan Nominatif',                 statuses: ['central_nominative', 'provincial_nominative', 'regency_nominative', 'other_nominative'] },
  { id: 'aid_submission',         label: 'Pengajuan Calon Penerima Bantuan',    statuses: ['regency_aid_submission', 'provincial_aid_submission', 'central_aid_submission', 'other_aid_submission'] },
  { id: 'field_verification',     label: 'Verval Lapangan',                     statuses: [] },
  { id: 'aid_determination',      label: 'Penetapan Penerima Bantuan',          statuses: ['regency_aid_determination', 'provincial_aid_determination', 'central_aid_determination', 'other_aid_determination'] },
  { id: 'aid_handover',           label: 'Penyerahan Bantuan',                  statuses: [] },
  { id: 'rutilahu_repair',        label: 'Pelaksanaan Perbaikan',               statuses: ['rutilahu_repair_process'] },
  { id: 'aid_received',           label: 'Selesai',                             statuses: ['aid_received'] },
])

/** Status yang bukan bagian jalur normal 9 step — step flow disembunyikan */
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

// Role aparat (SWA). camat & posyandu sengaja belum diizinkan.
export const IMAH_AING_APARAT_ROLES = Object.freeze(['rt', 'rw', 'kades', 'lurah', 'kadus'])

// source_id menentukan prefix ID usulan di BE: hotline → HL, warga → SWW, aparat → SWA.
// Mobile hardcode source_id=sapawarga, jadi role di meta (terenkripsi) jadi sumber kebenaran,
// bukan query. Query hanya boleh: kosong, sapawarga, sapawarga_warga, atau hotline (tanpa role).
// Return '' bila tidak sah.
export function resolveImahAingSourceId(sourceId, role) {
  const sid = String(sourceId ?? '').trim().toLowerCase()
  const r = String(role ?? '').trim().toLowerCase()
  // Hotline selalu kirim source_id=hotline dan meta tanpa role; role kosong selain itu = bug pengirim.
  if (!r) return sid === 'hotline' ? 'hotline' : ''
  if (sid && !['sapawarga', 'sapawarga_warga'].includes(sid)) return ''
  const fromRole = r === 'warga' ? 'sapawarga_warga' : IMAH_AING_APARAT_ROLES.includes(r) ? 'sapawarga' : ''
  if (fromRole && sid && sid !== fromRole) console.warn('[imah-aing] source_id query beda dari role, pakai role', { sid, r, fromRole }) // eslint-disable-line no-console
  return fromRole
}

// ---- Update Progress (#256): Bukti Transfer + Tahap 1–3 ----
// Status pemicu, aturan file, dan minimal foto = default sementara, belum dikonfirmasi PO.

export const PROGRESS_ELIGIBLE_STATUSES = Object.freeze([
  'regency_aid_determination',
  'provincial_aid_determination',
  'central_aid_determination',
  'other_aid_determination',
  'rutilahu_repair_process',
])

export const canUpdateProgressStatus = (statusKey) =>
  PROGRESS_ELIGIBLE_STATUSES.includes(statusKey)

export const PROGRESS_FILE_MAX_SIZE = 5 * 1024 * 1024 // 5 MB

const PROGRESS_TRANSFER_RULE = {
  min: 1,
  max: 1,
  accept: 'image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf',
  mime: ['image/jpeg', 'image/png', 'application/pdf'],
  ext: /\.(jpe?g|png|pdf)$/i,
  formatLabel: 'JPG, PNG, atau PDF',
}

const PROGRESS_PHOTO_RULE = {
  min: 3,
  max: Infinity,
  accept: 'image/jpeg,image/png,.jpg,.jpeg,.png',
  mime: ['image/jpeg', 'image/png'],
  ext: /\.(jpe?g|png)$/i,
  formatLabel: 'JPG atau PNG',
}

/** Urutan array = urutan upload dan urutan tab. */
export const IMAH_AING_PROGRESS_STEPS = Object.freeze([
  { ...PROGRESS_TRANSFER_RULE, label: 'Bukti Transfer', percent: '' },
  { ...PROGRESS_PHOTO_RULE, label: 'Tahap 1', percent: '0%' },
  { ...PROGRESS_PHOTO_RULE, label: 'Tahap 2', percent: '50%' },
  { ...PROGRESS_PHOTO_RULE, label: 'Tahap 3', percent: '100%' },
])

/** Jumlah file memenuhi aturan tahap `step`. */
export const isProgressStepFilled = (files, step) => {
  const rule = IMAH_AING_PROGRESS_STEPS[step]
  const count = files?.length || 0
  return !!rule && count >= rule.min && count <= rule.max
}

/**
 * Tahap terbuka hanya bila semua tahap sebelumnya sudah tersimpan.
 * @param {Array<Array>} saved - data TERSIMPAN per tahap, bukan draft
 */
export const isProgressStepUnlocked = (saved, step) =>
  !!IMAH_AING_PROGRESS_STEPS[step] &&
  IMAH_AING_PROGRESS_STEPS.slice(0, step).every((_, i) => isProgressStepFilled(saved?.[i], i))

/** Tahap pertama yang belum tersimpan; semua tersimpan → tahap terakhir. */
export const getFirstOpenProgressStep = (saved) => {
  const index = IMAH_AING_PROGRESS_STEPS.findIndex((_, i) => !isProgressStepFilled(saved?.[i], i))
  return index === -1 ? IMAH_AING_PROGRESS_STEPS.length - 1 : index
}

/** Pesan error tipe/ukuran file untuk tahap `step`; '' bila lolos. */
export const getProgressFileError = (file, step) => {
  const rule = IMAH_AING_PROGRESS_STEPS[step]
  const type = (file.type || '').toLowerCase()
  const allowed = type ? rule.mime.includes(type) : rule.ext.test(file.name || '')
  if (!allowed) {
    return `${file.name}: tipe file tidak didukung. Gunakan ${rule.formatLabel}.`
  }
  if (file.size > PROGRESS_FILE_MAX_SIZE) {
    return `${file.name}: ukuran file melebihi batas 5 MB.`
  }
  return ''
}
