<template>
  <div class="px-4 py-4 md:px-7 md:py-5">
    <!-- `inert` menahan fokus keyboard di popup konfirmasi -->
    <div :inert="!!pending">
      <div class="rounded-lg border border-gray-200 p-3 dark:border-dark-emphasis-medium">
        <div class="text-xs text-gray-500 font-roboto dark:text-dark-text-medium">
          {{ displayId }}
        </div>
        <div class="mt-0.5 text-sm font-semibold text-gray-900 break-words dark:text-dark-text-high">
          {{ item.user_name || '-' }}
        </div>
        <span
          class="mt-1 inline-flex items-center text-xs font-medium px-2 py-0.5 rounded"
          :style="{ color: statusStyle.hex, backgroundColor: statusStyle.hex + '1A' }"
        >
          {{ statusStyle.name }}
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Tahap progres dan bukti transfer"
        class="mt-4 grid grid-cols-4 border-b border-gray-200 dark:border-dark-emphasis-medium"
      >
        <button
          v-for="(tab, index) in tabs"
          :id="`progress-tab-${index}`"
          :key="tab.label"
          ref="tabs"
          type="button"
          role="tab"
          :aria-selected="String(active === index)"
          :aria-controls="`progress-panel-${index}`"
          :tabindex="active === index ? 0 : -1"
          :disabled="!tab.unlocked"
          class="min-h-[56px] px-1 py-2 text-[13px] font-medium font-roboto border-b-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          :class="
            active === index
              ? 'border-green-700 text-green-800 dark:border-green-400 dark:text-green-300'
              : 'border-transparent text-gray-700 dark:text-dark-text-medium'
          "
          @click="selectTab(index)"
          @keydown.left.prevent="moveTab(-1)"
          @keydown.right.prevent="moveTab(1)"
        >
          <span class="block">{{ tab.label }}</span>
          <span class="block text-xs font-normal">{{ tab.note }}</span>
        </button>
      </div>

      <p
        v-if="tabs.some((tab) => !tab.unlocked)"
        class="mt-2 text-xs text-gray-600 dark:text-dark-text-medium"
      >
        Tahap berikutnya terbuka setelah tahap sebelumnya disimpan.
      </p>

      <!-- Panel yang terbuka tetap ter-mount supaya draft tidak hilang saat pindah tab -->
      <div
        v-for="(tab, index) in tabs"
        v-show="active === index"
        :id="`progress-panel-${index}`"
        :key="tab.label"
        role="tabpanel"
        :aria-labelledby="`progress-tab-${index}`"
        class="pt-4"
      >
        <ImahAingProgressStepPanel
          v-if="tab.unlocked"
          :step="index"
          :saved="saved[index]"
          @request-save="openConfirm(index, $event)"
        />
      </div>

      <Button
        class="mt-3 w-full !justify-center md:w-fit"
        variant="secondary"
        type="button"
        @click="$emit('back')"
      >
        Kembali
      </Button>
    </div>

    <TrackingComplaintModal
      ref="confirm"
      :open="!!pending"
      label-primary-button="Ya, Simpan"
      label-secondary-button="Batal"
      src-icon="/icon/sent-message.svg"
      size="48px"
      :title="confirmText.title"
      :description="confirmText.description"
      @close="closeConfirm"
      @click="confirmSave"
    />

    <div
      role="status"
      :class="
        toast
          ? 'fixed bottom-6 left-4 right-4 z-20 rounded-lg bg-green-900 px-4 py-3 text-sm text-white shadow-lg md:mx-auto md:max-w-[618px]'
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
      active: getFirstOpenProgressStep(this.saved),
      pending: null, // { step, files } menunggu konfirmasi
      toast: ''
    }
  },
  computed: {
    displayId() {
      return getImahAingDisplayId(this.item)
    },
    statusStyle() {
      return getImahAingStatus(getImahAingStatusKey(this.item))
    },
    tabs() {
      return IMAH_AING_PROGRESS_STEPS.map(({ label, percent }, index) => {
        const unlocked = isProgressStepUnlocked(this.saved, index)
        let state = ''
        if (!unlocked) state = 'Terkunci'
        else if (isProgressStepFilled(this.saved[index], index)) state = '(selesai)'
        return { label, unlocked, note: [percent, state].filter(Boolean).join(' ') }
      })
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
    selectTab(index) {
      if (this.tabs[index].unlocked) this.active = index
    },
    // Panah kiri/kanan hanya berkeliling di tab yang terbuka (selalu berurutan dari tab pertama)
    moveTab(direction) {
      const count = this.tabs.filter((tab) => tab.unlocked).length
      this.active = (this.active + direction + count) % count
      this.$refs.tabs[this.active].focus()
    },
    openConfirm(step, files) {
      this.returnFocus = document.activeElement
      this.pending = { step, files }
      this.$nextTick(() => this.$refs.confirm.$el.querySelector('button')?.focus())
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
      this.toastTimer = setTimeout(() => { this.toast = '' }, 3000)
    }
  }
}
</script>
