<template>
  <section class="mb-6 leading-relaxed text-gray-800 dark:text-gray-200">
    <div v-if="isSapawargaSource" class="mb-6 space-y-4">
      <p>
        Formulir ini diperuntukkan bagi
        <strong>Ketua RT/RW/Lurah/Kades yang akan mengusulkan warganya sebagai calon penerima bantuan</strong>
      </p>
    </div>

    <div v-else class="mb-6 space-y-4">
      <p>
        Formulir ini diperuntukkan bagi <strong>Wargi yang mengusulkan dirinya sendiri sebagai calon penerima bantuan</strong>
      </p>
    </div>

    <div class="mb-4">
      <p class="mb-2">
        Pastikan dokumen digital berikut sudah terlebih dahulu disiapkan untuk memudahkan proses pengajuan wargi (dalam format .pdf atau .jpeg/.jpg/.png) :
      </p>
      <ol class="list-decimal ml-5 space-y-1">
        <li><strong>KTP</strong> / Surat Keterangan dari Kades atau Lurah;</li>
        <li><strong>Kartu Keluarga</strong> / Surat Keterangan dari Kades atau Lurah;</li>
        <li>Surat Keterangan Miskin / Tidak Mampu dari RT;</li>
        <li>Surat Keterangan Kepemilikan Tanah Dari Kepala Desa/Lurah; dan</li>
        <li>Foto rumah.</li>
      </ol>
    </div>

    <div class="flex flex-col gap-4 mt-8">
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          v-model="privacyAccepted"
          type="checkbox"
          class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span class="text-sm">
          Saya menyatakan telah membaca, mempelajari, dan menyetujui
          <a href="https://sapawarga.digitalservice.id/kebijakan-privasi-ketentuan-pengguna" class="underline hover:text-blue-600">Kebijakan Privasi</a>
        </span>
      </label>

      <label class="flex items-start gap-3 cursor-pointer">
        <input
          v-model="stmtSingleHouse"
          type="checkbox"
          class="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
        />
        <span class="text-sm">{{ copySingleHouse }}</span>
      </label>

      <label class="flex items-start gap-3 cursor-pointer">
        <input
          v-model="stmtNoSimilarProgram"
          type="checkbox"
          class="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
        />
        <span class="text-sm">{{ copyNoSimilarProgram }}</span>
      </label>

      <label class="flex items-start gap-3 cursor-pointer">
        <input
          v-model="stmtRevocationIfUntrue"
          type="checkbox"
          class="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
        />
        <span class="text-sm">{{ copyRevocationIfUntrue }}</span>
      </label>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    isSapawargaSource() {
      return this.$store.state.imahAingForm.sourceId === 'sapawarga'
    },
    copySingleHouse() {
      return this.isSapawargaSource
        ? 'Saya menyatakan bahwa rumah yang diajukan merupakan rumah tunggal calon penerima bantuan'
        : 'Saya menyatakan bahwa rumah yang diajukan merupakan rumah tunggal saya'
    },
    copyNoSimilarProgram() {
      return this.isSapawargaSource
        ? 'Saya menyatakan bahwa calon penerima bantuan belum pernah menerima bantuan dari program serupa'
        : 'Saya menyatakan bahwa saya belum pernah menerima bantuan dari program serupa'
    },
    copyRevocationIfUntrue() {
      return this.isSapawargaSource
        ? 'Saya menyatakan bahwa calon penerima bantuan bersedia dibatalkan jika data dan pernyataan yang saya berikan tidak benar'
        : 'Saya bersedia dibatalkan pengajuannya jika data dan pernyataan yang saya berikan tidak benar'
    },
    privacyAccepted: {
      get() {
        return this.$store.state.imahAingForm.consent.hasReadPrivacyPolicy
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_CONSENT_PRIVACY', val)
      },
    },
    stmtSingleHouse: {
      get() {
        return this.$store.state.imahAingForm.consent.stmtSingleHouse
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_CONSENT_STATEMENT', { field: 'stmtSingleHouse', value: val })
      },
    },
    stmtNoSimilarProgram: {
      get() {
        return this.$store.state.imahAingForm.consent.stmtNoSimilarProgram
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_CONSENT_STATEMENT', { field: 'stmtNoSimilarProgram', value: val })
      },
    },
    stmtRevocationIfUntrue: {
      get() {
        return this.$store.state.imahAingForm.consent.stmtRevocationIfUntrue
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_CONSENT_STATEMENT', { field: 'stmtRevocationIfUntrue', value: val })
      },
    },
  },
}
</script>
