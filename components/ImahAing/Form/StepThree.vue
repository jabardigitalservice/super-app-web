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
          <span class="text-red-500 mt-0.5 flex-shrink-0">*</span>
          <span class="font-roboto text-black dark:text-dark-emphasis-high">{{ item.label }}</span>
        </div>

        <ValidationProvider
          v-slot="{ errors }"
          :ref="`documentUploader_${item.key}`"
          class="flex flex-col gap-y-2"
          rules="required"
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
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      docsConfig: [
        { key: 'ktp', label: 'Kartu Tanda Penduduk (KTP) Calon Penerima Bantuan' },
        { key: 'kk', label: 'Kartu Keluarga (KK) Calon Penerima Bantuan' },
        { key: 'suratMiskin', label: 'Surat Keterangan Miskin dari Ketua RT' },
        { key: 'suratTanah', label: 'Surat Keterangan Kepemilikan Tanah dari Kepala Desa/Lurah' },
        { key: 'fotoTanah', label: 'Foto Tanah' },
      ],
      accept: '.jpg, .jpeg, .png, .pdf',
      maxSize: 2 * 1024 * 1024, // 2 MB
    }
  },
  computed: {
    ...mapState('imahAingForm', ['dokumen']),
    slotFor() {
      return (key) => this.dokumen ? this.dokumen[key] : null
    },
    showDropzone() {
      return (key) => {
        const slot = this.dokumen ? this.dokumen[key] : null
        return !slot || slot.status === 'NONE'
      }
    },
    hasUploadError() {
      return (key) => !!(this.dokumen?.[key]?.errors && this.dokumen[key].errors.length > 0)
    },
  },
  methods: {
    ...mapActions('imahAingForm', ['uploadDocument']),
    async handleUpload(key, file) {
      const selectedFile = file instanceof FileList ? file[0] : file
      if (!selectedFile) return

      const refName = `documentUploader_${key}`
      const provider = this.$refs[refName]
      if (provider && typeof provider.validate === 'function') {
        const { valid } = await provider.validate(selectedFile)
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
      if (provider && typeof provider.syncValue === 'function') provider.syncValue()
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
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
