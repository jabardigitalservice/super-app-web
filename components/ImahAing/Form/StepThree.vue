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

    <div class="space-y-4">
      <div class="flex items-start gap-2 text-sm">
        <span class="text-red-500 mt-0.5 flex-shrink-0">*</span>
        <span class="font-roboto text-black dark:text-dark-emphasis-high">
          Foto Rumah Tidak Layak (tampak depan, kiri, kanan, belakang, dalam)
        </span>
      </div>

      <div class="flex flex-col gap-y-2">
        <BaseDropzone
          id="imahAingDocumentDropzone_fotoRumah"
          :accept="accept"
          :max-size="maxSize"
          :multiple="true"
          :disabled="fotoRumah.length >= maxFotoRumah"
          :is-error="fotoRumah.some((s) => s && s.status === 'ERROR')"
          @change="handleFotoRumahChange"
        />
      </div>

      <p
        v-if="fotoRumah.length >= maxFotoRumah"
        class="font-lato text-[12px] text-gray-600 dark:text-dark-emphasis-high"
      >
        Maksimal {{ maxFotoRumah }} file.
      </p>

      <ul class="space-y-3">
        <li v-for="(slot, idx) in fotoRumah" :key="`fotoRumah_${idx}`" class="flex flex-col gap-2">
          <transition name="slide-fade">
            <div class="flex flex-col gap-2">
              <BaseDropzoneUploadProgress
                :file="slot.file"
                :progress="slot.progress"
                :status="slot.status"
                :image-url="slot.url"
                @delete="() => handleDeleteFotoRumah(idx)"
                @retry="() => handleRetryFotoRumah(idx)"
              />
              <span v-if="slot.errors && slot.errors.length" class="font-lato text-[13px] text-red-700">
                {{ slot.errors[0] }}
              </span>
            </div>
          </transition>
        </li>
      </ul>
    </div>

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

        <ValidationProvider
          v-if="isPenyebabLainnya"
          v-slot="{ errors }"
          rules="required"
          name="Penyebab lainnya"
          class="flex flex-col gap-2"
          tag="div"
        >
          <label
            for="penyebabLainnya"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Penyebab lainnya <span class="text-red-500">*</span>
          </label>
          <JdsInputText
            id="penyebabLainnya"
            :value="setPenyebabKerusakanLainnya"
            class="w-full"
            placeholder="Jelaskan penyebab lainnya"
            :error-message="errors[0]"
            @input="setPenyebabKerusakanLainnya = $event"
          />
        </ValidationProvider>

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
            Deskripsi kondisi rumah <span class="text-red-500">*</span>
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

/** Value `complaint_subcategory_id` untuk opsi "Lainnya" — harus sama dengan `buildImahAingDescription` di store. */
const PENYEBAB_LAINNYA_VALUE = 'imah-aing-lainnya'

export default {
  data() {
    return {
      maxFotoRumah: 5,
      docsConfig: [
        {
          key: 'ktp',
          label: 'KTP / Surat Keterangan dari Desa / Lurah Calon Penerima Bantuan',
          required: true,
        },
        {
          key: 'kk',
          label: 'KK / Surat Keterangan dari Desa / Lurah Calon Penerima Bantuan',
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
      penyebabOptions: [
        { value: 'imah-aing-bencana', label: 'Bencana Alam' },
        { value: 'imah-aing-kebakaran', label: 'Kebakaran' },
        { value: 'imah-aing-usia-bangunan', label: 'Usia Bangunan' },
        { value: 'imah-aing-gagal-konstruksi', label: 'Kegagalan Konstruksi' },
        { value: PENYEBAB_LAINNYA_VALUE, label: 'Lainnya' },
      ],
      accept: '.jpg, .jpeg, .png, .pdf',
      maxSize: 2 * 1024 * 1024, // 2 MB
    }
  },
  computed: {
    ...mapState('imahAingForm', ['dokumen', 'kondisiRumah']),
    fotoRumah() {
      return this.dokumen.fotoRumah || []
    },
    slotFor() {
      return (key) => (this.dokumen ? this.dokumen[key] : null)
    },
    hasUploadError() {
      return (key) => !!(this.dokumen?.[key]?.errors && this.dokumen[key].errors.length > 0)
    },
    isPenyebabLainnya() {
      return this.kondisiRumah.penyebabKerusakan === PENYEBAB_LAINNYA_VALUE
    },
    setPenyebabKerusakan: {
      get() {
        return this.kondisiRumah.penyebabKerusakan || ''
      },
      set(val) {
        const v = val != null ? String(val) : ''
        this.$store.commit('imahAingForm/SET_KONDISI_RUMAH_FIELD', { field: 'penyebabKerusakan', value: v })
        if (v !== PENYEBAB_LAINNYA_VALUE) {
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
    async handleFotoRumahChange(files) {
      const list = files instanceof FileList ? Array.from(files) : files ? [files] : []
      const room = Math.max(0, this.maxFotoRumah - this.fotoRumah.length)
      const toAdd = list.filter(Boolean).slice(0, room)

      for (const file of toAdd) {
        const index = this.fotoRumah.length
        this.$store.commit('imahAingForm/ADD_FOTO_RUMAH_SLOT', {
          file,
          url: '',
          progress: 0,
          status: 'UPLOADING',
          errors: [],
        })
        try {
          await this.uploadDocument({ key: 'fotoRumah', file, index })
        } catch (err) {
          this.$store.commit('imahAingForm/UPDATE_FOTO_RUMAH_SLOT', {
            index,
            payload: {
              file,
              url: '',
              progress: 0,
              status: 'ERROR',
              errors: [err.message || 'upload_failed'],
            },
          })
        }
      }

      const input = document.querySelector('#imahAingDocumentDropzone_fotoRumah input')
      if (input) input.value = ''
    },
    handleDelete(key) {
      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload: null })
      const input = document.querySelector(`#imahAingDocumentDropzone_${key} input`)
      if (input) input.value = ''
      const provider = this.$refs[`documentUploader_${key}`]
      const p = Array.isArray(provider) ? provider[0] : provider
      if (p && typeof p.syncValue === 'function') p.syncValue()
    },
    handleDeleteFotoRumah(index) {
      this.$store.commit('imahAingForm/REMOVE_FOTO_RUMAH_SLOT', index)
      const input = document.querySelector('#imahAingDocumentDropzone_fotoRumah input')
      if (input) input.value = ''
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
    async handleRetryFotoRumah(index) {
      const slot = this.fotoRumah[index]
      if (!slot || !slot.file) return

      const payload = { ...slot, status: 'UPLOADING', progress: 0, errors: [] }
      this.$store.commit('imahAingForm/UPDATE_FOTO_RUMAH_SLOT', { index, payload })

      try {
        await this.uploadDocument({ key: 'fotoRumah', file: slot.file, index })
      } catch (err) {
        this.$store.commit('imahAingForm/UPDATE_FOTO_RUMAH_SLOT', {
          index,
          payload: { ...payload, status: 'ERROR', errors: [err.message || 'upload_failed'] },
        })
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
</style>
