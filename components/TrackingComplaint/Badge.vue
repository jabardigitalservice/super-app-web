<template>
  <span
    class="px-4 py-1 text-sm font-lato font-bold rounded-full border w-fit h-fit"
    :style="{
      borderColor: statusData.fillColor || '',
      backgroundColor: statusData.fillColor ? `${statusData.fillColor}1A` : '',
      color: statusData.fillColor || '#868C89',
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
  },
}
</script>
