// Flag Unleash akses form pembuatan usulan baru Imah Aing.
// Semantik "FORM": ON = form bisa diakses. OFF / flag tidak ada / Unleash down = ditutup
// (fail-closed) dan diarahkan ke landing penutupan. Flag WAJIB sudah ada & ON di env
// target sebelum deploy, kalau tidak form langsung tertutup.
export const IMAH_AING_FORM_FLAG = 'SAPAWARGA-IMAHAING__FORM'

export const IMAH_AING_CLOSED_PATH = '/imah-aing/closed'

// Batas tunggu SDK Unleash siap. Lewat batas ini dianggap tertutup (fail-closed).
export const IMAH_AING_CLOSURE_READY_TIMEOUT_MS = 3000

// Aset landing penutupan, urut sesuai tampilan (export Canva). `alt` meringkas isi pesan
// di gambar; `width`/`height` diisi supaya tidak ada layout shift.
export const IMAH_AING_CLOSED_IMAGES = [
  {
    src: '/images/imah-aing/closed/penutupan-batch-1-01.webp',
    alt: 'Pengusulan Imah Aing ditutup pada 1 Oktober 2026 pukul 00.00 WIB untuk masuk tahap verifikasi dan validasi, dan dibuka kembali 1 November 2026',
    width: 1080,
    height: 1350,
  },
  {
    src: '/images/imah-aing/closed/penutupan-batch-1-02.webp',
    alt: 'Sekitar 12 ribu usulan masuk sedang diproses: pengajuan, verifikasi validasi, lalu penentuan nominatif',
    width: 1080,
    height: 1350,
  },
  {
    src: '/images/imah-aing/closed/penutupan-batch-1-03.webp',
    alt: 'Terima kasih warga atas penggunaan Sapawarga dan Hotline Jabar. Pertanyaan lebih lanjut hubungi Hotline Jabar 0821-2603-0038',
    width: 1080,
    height: 1350,
  },
]

// Resolve true kalau SDK sudah ready, false kalau timeout. Tidak pernah reject.
function waitUnleashReady(unleash, timeoutMs) {
  return new Promise((resolve) => {
    if (typeof unleash.isReady === 'function' && unleash.isReady()) {
      resolve(true)
      return
    }

    let timer = null
    const onReady = () => {
      clearTimeout(timer)
      resolve(true)
    }
    timer = setTimeout(() => {
      unleash.off('ready', onReady)
      resolve(false)
    }, timeoutMs)
    unleash.once('ready', onReady)
  })
}

/**
 * Apakah form pembuatan usulan baru Imah Aing boleh diakses.
 *
 * Fail-closed di semua jalur gagal (client tidak ada, belum ready sampai timeout,
 * `isEnabled` melempar error, flag tidak ada): hasilnya `false` sehingga warga
 * diarahkan ke landing penutupan. Hanya flag ON yang membuka form.
 */
export async function isImahAingFormOpen(
  unleash,
  timeoutMs = IMAH_AING_CLOSURE_READY_TIMEOUT_MS
) {
  if (!unleash) return false

  try {
    const ready = await waitUnleashReady(unleash, timeoutMs)
    if (!ready) return false
    return unleash.isEnabled(IMAH_AING_FORM_FLAG) === true
  } catch (error) {
    return false
  }
}
