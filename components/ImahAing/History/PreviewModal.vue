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
                {{ resolvedItem?.user_nik || resolvedItem?.nik || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs text-gray-500 uppercase font-bold">KK</span>
              <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                {{ resolvedItem?.user_kk || resolvedItem?.kk || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs text-gray-500 uppercase font-bold">Nama</span>
              <p class="text-sm font-medium text-gray-900 dark:text-dark-emphasis-high">
                {{ resolvedItem?.user_name || resolvedItem?.name || '-' }}
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
    photos() {
      const photos = this.resolvedItem?.photos || this.resolvedItem?.images || []
      return Array.isArray(photos) ? photos : []
    },
    statusLabel() {
      // detail response: complaint_status.name (ready-to-display) or complaint_status_id (key)
      // list response: phase or status (key)
      if (this.resolvedItem?.complaint_status?.name) {
        return this.resolvedItem.complaint_status.name
      }
      const phase =
        this.resolvedItem?.complaint_status_id ||
        this.resolvedItem?.phase ||
        this.resolvedItem?.status ||
        ''
      const mapping = {
        unverified: 'Menunggu Verifikasi',
        verified: 'Terverifikasi',
        failed: 'Gagal Diverifikasi',
        directed_to_hotline_jabar: 'Dialihkan ke Hotline Jabar',
      }
      return newDataStatusMilestone[phase]?.name || mapping[phase] || phase || '-'
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
