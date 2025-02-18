<template>
  <span
    :class="[
      'px-4 py-1 text-sm font-lato font-bold rounded-full border w-fit h-fit',
      badgeClass,
    ]"
    :style="{
      borderColor: statusData.fillColor || '',
    }"
  >
    {{ statusText }}
  </span>
</template>

<script>
import { newDataStatusMilestone } from '~/constant/status-milestone'

export default {
  props: {
    status: {
      type: String,
      default: '',
    },
  },
  computed: {
    statusData() {
      return newDataStatusMilestone[this.status] || '-'
    },
    statusText() {
      return this.statusData.textStatus || '-'
    },
    badgeClass() {
      return this.statusData.fillColor
        ? `text-[${this.statusData.fillColor}]`
        : 'text-gray-500'
    },
  },
}
</script>
