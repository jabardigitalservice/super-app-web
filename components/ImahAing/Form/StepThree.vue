<template>
  <section class="grid grid-cols-1 gap-x-8 gap-y-6 mb-4">
    <div>
      <p
        class="font-lato text-[12px] leading-[18px] text-gray-600 text-left dark:text-dark-emphasis-high mt-1"
      >
        Ukuran maksimal file 2 MB. Format yang didukung adalah .jpg, .jpeg, .png, dan .pdf.
      </p>
    </div>

    <ul class="space-y-4">
      <li v-for="item in docsConfig" :key="item.key" class="flex flex-col gap-2">
        <div class="flex items-start gap-2 text-sm">
          <span v-if="item.required" class="text-red-500 mt-0.5 flex-shrink-0">*</span>
          <span v-else class="w-1.5 flex-shrink-0" />
          <span class="font-roboto text-black dark:text-dark-emphasis-high">{{ item.label }}</span>
        </div>

        <ValidationProvider
          v-slot="{ errors }"
          :ref="`documentUploader_${item.key}`"
          class="flex flex-col gap-y-2"
          :rules="item.required ? 'required' : ''"
          :name="item.label"
        >
          <BaseDropzone
            :id="`imahAingDocumentDropzone_${item.key}`"
            :accept="accept"
            :max-size="maxSize"
            :multiple="false"
            :is-error="(errors && errors.length > 0)"
            @change="(f) => handleUpload(item.key, f)"
          />
          <span class="font-lato text-[13px] text-red-700">{{ errors[0] }}</span>
        </ValidationProvider>

        <transition name="slide-fade">
          <div v-if="slotFor(item.key)" class="flex flex-col gap-2">
            <BaseDropzoneUploadProgress
              :file="slotFor(item.key).file"
              :progress="slotFor(item.key).progress"
              :status="slotFor(item.key).status"
              :image-url="slotFor(item.key).url"
              @delete="() => handleDelete(item.key)"
              @retry="() => handleRetry(item.key)"
            />
            <span v-if="hasUploadError(item.key)" class="font-lato text-[13px] text-red-700">
              {{ slotFor(item.key).errors[0] }}
            </span>
          </div>
        </transition>
      </li>
    </ul>

    <ul class="space-y-4">
      <li v-for="item in fotoRumahConfig" :key="item.key" class="flex flex-col gap-2">
        <div class="flex items-start gap-2 text-sm">
          <span v-if="item.required" class="text-red-500 mt-0.5 flex-shrink-0">*</span>
          <span v-else class="w-1.5 flex-shrink-0" />
          <span class="font-roboto text-black dark:text-dark-emphasis-high">{{ item.label }}</span>
        </div>

        <ValidationProvider
          v-slot="{ errors }"
          :ref="`documentUploader_${item.key}`"
          class="flex flex-col gap-y-2"
          :rules="item.required ? 'required' : ''"
          :name="item.label"
        >
          <BaseDropzone
            :id="`imahAingDocumentDropzone_${item.key}`"
            :accept="accept"
            :max-size="maxSize"
            :multiple="false"
            :is-error="(errors && errors.length > 0)"
            @change="(f) => handleUpload(item.key, f)"
          />
          <span class="font-lato text-[13px] text-red-700">{{ errors[0] }}</span>
        </ValidationProvider>

        <transition name="slide-fade">
          <div v-if="slotFor(item.key)" class="flex flex-col gap-2">
            <BaseDropzoneUploadProgress
              :file="slotFor(item.key).file"
              :progress="slotFor(item.key).progress"
              :status="slotFor(item.key).status"
              :image-url="slotFor(item.key).url"
              @delete="() => handleDelete(item.key)"
              @retry="() => handleRetry(item.key)"
            />
            <span v-if="hasUploadError(item.key)" class="font-lato text-[13px] text-red-700">
              {{ slotFor(item.key).errors[0] }}
            </span>
          </div>
        </transition>
      </li>
    </ul>

    <ValidationObserver ref="kondisiObserver">
      <div class="border-t border-gray-200 dark:border-dark-emphasis-medium pt-6 space-y-5">
        <h4 class="font-roboto font-medium text-black text-sm dark:text-dark-emphasis-high">
          Kondisi rumah
        </h4>

        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          name="Penyebab Rumah Tidak Layak"
          class="flex flex-col gap-2"
          tag="div"
        >
          <label
            for="penyebabKerusakan"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Penyebab Rumah Tidak Layak <span class="text-red-500">*</span>
          </label>
          <JdsSelect
            id="penyebabKerusakan"
            v-model="setPenyebabKerusakan"
            filterable
            filter-type="contain"
            placeholder="Pilih Penyebab Rumah Tidak Layak"
            :options="penyebabOptions"
            :error-message="errors[0]"
          />
        </ValidationProvider>

        <div
          v-if="selectedPenyebabDetail"
          class="info-box"
        >
          <div class="info-box-title">{{ selectedPenyebabDetail.title }}</div>
          <div class="info-box-desc">{{ selectedPenyebabDetail.desc }}</div>
        </div>

        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          name="Deskripsi kondisi rumah"
          class="flex flex-col gap-2"
          tag="div"
        >
          <label
            for="deskripsiKondisi"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Deskripsi Kondisi Rumah Tidak Layak <span class="text-red-500">*</span>
          </label>
          <textarea
            id="deskripsiKondisi"
            v-model="setDeskripsiKondisi"
            rows="4"
            class="w-full rounded-lg border px-3 py-2 text-sm text-gray-800 dark:bg-dark-emphasis-low dark:text-dark-emphasis-high"
            :class="
              errors[0]
                ? 'border-red-700 dark:border-red-600'
                : 'border-gray-300 dark:border-dark-emphasis-medium'
            "
            placeholder="Jelaskan kondisi rumah"
          />
          <span class="font-lato text-[13px] text-red-700">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
    </ValidationObserver>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      docsConfig: [
        {
          key: 'ktp',
          label: 'KTP Calon Penerima Bantuan (Kepala Keluarga) / Surat Keterangan dari Kepala Desa atau Lurah',
          required: true,
        },
        {
          key: 'kk',
          label: 'KK Calon Penerima Bantuan / Surat Keterangan dari Kepala Desa atau Lurah',
          required: true,
        },
        {
          key: 'suratMiskin',
          label: 'Surat Keterangan Miskin / Tidak Mampu dari Kepala Desa / Lurah',
          required: true,
        },
        {
          key: 'suratTanah',
          label: 'Surat Keterangan Kepemilikan Tanah dari Kepala Desa/Lurah',
          required: true,
        },
      ],
      fotoRumahConfig: [
        { key: 'fotoDepan', label: 'Foto tampak depan', required: true },
        { key: 'fotoBelakang', label: 'Foto tampak belakang', required: true },
        { key: 'fotoKiri', label: 'Foto tampak samping kiri', required: true },
        { key: 'fotoKanan', label: 'Foto tampak samping kanan', required: true },
        { key: 'fotoDalam', label: 'Foto tampak dalam', required: true },
      ],
      penyebabOptions: [
        { value: 'imah-aing-bangunan-tua', label: 'Usia bangunan tua' },
        { value: 'imah-aing-kesalahan-konstruksi', label: 'Kesalahan konstruksi' },
        { value: 'imah-aing-perawatan-buruk', label: 'Perawatan yang buruk' },
        { value: 'imah-aing-hama-jamur', label: 'Hama dan jamur' },
        { value: 'imah-aing-prasarana-dasar', label: 'Ketidaktersediaan prasarana dasar' },
        { value: 'imah-aing-bencana', label: 'Bencana' },
      ],
      penyebabDetailMap: {
        'imah-aing-bangunan-tua': {
          title: 'Usia Bangunan Sudah Tua',
          desc: 'Material bangunan mengalami pelapukan, keretakan, korosi, atau penurunan kekuatan struktur akibat faktor usia dan kurangnya perawatan berkala.',
        },
        'imah-aing-kesalahan-konstruksi': {
          title: 'Kesalahan Konstruksi',
          desc: 'Pembangunan tidak sesuai standar teknis seperti material berkualitas rendah, struktur fondasi, kolom, balok, dinding struktural, atau rangka atap yang tidak kokoh dan memadai atau metode pelaksanaan yang kurang tepat sehingga bangunan mudah mengalami kerusakan.',
        },
        'imah-aing-perawatan-buruk': {
          title: 'Perawatan dan Pemeliharaan yang Buruk',
          desc: 'Kerusakan ringan yang tidak segera diperbaiki, seperti atap bocor, dinding retak, plafon rusak, atau saluran drainase tersumbat, dapat berkembang menjadi kerusakan yang lebih serius dalam jangka panjang.',
        },
        'imah-aing-hama-jamur': {
          title: 'Serangan Hama dan Jamur',
          desc: 'Rayap merusak komponen kayu seperti rangka atap, kusen, dan pintu, jamur akibat kelembapan tinggi, kurangnya ventilasi dan pencahayaan alami menyebabkan pelapukan pada dinding dan plafon, serta menimbulkan risiko kesehatan dan melemahkan integritas bangunan.',
        },
        'imah-aing-prasarana-dasar': {
          title: 'Ketidaktersediaan Prasarana Dasar',
          desc: 'Rumah tidak memiliki akses yang memadai terhadap air bersih, sanitasi, listrik, ventilasi, pencahayaan alami, atau kecukupan ruang tidak sebanding dengan jumlah penghuni.',
        },
        'imah-aing-bencana': {
          title: 'Bencana',
          desc: 'Jenis bencana alam meliputi banjir, banjir bandang,  gempa bumi, cuaca ekstrem, angin puting beliung, kebakaran hutan dan lahan.',
        },
      },
      accept: '.jpg, .jpeg, .png, .pdf',
      maxSize: 2 * 1024 * 1024, // 2 MB
    }
  },
  computed: {
    ...mapState('imahAingForm', ['dokumen', 'kondisiRumah']),
    slotFor() {
      return (key) => (this.dokumen ? this.dokumen[key] : null)
    },
    hasUploadError() {
      return (key) => !!(this.dokumen?.[key]?.errors && this.dokumen[key].errors.length > 0)
    },
    selectedPenyebabDetail() {
      const key = this.kondisiRumah.penyebabKerusakan
      return key ? this.penyebabDetailMap[key] : null
    },
    setPenyebabKerusakan: {
      get() {
        return this.kondisiRumah.penyebabKerusakan || ''
      },
      set(val) {
        const v = val != null ? String(val) : ''
        this.$store.commit('imahAingForm/SET_KONDISI_RUMAH_FIELD', { field: 'penyebabKerusakan', value: v })
        this.$store.commit('imahAingForm/SET_KONDISI_RUMAH_FIELD', {
          field: 'penyebabKerusakanLainnya',
          value: '',
        })
      },
    },
    setDeskripsiKondisi: {
      get() {
        return this.kondisiRumah.deskripsiKondisi
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_KONDISI_RUMAH_FIELD', { field: 'deskripsiKondisi', value: val })
      },
    },
  },
  methods: {
    ...mapActions('imahAingForm', ['uploadDocument']),
    async handleUpload(key, file) {
      const selectedFile = file instanceof FileList ? file[0] : file
      if (!selectedFile) return

      const refName = `documentUploader_${key}`
      const provider = this.$refs[refName]
      const p = Array.isArray(provider) ? provider[0] : provider
      if (p && typeof p.validate === 'function') {
        const { valid } = await p.validate(selectedFile)
        if (!valid) return
      }

      const payload = {
        file: selectedFile,
        url: '',
        progress: 0,
        status: 'UPLOADING',
        errors: [],
      }

      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload })

      try {
        await this.uploadDocument({ key, file: selectedFile })
      } catch (err) {
        const errPayload = { ...payload, status: 'ERROR', errors: [err.message || 'upload_failed'] }
        this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload: errPayload })
      }
    },
    handleDelete(key) {
      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload: null })
      const input = document.querySelector(`#imahAingDocumentDropzone_${key} input`)
      if (input) input.value = ''
      const provider = this.$refs[`documentUploader_${key}`]
      const p = Array.isArray(provider) ? provider[0] : provider
      if (p && typeof p.syncValue === 'function') p.syncValue()
    },
    async handleRetry(key) {
      const slot = this.slotFor(key)
      if (!slot || !slot.file) return

      const payload = { ...slot, status: 'UPLOADING', progress: 0, errors: [] }
      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload })

      try {
        await this.uploadDocument({ key, file: slot.file })
      } catch (err) {
        const errPayload = { ...payload, status: 'ERROR', errors: [err.message || 'upload_failed'] }
        this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload: errPayload })
      }
    },
    async validate() {
      const obs = this.$refs.kondisiObserver
      if (!obs || typeof obs.validate !== 'function') {
        return true
      }
      return await obs.validate()
    },
  },
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Info box penyebab */
.info-box {
  margin-top: 12px;
  padding: 14px;
  background: #F0F9F4;
  border: 1px solid #D1EADE;
  border-left: 4px solid #069550;
  border-radius: 4px 8px 8px 4px;
  animation: fadeIn 0.2s ease;
}
.info-box-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}
.info-box-desc {
  font-size: 13px;
  color: #4B5563;
  line-height: 1.5;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
