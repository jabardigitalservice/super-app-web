<template>
  <div>
    <!-- TODO: ADD LOADING -->
    <div v-if="isLoading" class="flex items-center justify-center">
      <div
        class="border-t-transparent border-solid animate-spin rounded-full border-green-600 border-8 h-14 w-14"
      />
    </div>

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
