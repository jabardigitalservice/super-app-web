// Flag Unleash penutupan pembuatan usulan baru Imah Aing.
// Semantik "CLOSED": ON = ditutup. OFF / flag tidak ada / Unleash down = terbuka (fail-open).
// Jangan dibalik — flag yang belum di-setup di sebuah env tidak boleh mematikan form.
export const IMAH_AING_CLOSURE_FLAG = 'SAPAWARGA-WEB__IMAH-AING--CREATE-CLOSED'

export const IMAH_AING_CLOSED_PATH = '/imah-aing/closed'

// Batas tunggu SDK Unleash siap. Lewat batas ini dianggap terbuka (fail-open).
export const IMAH_AING_CLOSURE_READY_TIMEOUT_MS = 3000

// Aset landing penutupan, urut sesuai tampilan. Sesuaikan dengan hasil export Canva:
// jumlah, ekstensi, dan `alt` (ringkas isi pesan di gambar). `width`/`height` opsional
// (isi kalau ukuran aset diketahui, supaya tidak ada layout shift).
export const IMAH_AING_CLOSED_IMAGES = [
  {
    src: '/images/imah-aing/closed/penutupan-batch-1-01.webp',
    alt: 'Informasi penutupan pembuatan usulan Bedah Rumah Batch 1',
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
 * Apakah pembuatan usulan baru Imah Aing sedang ditutup.
 *
 * Fail-open di semua jalur gagal (client tidak ada, belum ready sampai timeout,
 * `isEnabled` melempar error): hasilnya `false` supaya form tetap bisa diakses.
 */
export async function isImahAingCreationClosed(
  unleash,
  timeoutMs = IMAH_AING_CLOSURE_READY_TIMEOUT_MS
) {
  if (!unleash) return false

  try {
    const ready = await waitUnleashReady(unleash, timeoutMs)
    if (!ready) return false
    return unleash.isEnabled(IMAH_AING_CLOSURE_FLAG) === true
  } catch (error) {
    return false
  }
}
