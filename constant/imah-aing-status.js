export const IMAH_AING_STATUS = {
  // verification
  unverified:                { id: 'unverified',                phase: 'verification',  name: 'Menunggu Verifikasi',             color: 'yellow',  hex: '#FF7500' },
  verified:                  { id: 'verified',                  phase: 'verification',  name: 'Terverifikasi',                   color: 'green',   hex: '#166534' },
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

/** Fallback aman untuk status yang tidak dikenal */
export const getImahAingStatus = (key) =>
  IMAH_AING_STATUS[key] || { id: key, name: key || '-', color: 'gray', hex: '#94A3B8' }
