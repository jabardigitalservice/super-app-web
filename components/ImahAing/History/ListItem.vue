<template>
  <div
    class="flex items-start gap-3 px-4 py-[14px] md:p-4 border-l-4 border-[#069550] bg-white hover:bg-gray-50 cursor-pointer transition-colors dark:bg-dark-emphasis-low dark:hover:bg-dark-emphasis-medium"
    @click="$emit('click')"
  >
    <!-- Checkbox — large tap target (44px) for mobile, stop propagation agar tidak trigger klik item -->
    <label
      class="relative flex items-center justify-center w-11 h-11 -ml-2 -mt-2 flex-shrink-0"
      :class="isVerified ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
      @click.stop
    >
      <input
        type="checkbox"
        :checked="selected"
        :disabled="isVerified"
        class="w-5 h-5 rounded border-gray-300 text-[#069550] focus:ring-[#069550] focus:ring-2"
        :class="isVerified ? 'cursor-not-allowed' : 'cursor-pointer'"
        @change="$emit('toggle')"
      />
    </label>

    <!-- Konten -->
    <div class="flex-1 min-w-0 pt-1">
      <div class="text-xs text-gray-500 font-roboto">
        IA-{{ item.user_nik || item.nik || '-' }}
      </div>
      <div class="text-sm font-semibold text-gray-900 mt-0.5 dark:text-dark-emphasis-high">
        {{ item.user_name || item.name || '-' }}
      </div>
      <div class="flex justify-between items-center mt-1">
        <span class="text-xs text-gray-600 dark:text-dark-emphasis-medium">
          {{ statusLabel }}
        </span>
        <span class="text-xs text-gray-400 flex-shrink-0 ml-2">
          {{ formattedDate }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils'

export default {
  name: 'ImahAingHistoryListItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isVerified() {
      return (this.item.complaint_status_id || this.item.phase || this.item.status) === 'verified'
    },
    statusLabel() {
      const name = this.item.complaint_status?.name
      if (name) return name

      // Fallback for mock data or other sources
      const phase = this.item.phase || this.item.status || ''
      const mapping = {
        unverified: 'Menunggu Verifikasi',
        verified: 'Terverifikasi',
        failed: 'Gagal Diverifikasi',
        directed_to_hotline_jabar: 'Dialihkan ke Hotline Jabar'
      }
      return mapping[phase] || phase || '-'
    },
    formattedDate() {
      const date = this.item.created_at || this.item.submitted_at
      return formatDate(date, 'dd MMM yyyy')
    }
  }
}
</script>
