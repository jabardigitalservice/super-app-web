/**
 * Static mock data for Imah Aing Riwayat Ajuan.
 * Used for development/demo via the `use_mock=true` query param.
 * Allows development/testing with 2 sample entries.
 */
export const imahAingMockData = [
  {
    id: 'mock-001',
    user_nik: '3204110101010001',
    user_name: 'Budi Santoso',
    phase: 'unverified',
    status: 'unverified',
    created_at: '2026-05-20T09:30:00.000Z',
    description:
      'Mengusulkan pembangunan rumah layak huni di lokasi tanah milik sendiri seluas 60m². Saat ini rumah dalam kondisi tidak layak huni dengan dinding bambu dan lantai tanah.',
    address: 'RT 03 RW 05, Dusun Sukamaju, Desa Sukakerta, Kecamatan Cilimus, Kabupaten Kuningan, Jawa Barat 45556',
    photos: [
      {
        url: 'https://placehold.co/200x200/e2e8f0/64748b?text=Rumah+1',
      },
      {
        url: 'https://placehold.co/200x200/e2e8f0/64748b?text=Rumah+2',
      },
    ],
  },
  {
    id: 'mock-002',
    user_nik: '3204110101010002',
    user_name: 'Ani Rahayu',
    phase: 'verified',
    status: 'verified',
    created_at: '2026-05-18T14:15:00.000Z',
    description:
      'Mengajukan usulan renovasi rumah tidak layak huni. Kondisi atap bocor parah dan kusen pintu/jendela sudah rusak dimakan rayap.',
    address: 'RT 01 RW 02, Dusun Cikembang, Desa Ciwaringin, Kecamatan Ciwaringin, Kabupaten Kuningan, Jawa Barat 45554',
    photos: [
      {
        url: 'https://placehold.co/200x200/e2e8f0/64748b?text=Renovasi+1',
      },
    ],
  },
]

export default imahAingMockData
