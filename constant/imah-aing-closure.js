// Flag Unleash akses form pembuatan usulan baru Imah Aing.
// Semantik "FORM": ON = form bisa diakses. OFF / flag tidak ada / Unleash down = ditutup
// (fail-closed) dan diarahkan ke landing penutupan. Flag WAJIB sudah ada & ON di env
// target sebelum deploy, kalau tidak form langsung tertutup.
export const IMAH_AING_FORM_FLAG = 'SAPAWARGA-IMAHAING__FORM'

export const IMAH_AING_CLOSED_PATH = '/imah-aing/closed'

// Batas tunggu SDK Unleash siap. Lewat batas ini dianggap tertutup (fail-closed).
export const IMAH_AING_CLOSURE_READY_TIMEOUT_MS = 3000

// Batas tunggu refresh toggle tepat sebelum submit usulan baru. Lewat batas ini dianggap
// tidak terverifikasi (fail-closed).
export const IMAH_AING_SUBMIT_REFRESH_TIMEOUT_MS = 3000

// Aset landing penutupan, urut sesuai tampilan (export Canva). `alt` meringkas isi pesan
// di gambar; `width`/`height` diisi supaya tidak ada layout shift.
export const IMAH_AING_CLOSED_IMAGES = [
  {
    src: '/images/imah-aing/closed/penutupan-batch-1-v2-01.webp',
    alt: 'Wargi, catat tanggalnya! Usulan Imah Aing telah ditutup untuk masuk tahap verifikasi dan validasi selanjutnya, terhitung tanggal 1 Oktober 2026. Pengusulan akan dibuka kembali 1 November 2026',
    width: 1080,
    height: 1738,
  },
  {
    src: '/images/imah-aing/closed/penutupan-batch-1-v2-02.webp',
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

// Paksa fetch toggle terbaru, dibatasi timeout. Resolve `{ failed }`, tidak pernah reject.
// SDK menelan error fetch (hanya emit event `error`) dan tidak punya timeout sendiri, jadi
// kegagalan dideteksi lewat listener `error` + timeout.
function refreshToggles(unleash, timeoutMs) {
  return new Promise((resolve) => {
    let failed = false
    let timer = null
    const onError = () => {
      failed = true
    }
    const done = (timedOut) => {
      clearTimeout(timer)
      unleash.off('error', onError)
      resolve({ failed: failed || timedOut })
    }
    unleash.on('error', onError)
    timer = setTimeout(() => done(true), timeoutMs)
    Promise.resolve()
      .then(() => unleash.updateToggles())
      .catch(() => {
        failed = true
      })
      .then(() => done(false))
  })
}

/**
 * Cek flag tepat sebelum submit usulan baru. Beda dari `isImahAingFormOpen` (baca cache),
 * ini paksa refresh dulu supaya toggle OFF yang baru terjadi langsung terdeteksi.
 *
 * - `'closed'`     flag OFF / tidak ada (menang atas refresh gagal: cache OFF tetap OFF).
 * - `'unverified'` tidak bisa memastikan: client tidak ada, SDK belum ready, `isEnabled`
 *                  error, atau flag ON di cache tapi refresh gagal / timeout (fail-closed).
 * - `'open'`       flag ON dan refresh sukses.
 */
export async function checkImahAingFormForSubmit(
  unleash,
  timeoutMs = IMAH_AING_SUBMIT_REFRESH_TIMEOUT_MS
) {
  if (!unleash) return 'unverified'

  try {
    if (!(await waitUnleashReady(unleash, timeoutMs))) return 'unverified'

    const { failed } = await refreshToggles(unleash, timeoutMs)
    if (unleash.isEnabled(IMAH_AING_FORM_FLAG) !== true) return 'closed'
    return failed ? 'unverified' : 'open'
  } catch (error) {
    return 'unverified'
  }
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
