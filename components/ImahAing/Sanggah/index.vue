<template>
  <div class="px-4 py-4 md:px-7 md:py-5">
    <!-- Loading -->
    <div v-if="loading" class="space-y-3 animate-pulse">
      <div v-for="n in 5" :key="n" class="h-4 bg-gray-200 rounded dark:bg-dark-emphasis-medium" />
    </div>

    <!-- Gagal muat -->
    <div v-else-if="loadError" class="flex flex-col items-start gap-3">
      <p class="text-sm text-red-700 dark:text-red-400">{{ loadError }}</p>
      <div class="flex gap-2">
        <Button variant="primary" @click="$emit('retry')">Coba Lagi</Button>
        <Button variant="secondary" @click="$emit('back')">Kembali</Button>
      </div>
    </div>

    <template v-else-if="item">
      <!-- Info read-only -->
      <dl class="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 mb-6">
        <div v-for="row in infoRows" :key="row.label" :class="row.wide ? 'sm:col-span-2' : ''">
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
    </template>
  </div>
</template>

<script>
import {
  getImahAingStatus,
  getImahAingStatusKey,
  getImahAingDisplayId
} from '~/constant/imah-aing-status'

export default {
  name: 'ImahAingSanggah',
  props: {
    item: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadError: {
      type: String,
      default: ''
    },
    fallbackPhone: {
      type: String,
      default: ''
    }
  },
  computed: {
    infoRows() {
      const item = this.item || {}
      return [
        {
          label: 'Status',
          badge: getImahAingStatus(
            getImahAingStatusKey(item),
            item.latest_complaint_status?.name
          )
        },
        { label: 'ID Usulan', value: getImahAingDisplayId(item) },
        { label: 'Nama Lengkap', value: item.user_name || item.name },
        { label: 'No HP', value: item.user_phone || this.fallbackPhone },
        { label: 'Catatan', value: item.complaint_status_note, wide: true }
      ]
    }
  }
}
</script>
