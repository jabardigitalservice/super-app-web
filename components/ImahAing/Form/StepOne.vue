<template>
  <section class="mb-6">
    <div class="prose mb-4 dark:prose-invert">
      <p>Pastikan Anda membaca ketentuan dan mempersiapkan dokumen yang diperlukan sebelum melanjutkan.</p>
      <p>Dokumen yang harus disiapkan: KTP, KK, Surat Keterangan Miskin, Surat Keterangan Tanah, dan Foto Tanah.</p>
      <p>Pengisian data harus sesuai identitas resmi. Data yang tidak lengkap dapat menyebabkan penolakan.</p>
    </div>

    <ol class="list-disc ml-5 mb-4 text-sm">
      <li>Kartu Tanda Penduduk (KTP)</li>
      <li>Kartu Keluarga (KK)</li>
      <li>Surat Keterangan Miskin dari Ketua RT</li>
      <li>Surat Keterangan Kepemilikan Tanah dari Kepala Desa/Lurah</li>
      <li>Foto Tanah</li>
    </ol>

    <div class="flex flex-col gap-4">
      <label class="flex items-start gap-3">
        <input v-model="setHasReadPrivacyPolicy" type="checkbox" />
        <span class="text-sm">Saya menyatakan telah membaca, mempelajari, dan menyetujui Kebijakan Privasi</span>
      </label>

      <label class="flex items-start gap-3">
        <input v-model="setIsBeneficiaryCandidate" type="checkbox" />
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
