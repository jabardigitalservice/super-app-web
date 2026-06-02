export const IMAH_AING_STATUS = {
  unverified:                { id: 'unverified',                name: 'Menunggu Verifikasi',       color: 'yellow',     hex: '#FF7500' },
  verified:                  { id: 'verified',                  name: 'Terverifikasi',             color: 'green',      hex: '#166534' },
  failed:                    { id: 'failed',                    name: 'Gagal Diverifikasi',        color: 'red',        hex: '#DD5E5E' },
  directed_to_hotline_jabar: { id: 'directed_to_hotline_jabar', name: 'Dialihkan ke Hotline Jabar', color: 'purple',    hex: '#691B9A' },
  not_yet_instructed:        { id: 'not_yet_instructed',        name: 'Belum Diinstruksikan',      color: 'yellow',     hex: '#FF7500' },
  not_yet_coordinated:       { id: 'not_yet_coordinated',       name: 'Belum Dikoordinasikan',     color: 'light-blue', hex: '#1E88E5' },
  coordinated:               { id: 'coordinated',               name: 'Dikoordinasikan',           color: 'green',      hex: '#166534' },
  diverted_to_span:          { id: 'diverted_to_span',          name: 'Dialihkan ke SP4N Lapor',   color: 'green',      hex: '#166534' },
  rejected:                  { id: 'rejected',                  name: 'Ditolak',                   color: 'red',        hex: '#DD5E5E' },
  followup:                  { id: 'followup',                  name: 'Ditindaklanjuti',           color: 'light-blue', hex: '#1E88E5' },
  postponed:                 { id: 'postponed',                 name: 'Pengerjaan Ditunda',        color: 'purple',     hex: '#691B9A' },
  review:                    { id: 'review',                    name: 'Ditinjau Ulang',            color: 'dark-blue',  hex: '#64748B' },
  finished:                  { id: 'finished',                  name: 'Selesai',                   color: 'green',      hex: '#166534' }
}

/** Fallback aman untuk status yang tidak dikenal */
export const getImahAingStatus = (key) =>
  IMAH_AING_STATUS[key] || { id: key, name: key || '-', color: 'gray', hex: '#94A3B8' }
