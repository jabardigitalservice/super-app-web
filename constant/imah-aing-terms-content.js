/**
 * Konten "Syarat dan Ketentuan Penggunaan Aplikasi Imah Aing" yang ditampilkan
 * di StepOne form pengajuan (scrollable box sebelum checkbox pernyataan).
 *
 * Struktur data (bukan HTML string) supaya rendering di komponen konsisten
 * dengan styling Tailwind + dark mode tanpa perlu v-html.
 */

export const IMAH_AING_TERMS_TITLE = 'Syarat dan Ketentuan Penggunaan Aplikasi Imah Aing'

export const IMAH_AING_TERMS_INTRO = [
  'Syarat dan Ketentuan ini mengatur penggunaan Aplikasi Imah Aing oleh Warga Jawa Barat untuk mengakses layanan, informasi, dan fasilitas pelayanan publik berbasis digital yang disediakan oleh Pemerintah Daerah Provinsi Jawa Barat.',
  'Dengan mengunduh, mendaftar, dan/atau menggunakan Aplikasi Imah Aing, Pengguna menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan di bawah ini.',
]

export const IMAH_AING_TERMS_SECTIONS = [
  {
    title: '1. Tujuan Penggunaan Aplikasi dan Data',
    items: [
      'Aplikasi Imah Aing disediakan untuk mempermudah warga dalam mengakses pelayanan publik, menyampaikan aspirasi, serta memperoleh informasi resmi secara transparan dan akuntabel.',
      'Pengguna menyetujui bahwa data pribadi yang dimasukkan ke dalam aplikasi dapat digunakan oleh instansi pemerintah terkait untuk verifikasi identitas, pemrosesan pelayanan publik, serta perencanaan pembangunan daerah sesuai dengan peraturan perundang-undangan.',
      'Pengguna dilarang menggunakan aplikasi ini untuk tindakan yang melanggar hukum, penipuan, pemalsuan data, atau tindakan penyalahgunaan lainnya.',
    ],
  },
  {
    title: '2. Perlindungan dan Kerahasiaan Data Pribadi',
    items: [
      'Pengelola aplikasi berkomitmen untuk melindungi Data Pribadi Pengguna sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi.',
      'Pengguna wajib menjaga kerahasiaan informasi akun miliknya serta menghormati hak privasi dan data pribadi warga lain yang mungkin ditemukan atau diakses melalui fitur interaktif aplikasi.',
      'Pengguna dilarang mengambil, menyimpan, menyalin, atau memindahkan data pribadi pengguna lain tanpa izin resmi.',
    ],
  },
  {
    title: '3. Larangan Penyebaran Informasi dan Penyalahgunaan',
    lead: 'Pengguna dilarang untuk:',
    items: [
      'Mengunggah atau menyebarkan konten/informasi yang mengandung unsur SARA, ujaran kebencian, pornografi, hoaks, atau pencemaran nama baik.',
      'Menyebarluaskan data pribadi milik warga lain yang diperoleh dari aplikasi ke media sosial, aplikasi pesan, atau platform publik lainnya.',
      'Memberikan akses akun pribadi kepada pihak lain.',
    ],
  },
  {
    title: '4. Hak Akses dan Penggunaan Fitur',
    items: [
      'Setiap pengguna berhak mengakses fitur-fitur layanan sesuai dengan status verifikasi akun yang dimiliki.',
      'Pengguna dilarang melakukan peretasan, pengubahan data tanpa hak, manipulasi sistem, atau tindakan lain yang dapat mengganggu integritas dan kinerja Aplikasi Imah Aing.',
      'Seluruh aktivitas pengguna dalam aplikasi dapat direkam dan dimonitor oleh pengelola sistem demi pemeliharaan keamanan dan audit sistem.',
    ],
  },
  {
    title: '5. Tanggung Jawab Akun Pengguna',
    items: [
      'Pengguna bertanggung jawab penuh atas keamanan kredensial akun, termasuk username, password, dan kode OTP.',
      'Segala bentuk aktivitas, transaksi, atau pengajuan layanan yang dilakukan melalui akun Pengguna dianggap dilakukan sah oleh pemilik akun bersangkutan.',
    ],
  },
  {
    title: '6. Pelaporan Kebocoran Data atau Masalah Keamanan',
    items: [
      'Apabila Pengguna menemukan atau mencurigai adanya indikasi kebocoran data pribadi, gangguan sistem, atau penyalahgunaan akun, Pengguna wajib segera melaporkannya kepada layanan bantuan pengelola aplikasi.',
      'Pelaporan diharapkan dilakukan secepatnya (paling lambat 1 x 24 jam) setelah kejadian diketahui.',
    ],
  },
  {
    title: '7. Audit dan Pemantauan Sistem',
    items: [
      'Pengelola aplikasi berhak melakukan pemantauan dan evaluasi terhadap penggunaan aplikasi untuk memastikan seluruh ketentuan dipatuhi oleh Pengguna.',
      'Catatan aktivitas (log activity) Pengguna dapat digunakan sebagai bukti jika terjadi dugaan pelanggaran hukum atau penyalahgunaan aplikasi.',
    ],
  },
  {
    title: '8. Konsekuensi Pelanggaran',
    items: [
      'Pelanggaran terhadap Syarat dan Ketentuan ini dapat berakibat pada pembekuan sementara atau penutupan permanen akun Pengguna.',
      'Tindakan penyalahgunaan data pribadi atau kejahatan siber dapat dikenakan sanksi pidana dan/atau perdata sesuai dengan UU Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi, UU ITE, dan ketentuan hukum lain yang berlaku.',
    ],
  },
  {
    title: '9. Pembatasan Tanggung Jawab',
    items: [
      'Pengelola aplikasi tidak bertanggung jawab atas kerugian yang timbul akibat kelalaian Pengguna dalam menjaga kerahasiaan akun pribadi.',
      'Pengguna bertanggung jawab penuh atas kebenaran dan keabsahan data/dokumen yang diunggah dalam aplikasi.',
    ],
  },
  {
    title: '10. Perubahan Ketentuan',
    items: [
      'Pengelola aplikasi berhak untuk mengubah, memperbarui, atau menyesuaikan Syarat dan Ketentuan ini sewaktu-waktu.',
      'Perubahan ketentuan akan diinformasikan kepada Pengguna melalui pemberitahuan di dalam aplikasi atau saluran resmi lainnya.',
    ],
  },
  {
    title: '11. Masa Berlaku',
    paragraph:
      'Syarat dan Ketentuan ini berlaku sejak Pengguna menyetujuinya saat pendaftaran/penggunaan pertama kali dan tetap berlaku selama Pengguna menggunakan atau memiliki akun aktif di Aplikasi Imah Aing.',
  },
]

export const IMAH_AING_TERMS_CLOSING = {
  title: 'Pernyataan Persetujuan Pengguna',
  text: 'Dengan melanjutkan penggunaan Aplikasi Imah Aing, Pengguna menyatakan bahwa telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan di atas, serta berkomitmen untuk menggunakan aplikasi secara bijak dan bertanggung jawab.',
}
