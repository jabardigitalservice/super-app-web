export const dataStatusMilestone = Object.freeze({
  menungguVerifikasi: {
    status: 'Menunggu Verifikasi',
    textStatus: 'Menunggu Verifikasi',
    icon: 'waiting.svg',
    fillColor: '#FF7500',
    getNameStatus: 'admin_monitoring_status_aduan',
  },
  ditolak: {
    status: 'Ditolak',
    textStatus: 'Ditolak',
    icon: 'rejected.svg',
    fillColor: '#F44336',
    getNameStatus: 'admin_monitoring_status_aduan',
  },
  terverifikasi: {
    status: 'Terverifikasi',
    textStatus: 'Terverifikasi',
    icon: 'verfication.svg',
    fillColor: '#FF7500',
    getNameStatus: 'admin_monitoring_status_aduan',
  },
  dikoordinasikan: {
    status: 'Dikoordinasikan',
    textStatus: 'Dikoordinasikan',
    icon: 'cordination.svg',
    fillColor: '#1E88E5',
    getNameStatus: 'admin_monitoring_status_aduan',
  },
  ditindakLanjuti: {
    status: 'Ditindaklanjuti',
    textStatus: 'Ditindaklanjuti',
    icon: 'follow-up.svg',
    fillColor: '#FF7500',
    getNameStatus: 'nama_instansi_penanggung_jawab',
  },
  selesai: {
    status: 'Selesai',
    textStatus: 'Selesai Dikerjakan',
    icon: 'done.svg',
    fillColor: '#1E88E5',
    getNameStatus: 'nama_instansi_penanggung_jawab',
  },
  ditutup: {
    status: 'Ditutup',
    textStatus: 'Ditutup',
    icon: 'closed.svg',
    fillColor: '#16A75C',
    getNameStatus: 'admin_monitoring_status_aduan',
  },
  dialihkan: {
    status: 'Dialihkan ke SP4N Lapor',
    textStatus: 'Dialihkan ke SP4N Lapor',
    icon: 'cordination.svg',
    fillColor: '#1E88E5',
    getNameStatus: 'admin_monitoring_status_aduan',
  },
  gagalDiverifikasi: {
    status: 'Gagal Diverifikasi',
    textStatus: 'Gagal Diverifikasi',
    icon: 'failed-verification.svg',
    fillColor: '#F44336',
    getNameStatus: 'admin_monitoring_status_aduan',
  },
  pengerjaanDitunda: {
    status: 'Pengerjaan Ditunda',
    textStatus: 'Pengerjaan Ditunda',
    icon: 'delayed.svg',
    fillColor: '#AB47BC',
    getNameStatus: 'nama_instansi_penanggung_jawab',
  },
  pengerjaanDitinjauUlang: {
    status: 'Pengerjaan Ditinjau Ulang',
    textStatus: 'Pengerjaan Ditinjau Ulang',
    icon: 'review.svg',
    fillColor: '#FF7500',
    getNameStatus: 'nama_instansi_penanggung_jawab',
  },
})

export const newDataStatusMilestone = Object.freeze({
  verified: {
    id: 'verified',
    textStatus: 'Terverifikasi',
    icon: 'verfication.svg',
    fillColor: '#FF7500',
    phase: 'authorization',
    // TODO: CONFIRMATION THIS VALUE FOR WHAT IN STATUS
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  failed: {
    id: 'failed',
    textStatus: 'Gagal Diverifikasi',
    icon: 'failed-verification.svg',
    fillColor: '#F44336',
    phase: 'verification',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  diverted_to_span: {
    id: 'diverted_to_span',
    textStatus: 'Dialihkan ke SP4N Lapor',
    icon: 'cordination.svg',
    fillColor: '#1E88E5',
    phase: 'authorization',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  rejected: {
    id: 'rejected',
    textStatus: 'Ditolak',
    icon: 'rejected.svg',
    fillColor: '#F44336',
    phase: 'authorization',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  followup: {
    id: 'followup',
    textStatus: 'Ditindaklanjuti',
    icon: 'follow-up.svg',
    fillColor: '#FF7500',
    phase: 'coordination',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  postponed: {
    id: 'postponed',
    textStatus: 'Pengerjaan Ditunda',
    icon: 'delayed.svg',
    fillColor: '#AB47BC',
    phase: 'coordination',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  review: {
    id: 'review',
    textStatus: 'Pengerjaan Ditinjau Ulang',
    icon: 'review.svg',
    fillColor: '#FF7500',
    phase: 'coordination',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  finished: {
    id: 'finished',
    textStatus: 'Selesai Dikerjakan',
    icon: 'done.svg',
    fillColor: '#1E88E5',
    phase: 'coordination',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  coordinated: {
    id: 'coordinated',
    textStatus: 'Dikoordinasikan',
    icon: 'cordination.svg',
    fillColor: '#1E88E5',
    phase: 'coordination',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  unverified: {
    id: 'unverified',
    textStatus: 'Menunggu Verifikasi',
    icon: 'waiting.svg',
    fillColor: '#FF7500',
    phase: 'verification',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
  directed_to_hotline_jabar: {
    id: 'directed_to_hotline_jabar',
    textStatus: 'Dialihkan ke Hotline Jabar',
    phase: 'verification',
    icon: 'headset.svg',
    fillColor: '#1E88E5',
    non_prov_alias: '',
    is_prov_responsibility: '',
    order: '',
  },
})
