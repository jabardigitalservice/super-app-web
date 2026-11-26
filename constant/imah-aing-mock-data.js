// Mode data contoh (#256): slicing Update Progress sebelum BE ada. Aktif di semua environment.
// Hapus file ini beserta bypass di `middleware/imah-aing-access.js` saat integrasi BE.

/** Selalu diturunkan dari query route, tidak disimpan. Array / nilai lain → false. */
export const isImahAingMock = (query) => query?.use_mock === 'true'

const IMAH_AING_MOCK_PATHS = Object.freeze(['/imah-aing', '/imah-aing/progress'])

/** Satu-satunya jalan lewat guard akses: riwayat & progress dalam mode data contoh. */
export const isImahAingMockBypass = (route) =>
  IMAH_AING_MOCK_PATHS.includes(String(route?.path || '').replace(/\/$/, '')) &&
  isImahAingMock(route.query)

const mockFile = (name) => ({
  name,
  type: 'image/png',
  size: 300 * 1024,
  url: '/icon/file-image.svg',
})

const mockPhotos = (stage) =>
  [1, 2, 3].map((n) => mockFile(`contoh-tahap-${stage}-foto-${n}.png`))

// `savedSteps` = jumlah tahap tersimpan berurutan, mulai dari Bukti Transfer
const mockItem = (no, scenario, statusId, savedSteps) => ({
  id: `IA-CONTOH-000${no}`,
  user_name: `Data Contoh ${no} (${scenario})`,
  created_at: '2026-11-26T00:00:00+07:00',
  latest_complaint_status: { id: statusId },
  progress: [0, 1, 2, 3].map((step) => {
    if (step >= savedSteps) return []
    return step === 0 ? [mockFile('contoh-bukti-transfer.png')] : mockPhotos(step)
  }),
})

export const IMAH_AING_MOCK_ITEMS = Object.freeze([
  mockItem(1, 'Kosong', 'provincial_aid_determination', 0),
  mockItem(2, 'Bukti Transfer saja', 'regency_aid_determination', 1),
  mockItem(3, 'Sampai Tahap 1', 'rutilahu_repair_process', 2),
  mockItem(4, 'Sampai Tahap 2', 'rutilahu_repair_process', 3),
  mockItem(5, 'Lengkap', 'rutilahu_repair_process', 4),
  mockItem(6, 'Tidak memenuhi', 'verified', 0),
])
