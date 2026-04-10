<template>
  <section class="mb-6 leading-relaxed text-gray-800 dark:text-gray-200">
    <div class="mb-6 space-y-4">
      <p>
        Formulir ini diperuntukkan bagi <strong>Wargi yang mengusulkan dirinya sendiri sebagai calon penerima bantuan</strong>
      </p>
      <p>
        Untuk <strong>proses rekomendasi</strong> hanya bisa dilakukan <strong>melalui Ketua RT/Ketua RW/Kades melalui akun Sapawarga RT / RW / Kades</strong>
      </p>
    </div>

    <div class="mb-4">
      <p class="mb-2">
        Pastikan dokumen digital berikut sudah terlebih dahulu disiapkan untuk memudahkan proses pengajuan wargi (dalam format .pdf atau .jpeg/.jpg/.png) :
      </p>
      <ol class="list-decimal ml-5 space-y-1">
        <li>Kartu Tanda Penduduk (KTP);</li>
        <li>Kartu Keluarga (KK);</li>
        <li>Surat Keterangan Miskin dari RT;</li>
        <li>Surat Keterangan Kepemilikan Tanah Dari Kepala Desa/Lurah; dan</li>
        <li>Foto Tanah.</li>
      </ol>
    </div>

    <div class="flex flex-col gap-4 mt-8">
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          v-model="setHasReadPrivacyPolicy"
          type="checkbox"
          class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span class="text-sm">
          Saya menyatakan telah membaca, mempelajari, dan menyetujui
          <a href="#" class="underline hover:text-blue-600">Kebijakan Privasi</a>
        </span>
      </label>

      <label class="flex items-center gap-3 cursor-pointer">
        <input
          v-model="setIsBeneficiaryCandidate"
          type="checkbox"
          class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span class="text-sm">Saya adalah calon penerima bantuan</span>
      </label>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    setHasReadPrivacyPolicy: {
      get() {
        return this.$store.state.imahAingForm.consent.hasReadPrivacyPolicy
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_CONSENT_PRIVACY', val)
      },
    },
    setIsBeneficiaryCandidate: {
      get() {
        return this.$store.state.imahAingForm.consent.isBeneficiaryCandidate
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_CONSENT_BENEFICIARY', val)
      },
    },
  },
}
</script>
