<template>
  <div class="w-full min-h-[400px]">
    <TrackingComplaintLoading v-show="isLoadingTracking" />

    <div v-show="!isLoadingTracking">
      <TrackingComplaintNoData
        v-show="dataTracking.length === 0"
        :title="
          errorMessage
            ? 'Data aduan tidak ditemukan'
            : `Cari aduan terlebih dahulu`
        "
      />
      <MilestoneNew
        v-show="dataTracking.length > 0"
        :data-milestone="dataTracking"
        class="mt-[32px]"
      />
    </div>
  </div>
</template>

<script>
import MilestoneNew from '~/components/TrackingComplaint/History/MilestoneNew.vue'

export default {
  components: { MilestoneNew },
  props: {
    dataTracking: { type: Array, default: () => [] },
    isLoadingTracking: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
}
</script>
