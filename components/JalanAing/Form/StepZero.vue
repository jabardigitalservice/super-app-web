<template>
  <section class="grid grid-cols-1 gap-x-8 gap-y-6 mb-4">
    <div class="text-gray-800 dark:text-dark-emphasis-high">
      <p class="font-roboto text-base leading-6 mb-4">
        Formulir ini diperuntukkan bagi
        <span class="font-bold">
          Wargi yang ingin melaporkan kondisi jalan rusak di wilayahnya
        </span>
      </p>

      <p class="font-roboto text-base leading-6 mb-4">
        Pastikan data dan dokumen berikut sudah disiapkan untuk memudahkan
        proses pengajuan aduan:
      </p>

      <ol
        class="list-decimal list-inside font-roboto text-base leading-6 mb-6 space-y-1"
      >
        <li>Data diri (Nama, No HP, Email, NIK, KK);</li>
        <li>
          Kategori kerusakan jalan (Rusak Berat/Sedang/Ringan/APJ/Lainnya);
        </li>
        <li>Deskripsi kondisi jalan yang rusak;</li>
        <li>
          Foto kondisi jalan yang rusak (minimal 1 foto, maksimal 3 foto); dan
        </li>
        <li>Lokasi jalan yang rusak (alamat lengkap dan titik koordinat).</li>
      </ol>

      <p class="font-roboto text-base leading-6 mb-4">
        <span class="font-bold">Catatan:</span> Pastikan foto yang diunggah
        menunjukkan kondisi kerusakan jalan dengan jelas dan lokasi yang
        dilaporkan sesuai dengan kondisi sebenarnya di lapangan.
      </p>
    </div>

    <ValidationProvider
      v-slot="{ errors }"
      tag="div"
      class="flex flex-col gap-2"
      name="Kebijakan Privasi"
      :rules="{ required: { allowFalse: false } }"
    >
      <div class="flex items-start gap-2">
        <JdsCheckbox v-model="setPrivacyAgreed" />
        <label
          class="text-gray-800 dark:text-dark-emphasis-high font-roboto text-sm cursor-pointer"
        >
          Saya menyatakan telah membaca, mempelajari, dan menyetujui
          <a
            href="#"
            class="text-blue-600 underline"
            @click.prevent="openPrivacyPolicy"
          >
            Kebijakan Privasi
          </a>
        </label>
      </div>
      <p v-if="errors[0]" class="text-xs text-red-500">
        {{ errors[0] }}
      </p>
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      tag="div"
      class="flex flex-col gap-2"
      name="Pernyataan Pelapor"
      :rules="{ required: { allowFalse: false } }"
    >
      <div class="flex items-start gap-2">
        <JdsCheckbox v-model="setBeneficiary" />
        <label
          class="text-gray-800 dark:text-dark-emphasis-high font-roboto text-sm font-bold cursor-pointer"
        >
          Saya menyatakan bahwa data dan informasi yang saya sampaikan adalah
          benar
        </label>
      </div>
      <p v-if="errors[0]" class="text-xs text-red-500">
        {{ errors[0] }}
      </p>
    </ValidationProvider>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('jalan-aing', ['perhatian']),
    setPrivacyAgreed: {
      get() {
        return this.perhatian.is_privacy_agreed
      },
      set(value) {
        this.$store.commit('jalan-aing/SET_PERHATIAN_PRIVACY_AGREED', value)
      },
    },
    setBeneficiary: {
      get() {
        return this.perhatian.is_beneficiary
      },
      set(value) {
        this.$store.commit('jalan-aing/SET_PERHATIAN_BENEFICIARY', value)
      },
    },
  },
  methods: {
    openPrivacyPolicy() {
      // TODO: Open privacy policy modal or link
      window.open('/kebijakan-privasi', '_blank')
    },
  },
}
</script>
