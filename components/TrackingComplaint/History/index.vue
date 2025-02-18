<template>
  <div>
    <!-- TODO: ADD LOADING -->
    <div v-if="loading">Loading...</div>

    <div v-else>
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
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
