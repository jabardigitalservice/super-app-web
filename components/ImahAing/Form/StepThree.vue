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

    <div class="border-t border-gray-200 dark:border-dark-emphasis-medium pt-6 space-y-5">
      <h4 class="font-roboto font-medium text-black text-sm dark:text-dark-emphasis-high">
        Kondisi rumah
      </h4>

      <div class="flex flex-col gap-2">
        <label
          for="penyebabKerusakan"
          class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
        >
          Penyebab kerusakan
        </label>
        <JdsSelect
          id="penyebabKerusakan"
          v-model="setPenyebabKerusakan"
          filterable
          filter-type="contain"
          placeholder="Pilih penyebab kerusakan"
          :options="penyebabOptions"
        />
      </div>

      <div v-if="kondisiRumah.penyebabKerusakan === 'lainnya'" class="flex flex-col gap-2">
        <label
          for="penyebabLainnya"
          class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
        >
          Penyebab lainnya
        </label>
        <JdsInputText
          id="penyebabLainnya"
          :value="setPenyebabKerusakanLainnya"
          class="w-full"
          placeholder="Jelaskan penyebab lainnya"
          @input="setPenyebabKerusakanLainnya = $event"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="deskripsiKondisi"
          class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
        >
          Deskripsi kondisi rumah
        </label>
        <textarea
          id="deskripsiKondisi"
          v-model="setDeskripsiKondisi"
          rows="4"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:bg-dark-emphasis-low dark:border-dark-emphasis-medium dark:text-dark-emphasis-high"
          placeholder="Jelaskan kondisi rumah"
        />
      </div>

      <label class="flex items-start gap-3 cursor-pointer">
        <input
          v-model="setPernyataanKepemilikanTunggal"
          type="checkbox"
          class="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
        />
        <span class="text-sm text-black dark:text-dark-emphasis-high">
          Saya menyatakan kepemilikan tunggal atas rumah ini (pernyataan bermaterai mengikuti ketentuan operasional).
        </span>
      </label>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      docsConfig: [
        { key: 'ktp', label: 'Kartu Tanda Penduduk (KTP) Calon Penerima Bantuan', required: true },
        { key: 'kk', label: 'Kartu Keluarga (KK) Calon Penerima Bantuan', required: true },
        {
          key: 'suratMiskin',
          label: 'Surat Keterangan Miskin / Tidak Mampu dari Ketua RT',
          required: true,
        },
        {
          key: 'suratTanah',
          label: 'Surat Keterangan Kepemilikan Tanah dari Kepala Desa/Lurah',
          required: true,
        },
        { key: 'fotoRumahDepan', label: 'Foto rumah — tampak depan (wajib)', required: true },
        { key: 'fotoRumahKiri', label: 'Foto rumah — tampak kiri', required: false },
        { key: 'fotoRumahKanan', label: 'Foto rumah — tampak kanan', required: false },
        { key: 'fotoRumahDalam', label: 'Foto rumah — tampak dalam', required: false },
        { key: 'fotoRumahBelakang', label: 'Foto rumah — tampak belakang', required: false },
      ],
      penyebabOptions: [
        { value: 'bencana', label: 'Bencana' },
        { value: 'umur_sudah_tua', label: 'Umur sudah tua' },
        { value: 'tidak_terawat', label: 'Tidak terawat' },
        { value: 'struktur_bangunan_tidak_baik', label: 'Struktur bangunan tidak baik' },
        { value: 'lainnya', label: 'Lainnya' },
      ],
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
    setPenyebabKerusakan: {
      get() {
        return this.kondisiRumah.penyebabKerusakan || ''
      },
      set(val) {
        const v = val != null ? String(val) : ''
        this.$store.commit('imahAingForm/SET_KONDISI_RUMAH_FIELD', { field: 'penyebabKerusakan', value: v })
        if (v !== 'lainnya') {
          this.$store.commit('imahAingForm/SET_KONDISI_RUMAH_FIELD', {
            field: 'penyebabKerusakanLainnya',
            value: '',
          })
        }
      },
    },
    setPenyebabKerusakanLainnya: {
      get() {
        return this.kondisiRumah.penyebabKerusakanLainnya
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_KONDISI_RUMAH_FIELD', {
          field: 'penyebabKerusakanLainnya',
          value: val,
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
    setPernyataanKepemilikanTunggal: {
      get() {
        return this.kondisiRumah.pernyataanKepemilikanTunggalBermaterai
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_KONDISI_RUMAH_FIELD', {
          field: 'pernyataanKepemilikanTunggalBermaterai',
          value: val,
        })
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
</style>
