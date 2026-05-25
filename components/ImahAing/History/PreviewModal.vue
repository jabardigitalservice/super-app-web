<template>
  <BaseModal
    :is-open="open"
    width="min(100%, 600px)"
    :with-close-button="true"
    @close="$emit('close')"
  >
    <template #header>
      <h4 class="font-roboto text-[21px] font-bold leading-8 text-green-800">
        Detail Pengajuan
      </h4>
    </template>
    <template #content>
      <div class="space-y-4">
        <!-- Foto Rumah (jika ada) -->
        <div v-if="photos.length" class="flex gap-2 overflow-x-auto pb-2">
          <img
            v-for="(photo, i) in photos"
            :key="i"
            :src="photo.url || photo"
            class="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-200"
            alt="Foto Rumah"
          />
        </div>

        <!-- Info Fields -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <span class="text-xs text-gray-500 uppercase font-bold">NIK</span>
              <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                IA-{{ item?.user_nik || item?.nik || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs text-gray-500 uppercase font-bold">Nama</span>
              <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                {{ item?.user_name || item?.name || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs text-gray-500 uppercase font-bold">Status</span>
              <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                {{ statusLabel }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs text-gray-500 uppercase font-bold">Tanggal Pengajuan</span>
              <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                {{ formattedDate }}
              </p>
            </div>
          </div>

          <div class="space-y-1 border-t pt-4 dark:border-dark-emphasis-medium">
            <span class="text-xs text-gray-500 uppercase font-bold">Deskripsi</span>
            <p class="text-sm text-gray-700 dark:text-dark-emphasis-high whitespace-pre-line">
              {{ item?.description || '-' }}
            </p>
          </div>

          <div class="space-y-1 border-t pt-4 dark:border-dark-emphasis-medium">
            <span class="text-xs text-gray-500 uppercase font-bold">Alamat</span>
            <p class="text-sm text-gray-700 dark:text-dark-emphasis-high whitespace-pre-line">
              {{ item?.address || '-' }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { formatDate } from '~/utils'
import { newDataStatusMilestone } from '~/constant/status-milestone'

export default {
  name: 'ImahAingHistoryPreviewModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    photos() {
      const photos = this.item?.photos || this.item?.images || []
      return Array.isArray(photos) ? photos : []
    },
    statusLabel() {
      const phase = this.item?.phase || this.item?.status || ''
      // Fallback mapping if not in newDataStatusMilestone
      const mapping = {
        unverified: 'Menunggu Verifikasi',
        verified: 'Terverifikasi',
        failed: 'Gagal Diverifikasi',
        directed_to_hotline_jabar: 'Dialihkan ke Hotline Jabar',
      }
      return newDataStatusMilestone[phase]?.name || mapping[phase] || phase || '-'
    },
    formattedDate() {
      const date = this.item?.created_at || this.item?.submitted_at || ''
      return date ? formatDate(date, 'dd MMMM yyyy') : '-'
    },
  },
}
</script>
