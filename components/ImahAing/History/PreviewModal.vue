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
      <div v-if="detailLoading" class="space-y-3 animate-pulse">
        <div class="h-24 bg-gray-200 rounded-lg dark:bg-dark-emphasis-medium" />
        <div v-for="n in 5" :key="n" class="h-4 bg-gray-200 rounded dark:bg-dark-emphasis-medium" />
      </div>
      <div v-else class="space-y-4">
        <!-- Catatan Penolakan -->
        <div
          v-if="rejectionNote"
          class="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800"
        >
          <svg
            class="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <p class="text-xs font-bold text-red-600 dark:text-red-400 uppercase mb-0.5">
              Alasan Penolakan
            </p>
            <p class="text-sm text-red-700 dark:text-red-300">{{ rejectionNote }}</p>
          </div>
        </div>

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
                {{ displayNik }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs text-gray-500 uppercase font-bold">KK</span>
              <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                {{ displayKk }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs text-gray-500 uppercase font-bold">Nama</span>
              <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                {{ displayName }}
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

          <div class="border-t pt-4 dark:border-dark-emphasis-medium">
            <p class="text-xs text-gray-500 uppercase font-bold mb-3">Lokasi Tanah</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-bold">Kota/Kabupaten</span>
                <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                  {{ cityName }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-bold">Kecamatan</span>
                <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                  {{ districtName }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-bold">Kelurahan/Desa</span>
                <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                  {{ villageName }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-bold">Dusun</span>
                <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                  {{ dusun }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-bold">RW</span>
                <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                  {{ rw }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-bold">RT</span>
                <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                  {{ rt }}
                </p>
              </div>
              <div v-if="locationAddress !== '-'" class="space-y-1 md:col-span-2">
                <span class="text-xs text-gray-500 uppercase font-bold">Alamat</span>
                <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                  {{ locationAddress }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { formatDate } from '~/utils'
import { getImahAingStatus } from '~/constant/imah-aing-status'

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
    isSelfItem: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      detail: null,
      detailLoading: false,
    }
  },
  computed: {
    resolvedItem() {
      return this.detail || this.item
    },
    displayName() {
      const raw = this.item?.user_name || this.item?.name || ''
      if (!raw) return '-'
      return this.isSelfItem ? raw : this.maskName(raw)
    },
    displayNik() {
      const raw = this.item?.user_nik || this.item?.nik || ''
      if (!raw) return '-'
      return this.isSelfItem ? raw : this.maskNumber(raw)
    },
    displayKk() {
      const raw = this.item?.user_kk || this.item?.kk || ''
      if (!raw) return '-'
      return this.isSelfItem ? raw : this.maskNumber(raw)
    },
    photos() {
      if (!this.isSelfItem) return []
      const photos = this.resolvedItem?.photos || this.resolvedItem?.images || []
      return Array.isArray(photos) ? photos : []
    },
    isRejected() {
      const key =
        this.resolvedItem?.complaint_status_id ||
        this.resolvedItem?.phase ||
        this.resolvedItem?.status ||
        ''
      return ['rejected_appeal', 'rejected_criteria'].includes(key)
    },
    rejectionNote() {
      if (!this.isRejected) return ''
      return this.resolvedItem?.complaint_status_note || ''
    },
    statusLabel() {
      if (this.resolvedItem?.complaint_status?.name) {
        return this.resolvedItem.complaint_status.name
      }
      const key =
        this.resolvedItem?.complaint_status_id ||
        this.resolvedItem?.phase ||
        this.resolvedItem?.status ||
        ''
      return getImahAingStatus(key).name
    },
    formattedDate() {
      const date = this.resolvedItem?.created_at || this.resolvedItem?.submitted_at || ''
      return date ? formatDate(date, 'dd MMMM yyyy') : '-'
    },
    cityName() {
      return this.resolvedItem?.city_name || this.resolvedItem?.cityName || '-'
    },
    districtName() {
      return this.resolvedItem?.district_name || this.resolvedItem?.districtName || '-'
    },
    villageName() {
      // detail response uses subdistrict_name; list response uses village_name
      return this.resolvedItem?.subdistrict_name || this.resolvedItem?.village_name || this.resolvedItem?.villageName || '-'
    },
    dusun() {
      return this.resolvedItem?.dusun_name || '-'
    },
    rw() {
      return this.resolvedItem?.rw || '-'
    },
    rt() {
      return this.resolvedItem?.rt || '-'
    },
    locationAddress() {
      return this.resolvedItem?.address || this.resolvedItem?.place?.address || '-'
    },
  },
  watch: {
    open(val) {
      if (val && this.item?.id) {
        this.loadDetail()
      } else {
        this.detail = null
      }
    },
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
    },
    maskNumber(value) {
      if (value.length <= 8) return value
      return value.substring(0, 4) + '********' + value.slice(-4)
    },
    async loadDetail() {
      this.detailLoading = true
      try {
        this.detail = await this.$store.dispatch('imahAingHistory/fetchDetail', this.item.id)
      } catch (_) {
        // fall back to item prop silently
      } finally {
        this.detailLoading = false
      }
    },
  },
}
</script>
