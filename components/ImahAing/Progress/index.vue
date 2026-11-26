<template>
  <div class="px-4 py-4 md:px-7 md:py-5">
    <!-- `inert` menahan fokus keyboard di popup konfirmasi -->
    <div :inert="!!pending" class="flex flex-col gap-6">
      <!-- Info read-only -->
      <dl class="grid grid-cols-1 gap-x-8 gap-y-4 rounded-lg border border-gray-300 p-4 sm:grid-cols-2 dark:border-dark-emphasis-medium">
        <div v-for="row in infoRows" :key="row.label">
          <dt class="text-xs text-gray-500 font-roboto dark:text-dark-text-medium">
            {{ row.label }}
          </dt>
          <dd class="mt-0.5 text-sm text-gray-900 font-roboto break-words dark:text-dark-emphasis-high">
            <span
              v-if="row.badge"
              class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded"
              :style="{ color: row.badge.hex, backgroundColor: row.badge.hex + '1A' }"
            >
              {{ row.badge.name }}
            </span>
            <template v-else>{{ row.value || '-' }}</template>
          </dd>
        </div>
      </dl>

      <div class="rounded-lg border border-gray-300 p-4 dark:border-dark-emphasis-medium">
        <ImahAingProgressStepPanel
          :step="0"
          :saved="saved[0]"
          @request-save="openConfirm(0, $event)"
        />
      </div>

      <div>
        <BaseAlert :message="lockMessage" class="mb-4" />

        <div
          role="tablist"
          aria-label="Tahap progres"
          class="grid grid-cols-3 border-b border-gray-200 dark:border-dark-emphasis-medium"
        >
          <button
            v-for="tab in tabs"
            :id="`progress-tab-${tab.step}`"
            :key="tab.step"
            type="button"
            role="tab"
            :aria-selected="String(isSelected(tab))"
            :aria-controls="`progress-panel-${tab.step}`"
            :tabindex="isSelected(tab) ? 0 : -1"
            :disabled="!tab.unlocked"
            class="flex min-h-[56px] flex-col items-center justify-start gap-1 border-b-2 px-1 py-2 font-roboto disabled:cursor-not-allowed disabled:opacity-50"
            :class="
              isSelected(tab)
                ? 'border-green-600 text-black dark:text-dark-emphasis-high'
                : 'border-transparent text-gray-600 dark:text-dark-text-medium'
            "
            @click="selectTab(tab)"
            @keydown.left.prevent="moveTab(-1)"
            @keydown.right.prevent="moveTab(1)"
          >
            <span class="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                :class="isSelected(tab) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'"
              >
                {{ tab.step }}
              </span>
              {{ tab.label }}
            </span>
            <span class="text-xs">{{ tab.note }}</span>
          </button>
        </div>

        <!-- Panel yang terbuka tetap ter-mount supaya draft tidak hilang saat pindah tab -->
        <div
          v-for="tab in tabs"
          v-show="active === tab.step"
          :id="`progress-panel-${tab.step}`"
          :key="tab.step"
          role="tabpanel"
          :aria-labelledby="`progress-tab-${tab.step}`"
          class="pt-4"
        >
          <ImahAingProgressStepPanel
            v-if="tab.unlocked"
            :step="tab.step"
            :saved="saved[tab.step]"
            @request-save="openConfirm(tab.step, $event)"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-2 md:flex md:justify-between">
        <Button
          class="w-full md:w-fit !justify-center"
          variant="secondary"
          type="button"
          @click="$emit('back')"
        >
          Kembali
        </Button>
      </div>
    </div>

    <TrackingComplaintModal
      ref="confirm"
      :open="!!pending"
      label-primary-button="Ya, Simpan"
      label-secondary-button="Batal"
      header-close-button
      src-icon="/icon/sent-message.svg"
      size="48px"
      :title="confirmText.title"
      :description="confirmText.description"
      @close="closeConfirm"
      @click="confirmSave"
    />

    <!-- Snackbar: sama dengan halaman Riwayat -->
    <div
      role="status"
      :class="
        toast
          ? 'fixed bottom-20 left-4 right-4 z-20 md:max-w-[650px] md:mx-auto md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-[calc(650px-2rem)] bg-gray-700 text-white text-sm rounded-lg px-4 py-3 shadow-lg'
          : 'sr-only'
      "
    >
      {{ toast }}
    </div>
  </div>
