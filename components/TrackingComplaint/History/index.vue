<template>
  <div>
    <TrackingComplaintLoading v-if="isLoading" />

    <div v-else>
      <TrackingComplaintNoData
        v-if="dataTracking.length === 0"
        title="Aduan tidak ditemukan"
      />
      <MilestoneNew :data-milestone="dataTracking" class="mt-[32px]" />
    </div>
  </div>
</template>

<script>
import MilestoneNew from '~/components/TrackingComplaint/History/MilestoneNew.vue'

export default {
  components: { MilestoneNew },
  props: {
    dataTracking: { type: Array, default: () => [] },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
