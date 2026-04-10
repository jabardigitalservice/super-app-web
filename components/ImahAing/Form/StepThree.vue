<template>
  <section>
    <p class="font-roboto text-sm text-gray-600 dark:text-dark-emphasis-medium mb-4">
      Upload satu file yang berisi seluruh dokumen berikut:
    </p>

    <ul class="mb-6 space-y-2">
      <li v-for="item in docsConfig" :key="item.key" class="flex items-start gap-2 text-sm">
        <span class="text-red-500 mt-0.5 flex-shrink-0">*</span>
        <span class="font-roboto text-black dark:text-dark-emphasis-high">{{ item.label }}</span>
      </li>
    </ul>

    <BaseDropzone
      v-if="!dokumen.files || dokumen.files.status === 'NONE'"
      :accept="accept"
      :multiple="false"
      :max-size="maxSize"
      @change="handleUpload($event)"
    />

    <BaseDropzoneUploadProgress
      v-else
      :file="dokumen.files.file"
      :progress="dokumen.files.progress"
      :status="dokumen.files.status"
      :image-url="dokumen.files.url"
      @delete="handleDelete"
      @retry="handleRetry"
    />
  </section>
</template>

<script>
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
    dokumen() {
      return this.$store.state.imahAingForm.dokumen
    },
  },
  methods: {
    handleUpload(files) {
      const file = files instanceof FileList ? files[0] : files
      if (!file) return

      const payload = {
        file,
        url: '',
        progress: 0,
        status: 'UPLOADING',
        errors: [],
      }

      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key: 'files', payload })

      this.$store.dispatch('imahAingForm/uploadDocument', { key: 'files', file }).catch((err) => {
        const errPayload = { ...payload, status: 'ERROR', errors: [err.message || 'upload_failed'] }
        this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key: 'files', payload: errPayload })
      })
    },
    handleDelete() {
      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key: 'files', payload: null })
    },
    handleRetry() {
      const slot = this.dokumen.files
      if (!slot || !slot.file) return

      const payload = { ...slot, status: 'UPLOADING', progress: 0, errors: [] }
      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key: 'files', payload })
      this.$store.dispatch('imahAingForm/uploadDocument', { key: 'files', file: slot.file }).catch((err) => {
        const errPayload = { ...payload, status: 'ERROR', errors: [err.message || 'upload_failed'] }
        this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key: 'files', payload: errPayload })
      })
    },
  },
}
</script>
