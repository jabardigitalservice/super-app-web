<template>
  <div class="font-roboto">
    <p v-if="statusText" class="mb-2 text-sm text-gray-700 dark:text-dark-text-medium">
      {{ statusText }}
    </p>

    <!-- Input disembunyikan secara visual saja (sr-only) supaya tetap bisa dipakai lewat keyboard -->
    <label
      class="block cursor-pointer rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 px-3 py-6 text-center focus-within:ring-2 focus-within:ring-green-700 dark:border-dark-emphasis-high dark:bg-dark-emphasis-medium"
      :class="{ 'cursor-wait opacity-60': busy }"
    >
      <input
        ref="input"
        type="file"
        class="sr-only"
        :accept="rule.accept"
        :multiple="!isSingle"
        :disabled="busy"
        @change="onPick"
      />
      <span class="block text-sm font-semibold text-gray-900 dark:text-dark-text-high">
        {{ pickText }}
      </span>
      <span class="block text-xs text-gray-600 dark:text-dark-text-medium">
        {{ rule.formatLabel }} · maks 5 MB{{ isSingle ? '' : ' per foto' }}
      </span>
    </label>

    <p v-if="busy" role="status" class="mt-2 text-sm text-gray-600 dark:text-dark-text-medium">
      Memproses file...
    </p>
    <ul v-if="errors.length" role="alert" class="mt-2 text-sm text-red-700 break-words dark:text-red-300">
      <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
    </ul>

    <p
      v-if="!isSingle"
      class="mt-2 text-xs"
      :class="draft.length >= rule.min ? 'text-green-800 dark:text-green-300' : 'text-red-700 dark:text-red-300'"
    >
      {{ draft.length }}/{{ rule.min }} minimal{{ draft.length >= rule.min ? ' - sudah cukup' : '' }}
    </p>

    <ul class="mt-3 grid gap-2" :class="isSingle ? 'grid-cols-1' : 'grid-cols-3'">
      <li
        v-for="(file, index) in draft"
        :key="fileKey(file)"
        :class="
          isSingle
            ? 'flex items-center gap-3 rounded-lg border border-gray-200 p-2 dark:border-dark-emphasis-medium'
            : 'relative aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-dark-emphasis-medium'
        "
      >
        <div
          class="flex items-center justify-center overflow-hidden text-xs font-bold text-gray-600 dark:text-dark-text-medium"
          :class="isSingle ? 'h-16 w-16 flex-none rounded-lg bg-gray-100 dark:bg-dark-emphasis-medium' : 'h-full w-full'"
        >
          <span v-if="isPdf(file)">PDF</span>
          <img
            v-else
            :src="previewUrl(file)"
            :alt="isSingle ? 'Pratinjau bukti transfer' : `Foto ${index + 1}`"
            class="h-full w-full object-cover"
          />
        </div>
        <div v-if="isSingle" class="min-w-0 flex-1 text-sm text-gray-900 dark:text-dark-text-high">
          <p class="break-all font-semibold">{{ file.name }}</p>
          <p class="text-xs text-gray-500 dark:text-dark-text-medium">{{ formatSize(file) }}</p>
        </div>
        <button
          type="button"
          class="flex h-11 w-11 flex-none items-center justify-center"
          :class="{ 'absolute right-0 top-0': !isSingle }"
          :aria-label="isSingle ? 'Hapus file' : `Hapus foto ${index + 1}`"
          :disabled="busy"
          @click="remove(index)"
        >
          <span aria-hidden="true" class="flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-sm text-white">✕</span>
        </button>
      </li>
    </ul>

    <Button
      class="mt-4 w-full !justify-center"
      variant="primary"
      type="button"
      :disabled="!canSave"
      :style="[!canSave && { backgroundColor: '#E0E0E0', color: '#616161' }]"
      @click="$emit('request-save', [...draft])"
    >
      {{ saved.length ? 'Simpan Perubahan' : 'Simpan' }}
    </Button>
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
    /** File tersimpan tahap ini: `File`, atau `{ name, type, size, url }` untuk data contoh */
    saved: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      draft: [...this.saved],
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
    isDirty() {
      return this.draft.length !== this.saved.length || this.draft.some((file, i) => file !== this.saved[i])
    },
    canSave() {
      return !this.busy && isProgressStepFilled(this.draft, this.step)
    },
    statusText() {
      if (this.isDirty) {
        return this.saved.length ? 'Perubahan belum disimpan' : 'File dipilih, belum disimpan'
      }
      if (this.saved.length) return 'Tersimpan'
      return this.isSingle ? 'Belum ada bukti transfer' : ''
    },
    pickText() {
      if (!this.isSingle) return `Pilih minimal ${this.rule.min} Foto untuk Upload`
      return this.draft.length ? 'Pilih file lain' : 'Pilih Bukti Transfer untuk Upload'
    }
  },
  created() {
    // Non-reaktif: object URL dan key per file
    this.urls = new Map()
    this.keys = new WeakMap()
    this.lastKey = 0
  },
  beforeDestroy() {
    this.urls.forEach((url) => URL.revokeObjectURL(url))
  },
  methods: {
    async onPick(event) {
      const picked = Array.from(event.target.files || [])
      event.target.value = '' // file yang sama bisa dipilih lagi setelah dihapus
      if (!picked.length) return

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
      this.draft.splice(index, 1)
      this.errors = []
      this.$refs.input.focus()
    },
    fileKey(file) {
      if (!this.keys.has(file)) this.keys.set(file, ++this.lastKey)
      return this.keys.get(file)
    },
    previewUrl(file) {
      if (file.url) return file.url
      if (!this.urls.has(file)) this.urls.set(file, URL.createObjectURL(file))
      return this.urls.get(file)
    },
    isPdf(file) {
      return file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
    },
    formatSize(file) {
      return `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    }
  }
}
</script>