</template>

<script>
import {
  IMAH_AING_PROGRESS_STEPS,
  isProgressStepFilled,
  isProgressStepUnlocked,
  getFirstOpenProgressStep,
  getImahAingStatus,
  getImahAingStatusKey,
  getImahAingDisplayId
} from '~/constant/imah-aing-status'

export default {
  name: 'ImahAingProgress',
  props: {
    item: {
      type: Object,
      required: true
    },
    /** Data tersimpan per tahap — satu-satunya dasar buka/kunci tab */
    saved: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // Tab tahap (1–3); Bukti Transfer (langkah 0) punya card sendiri
      active: Math.max(getFirstOpenProgressStep(this.saved), 1),
      pending: null, // { step, files } menunggu konfirmasi
      toast: ''
    }
  },
  computed: {
    infoRows() {
      return [
        { label: 'Status', badge: getImahAingStatus(getImahAingStatusKey(this.item)) },
        { label: 'ID Usulan', value: getImahAingDisplayId(this.item) },
        { label: 'Nama Lengkap', value: this.item.user_name }
      ]
    },
    tabs() {
      return IMAH_AING_PROGRESS_STEPS.slice(1).map(({ label, percent }, i) => {
        const step = i + 1
        const unlocked = isProgressStepUnlocked(this.saved, step)
        let state = ''
        if (!unlocked) state = 'Terkunci'
        else if (isProgressStepFilled(this.saved[step], step)) state = '(selesai)'
        return { step, label, unlocked, note: [percent, state].filter(Boolean).join(' ') }
      })
    },
    lockMessage() {
      if (!isProgressStepFilled(this.saved[0], 0)) {
        return 'Simpan Bukti Transfer dulu untuk membuka Tahap 1.'
      }
      return this.tabs.some((tab) => !tab.unlocked)
        ? 'Tahap berikutnya terbuka setelah tahap sebelumnya disimpan.'
        : ''
    },
    confirmText() {
      const step = this.pending?.step
      if (step === undefined) return { title: '', description: '' }
      if (step === 0) {
        return {
          title: 'Simpan Bukti Transfer',
          description: 'Apakah Anda yakin ingin menyimpan bukti transfer ini?'
        }
      }
      const { label, percent } = IMAH_AING_PROGRESS_STEPS[step]
      return {
        title: 'Simpan Progres',
        description: `Apakah Anda yakin ingin menyimpan progres ${label} (${percent})?`
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown)
    clearTimeout(this.toastTimer)
  },
  methods: {
    isSelected(tab) {
      return tab.unlocked && this.active === tab.step
    },
    selectTab(tab) {
      if (tab.unlocked) this.active = tab.step
    },
    // Panah kiri/kanan hanya berkeliling di tab yang terbuka (selalu berurutan dari Tahap 1)
    moveTab(direction) {
      const count = this.tabs.filter((tab) => tab.unlocked).length
      this.active = ((this.active - 1 + direction + count) % count) + 1
      this.$el.querySelector(`#progress-tab-${this.active}`).focus()
    },
    openConfirm(step, files) {
      this.returnFocus = document.activeElement
      this.pending = { step, files }
      // Tombol pertama di popup = silang header, jadi cari tombol utama lewat teksnya
      this.$nextTick(() => {
        const buttons = Array.from(this.$refs.confirm.$el.querySelectorAll('button'))
        buttons.find((button) => button.textContent.trim() === 'Ya, Simpan')?.focus()
      })
    },
    closeConfirm() {
      this.pending = null
      this.$nextTick(() => this.returnFocus?.focus())
    },
    onKeydown(event) {
      if (this.pending && event.key === 'Escape') this.closeConfirm()
    },
    async confirmSave() {
      if (!this.pending) return
      const { step, files } = this.pending
      this.closeConfirm()
      const ok = await this.$store.dispatch('imahAingProgress/saveStep', {
        id: this.item.id,
        step,
        files
      })
      if (!ok) return
      const { label, percent } = IMAH_AING_PROGRESS_STEPS[step]
      this.showToast(
        step === 0
          ? 'Bukti transfer berhasil disimpan'
          : `Progres ${label} (${percent}) berhasil disimpan`
      )
    },
    showToast(text) {
      this.toast = text
      clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => { this.toast = '' }, 4000)
    }
  }
}
</script>
