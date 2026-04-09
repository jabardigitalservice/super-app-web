<template>
  <section>
    <div v-for="item in docsConfig" :key="item.key" class="mb-6">
      <label class="font-roboto font-medium text-sm text-black dark:text-dark-emphasis-high mb-2 block">
        {{ item.label }} <span v-if="item.required" class="text-red-500">*</span>
      </label>

      <BaseDropzone
        v-if="!dokumen[item.key] || dokumen[item.key].status === 'NONE'"
        :accept="accept"
        :multiple="false"
        :max-size="maxSize"
        @change="handleUpload(item.key, $event)"
      />

      <BaseDropzoneUploadProgress
        v-else
        :file="dokumen[item.key].file"
        :progress="dokumen[item.key].progress"
        :status="dokumen[item.key].status"
        :image-url="dokumen[item.key].url"
        @delete="handleDelete(item.key)"
        @retry="handleRetry(item.key)"
      />
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      docsConfig: [
        { key: 'ktp', label: 'Kartu Tanda Penduduk (KTP) Calon Penerima Bantuan', required: true },
        { key: 'kk', label: 'Kartu Keluarga (KK) Calon Penerima Bantuan', required: true },
        { key: 'suratMiskin', label: 'Surat Keterangan Miskin dari Ketua RT', required: true },
        { key: 'suratTanah', label: 'Surat Keterangan Kepemilikan Tanah dari Kepala Desa/Lurah', required: true },
        { key: 'fotoTanah', label: 'Foto Tanah', required: true },
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
    handleUpload(key, files) {
      const file = files instanceof FileList ? files[0] : files
      if (!file) return

      const payload = {
        file,
        url: '',
        progress: 0,
        status: 'UPLOADING',
        errors: [],
      }

      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload })

      // call upload action (placeholder in store)
      this.$store.dispatch('imahAingForm/uploadDocument', { key, file }).catch((err) => {
        const errPayload = { ...payload, status: 'ERROR', errors: [err.message || 'upload_failed'] }
        this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload: errPayload })
      })
    },
    handleDelete(key) {
      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload: null })
    },
    handleRetry(key) {
      const slot = this.dokumen[key]
      if (!slot || !slot.file) return

      const payload = { ...slot, status: 'UPLOADING', progress: 0, errors: [] }
      this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload })
      this.$store.dispatch('imahAingForm/uploadDocument', { key, file: slot.file }).catch((err) => {
        const errPayload = { ...payload, status: 'ERROR', errors: [err.message || 'upload_failed'] }
        this.$store.commit('imahAingForm/SET_DOKUMEN_SLOT', { key, payload: errPayload })
      })
    },
  },
}
</script>
