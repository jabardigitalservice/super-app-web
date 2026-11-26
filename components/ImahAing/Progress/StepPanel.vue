<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high">
      {{ title }} <span v-if="!isSaved" class="text-red-500">*</span>
    </h2>
    <p v-if="!isSaved" class="font-lato text-[12px] leading-[18px] text-gray-600 dark:text-dark-emphasis-high">
      Ukuran maksimal file 5 MB{{ isSingle ? '' : ' per foto' }}. Format yang didukung adalah {{ rule.formatLabel }}.
    </p>
    <p v-if="statusText" class="font-lato text-[13px] text-gray-600 dark:text-dark-text-medium">
      {{ statusText }}
    </p>

    <!-- Tersimpan: hanya preview. `tabindex` supaya daftar bisa digeser lewat keyboard -->
    <ul
      v-if="isSaved"
      class="flex gap-2 overflow-x-auto pb-2"
      tabindex="0"
      :aria-label="`${title} tersimpan`"
    >
      <li v-for="(file, index) in saved" :key="fileKey(file)" class="flex-shrink-0 max-w-full">
        <a
          v-if="isPdf(file)"
          :href="file.url"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-900 underline dark:border-dark-emphasis-medium dark:text-dark-emphasis-high"
        >
          <img src="/icon/file-pdf.svg" alt="" class="w-8 h-8 flex-shrink-0" />
          <span class="break-all">{{ file.name }}</span>
        </a>
        <img
          v-else
          :src="file.url"
          :alt="isSingle ? `Bukti transfer: ${file.name}` : `${title} ${index + 1}: ${file.name}`"
          class="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-dark-emphasis-medium"
        />
      </li>
    </ul>

    <template v-else>
      <!-- Input BaseDropzone `hidden`, tidak bisa dicapai keyboard: pembungkus ini yang menerima fokus -->
      <div
        ref="picker"
        role="button"
        tabindex="0"
        :aria-label="isSingle ? 'Pilih file Bukti Transfer' : `Pilih ${title}`"
        :aria-disabled="String(busy)"
        class="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        @keydown.enter.prevent="openPicker"
        @keydown.space.prevent="openPicker"
      >
        <BaseDropzone
          :accept="rule.accept"
          :multiple="!isSingle"
          :disabled="busy"
          :is-error="errors.length > 0"
          @change="onPick"
        />
      </div>

      <p v-if="busy" role="status" class="font-lato text-[13px] text-gray-600 dark:text-dark-text-medium">
        Memproses file...
      </p>
      <ul v-if="errors.length" role="alert" class="font-lato text-[13px] text-red-700 break-words dark:text-red-400">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>

      <p
        v-if="!isSingle"
        class="font-lato text-[13px]"
        :class="draft.length >= rule.min ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'"
      >
        {{ draft.length }}/{{ rule.min }} foto minimal{{ draft.length >= rule.min ? ' - sudah cukup' : '' }}
      </p>

      <ul v-if="draft.length" class="space-y-4">
        <li v-for="(file, index) in draft" :key="fileKey(file)" class="text-black dark:text-dark-emphasis-high">
          <BaseDropzoneUploadProgress
            :file="file"
            :image-url="previewUrl(file)"
            status="HASDEFAULT"
            @delete="remove(index)"
          />
        </li>
      </ul>

      <div class="mt-2 flex md:justify-end">
        <Button
          class="w-full md:w-fit !justify-center"
          variant="primary"
          type="button"
          :disabled="!canSave"
          :style="[!canSave && { backgroundColor: '#E0E0E0', color: '#FFFFFF' }]"
          @click="$emit('request-save', [...draft])"
        >
          Simpan
        </Button>
      </div>
    </template>
  </div>
</template>

<script>
import { convertHeicToJpg } from '~/utils/heic'
import {
  IMAH_AING_PROGRESS_STEPS,
  isProgressStepFilled,
  getProgressFileError
} from '~/constant/imah-aing-status'

export default {
  name: 'ImahAingProgressStepPanel',
  props: {
    step: {
      type: Number,
      required: true
    },
    /** File tersimpan tahap ini, masing-masing membawa `url` preview */
    saved: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      draft: [],
      errors: [],
      busy: false
    }
  },
  computed: {
    rule() {
      return IMAH_AING_PROGRESS_STEPS[this.step]
    },
    isSingle() {
      return this.rule.max === 1
    },
    title() {
      return this.isSingle ? this.rule.label : `Foto ${this.rule.label}`
    },
    isSaved() {
      return isProgressStepFilled(this.saved, this.step)
    },
    canSave() {
      return !this.busy && isProgressStepFilled(this.draft, this.step)
    },
    statusText() {
      if (this.isSaved) return 'Tersimpan'
      if (this.draft.length) return 'File dipilih, belum disimpan'
      return this.isSingle ? 'Belum ada bukti transfer' : ''
    }
  },
  created() {
    // Non-reaktif: object URL dan key per file
    this.urls = new Map()
    this.keys = new WeakMap()
    this.lastKey = 0
  },
  mounted() {
    this.$nextTick(this.labelDeleteButtons)
  },
  updated() {
    this.$nextTick(this.labelDeleteButtons)
  },
  beforeDestroy() {
    this.urls.forEach((url) => URL.revokeObjectURL(url))
  },
  methods: {
    openPicker() {
      this.$refs.picker.querySelector('input').click()
    },
    // BaseDropzone mengirim `File` (single) atau `FileList` (multiple)
    async onPick(selection) {
      const picked = selection instanceof File ? [selection] : Array.from(selection || [])
      // Base tidak mereset input: tanpa ini file yang sama tidak bisa dipilih lagi setelah dihapus
      this.$refs.picker.querySelector('input').value = ''
      if (this.busy || !picked.length) return

      this.busy = true
      this.errors = []
      const accepted = []
      for (const original of picked) {
        let file
        try {
          file = await convertHeicToJpg(original)
        } catch (error) {
          this.errors.push(`${original.name}: gagal mengonversi foto HEIC. Coba foto lain atau simpan sebagai JPG dulu.`)
          continue
        }
        // Cek setelah konversi: hasil konversi HEIC bisa melebihi batas
        const message = getProgressFileError(file, this.step)
        if (message) this.errors.push(message)
        else accepted.push(file)
      }
      if (accepted.length) {
        this.draft = this.isSingle ? accepted.slice(0, 1) : [...this.draft, ...accepted]
      }
      this.busy = false
    },
    remove(index) {
      if (this.busy) return
      this.draft.splice(index, 1)
      this.errors = []
      this.$refs.picker.focus()
    },
    // Tombol hapus di Base hanya berisi ikon tanpa nama aksesibel
    labelDeleteButtons() {
      this.$el
        .querySelectorAll?.('[data-cy$="__button-delete"]')
        .forEach((button, i) => button.setAttribute('aria-label', `Hapus ${this.draft[i]?.name}`))
    },
    fileKey(file) {
      if (!this.keys.has(file)) this.keys.set(file, ++this.lastKey)
      return this.keys.get(file)
    },
    // Preview draft; URL file tersimpan dikelola store
    previewUrl(file) {
      // Base jatuh ke gambar default yang tidak ada di repo untuk PDF
      if (this.isPdf(file)) return '/icon/file-pdf.svg'
      if (!this.urls.has(file)) this.urls.set(file, URL.createObjectURL(file))
      return this.urls.get(file)
    },
    isPdf(file) {
      return file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
    }
  }
}
</script>
