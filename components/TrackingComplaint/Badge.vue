<template>
  <span :class="['px-4 py-1 text-sm font-lato font-medium rounded-full border w-fit h-fit', badgeClass]">
    {{ label || '-' }}
  </span>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    }
  },
  computed: {
    badgeClass () {
      const statusColors = {
        MENUNGGU: 'text-yellow-500 border-yellow-500 bg-yellow-100',
        TERVERIIKASI: 'text-orange-500 border-orange-500 bg-orange-100',
        DIKOORDINASI: 'text-blue-500 border-blue-500 bg-blue-100',
        DITINDAKLANJUTI: 'text-orange-600 border-orange-600 bg-orange-200',
        DIKERJAKAN: 'text-blue-500 border-blue-500 bg-blue-100',
        SELESAI: 'text-green-500 border-green-500 bg-green-100',
        DITUNDA: 'text-purple-500 border-purple-500 bg-purple-100',
        DITOLAK: 'text-red-500 border-red-500 bg-red-100',
        NONE: 'text-gray-500 border-gray-500 bg-gray-100'
      }

      return statusColors[this.status]
    }
  }
}
</script>
