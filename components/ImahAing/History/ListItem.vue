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

    <!-- Kolom Konten: NIK, nama, status (tanpa tanggal) -->
    <div class="flex-1 min-w-0 pt-1">
      <div class="text-xs text-gray-500 font-roboto">
        IA-{{ item.user_nik || item.nik || '-' }}
      </div>
      <div class="text-sm font-semibold text-gray-900 mt-0.5 dark:text-dark-emphasis-high">
        {{ displayName }}
      </div>
      <!-- TODO(BE): proposer_role field needed from list complaints endpoint for non-self items -->
      <div v-if="proposerRoleLabel" class="text-xs text-gray-400 mt-0.5">
        Pengusul: {{ proposerRoleLabel }}
      </div>
      <div class="mt-1">
        <span
          class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded"
          :style="{ color: statusStyle.hex, backgroundColor: statusStyle.hex + '1A' }"
        >
          {{ statusStyle.name }}
        </span>
      </div>
    </div>

    <!-- Kolom Kanan: Tanggal (atas) + Tombol Edit + Info Icon (bawah) -->
    <div
      class="flex flex-col flex-shrink-0 items-end gap-2 self-stretch"
      :class="{ 'justify-center': !canEdit }"
    >
      <div class="flex items-center gap-1">
        <button
          v-if="canEdit"
          class="px-3 py-1.5 text-xs font-medium text-[#069550] bg-[#069550]/10 rounded-md hover:bg-[#069550]/20 transition-colors"
          @click.stop="$emit('edit')"
        >
          Edit Ajuan
        </button>
        <button
          type="button"
          class="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          :title="editTooltipText"
          @click.stop="$emit('show-info')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </button>
      </div>
      <span class="text-xs text-gray-400 whitespace-nowrap">
        {{ formattedDate }}
      </span>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils'
import { getImahAingStatus } from '~/constant/imah-aing-status'

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
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    isSelfItem: {
      type: Boolean,
      default: true
    },
    proposerRole: {
      type: String,
      default: ''
    }
  },
  computed: {
    /** Kunci status — satu sumber untuk isVerified dan statusStyle */
    statusKey() {
      return this.item.complaint_status?.id
        || this.item.complaint_status_id
        || this.item.phase
        || this.item.status
        || ''
    },
    isVerified() {
      return this.statusKey === 'verified'
    },
    /** Objek style guide (name + hex) dari mapping 13 status */
    statusStyle() {
      return getImahAingStatus(this.statusKey)
    },
    /** Label status dari mapping style guide */
    statusLabel() {
      return this.statusStyle.name
    },
    formattedDate() {
      const date = this.item.created_at || this.item.submitted_at
      return formatDate(date, 'dd MMM yyyy')
    },
    displayName() {
      const raw = this.item.user_name || this.item.name || ''
      if (!raw) return '-'
      return this.isSelfItem ? raw : this.maskName(raw)
    },
    proposerRoleLabel() {
      const ROLE_LABELS = {
        warga: 'Warga',
        rt: 'Ketua RT',
        rw: 'Ketua RW',
        kadus: 'Kepala Dusun',
        kades: 'Kepala Desa',
        lurah: 'Lurah',
      }
      const key = (this.proposerRole || '').trim().toLowerCase()
      return ROLE_LABELS[key] || ''
    },
    editTooltipText() {
      return 'Usulan hanya dapat di-update oleh Pengusul. Proses Update hanya berlaku selama Usulan masih dalam status Menunggu Verifikasi atau Tahap Verifikasi'
    }
  },
  methods: {
    maskName(fullName) {
      return fullName
        .split(' ')
        .map((word) => {
          if (word.length <= 2) return word.toUpperCase()
          return word.substring(0, 2).toUpperCase() + '*'.repeat(Math.min(word.length - 2, 6))
        })
        .join(' ')
    }
  }
}
</script>
